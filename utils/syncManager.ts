// Sync Manager - Đồng bộ localStorage với backend

import { api } from './apiClient';
import { getExamHistory, saveExamToHistory } from './examStorage';
import { getAllDecks, saveDeck } from './flashcardStorage';
import { getChatHistory, saveChatSession } from './chatStorage';
import { recordStudySession } from './studyProgress';

interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // milliseconds
  enabled: boolean;
}

class SyncManager {
  private isSyncPaused: boolean = false;
  private config: SyncConfig;
  private syncInProgress = false;
  private lastSyncTime = 0;
  private syncTimer: number | null = null;

  constructor() {
    this.config = this.loadConfig();
    if (this.config.autoSync && this.config.enabled) {
      this.startAutoSync();
    }
    // Sync when back online
    window.addEventListener('online', () => {
      if (this.config.enabled) {
        this.syncAll();
      }
    });
  }

  private loadConfig(): SyncConfig {
    const stored = localStorage.getItem('sync_config');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      autoSync: true,
      syncInterval: 30 * 1000, // 30 seconds
      enabled: true,
    };
  }

  saveConfig(config: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...config };
    localStorage.setItem('sync_config', JSON.stringify(this.config));
    if (this.config.autoSync && this.config.enabled) {
      this.startAutoSync();
    } else {
      this.stopAutoSync();
    }
  }

  getConfig(): SyncConfig {
    return { ...this.config };
  }

  // ============= SYNC EXAMS =============
  async syncExams(): Promise<void> {
    try {
      console.log('[Sync] Syncing exams...');
      const localExams = getExamHistory();
      const serverResponse = await api.exams.getAll(100, 0);
      const serverExams = serverResponse.data.exams;

      const toUpload = localExams.filter(local => !serverExams.some(server => server.id === local.id));
      for (const exam of toUpload) {
        try {
          await api.exams.create(exam);
          console.log('[Sync] Uploaded exam:', exam.id);
        } catch (error) {
          console.error('[Sync] Failed to upload exam:', exam.id, error);
        }
      }

      const toDownload = serverExams.filter(server => !localExams.some(local => local.id === server.id));
      for (const exam of toDownload) {
        try {
          saveExamToHistory(exam);
          console.log('[Sync] Downloaded exam:', exam.id);
        } catch (error) {
          console.error('[Sync] Failed to download exam:', exam.id, error);
        }
      }

      console.log('[Sync] Exams synced:', { uploaded: toUpload.length, downloaded: toDownload.length });
    } catch (error) {
      console.error('[Sync] Exam sync failed:', error);
      throw error;
    }
  }

  // ============= SYNC FLASHCARDS =============
  async syncFlashcards(): Promise<void> {
    try {
      console.log('[Sync] Syncing flashcards...');
      const localDecks = getAllDecks();
      const serverResponse = await api.flashcards.decks.getAll();
      const serverDecks = serverResponse.data.decks;

      const toUpload = localDecks.filter(local => !serverDecks.some(server => server.id === local.id));
      for (const deck of toUpload) {
        try {
          await api.flashcards.decks.create(deck);
          const cards = deck.cards || [];
          for (const card of cards) {
            await api.flashcards.decks.addCard(deck.id, card);
          }
          console.log('[Sync] Uploaded deck:', deck.id);
        } catch (error) {
          console.error('[Sync] Failed to upload deck:', deck.id, error);
        }
      }

      const toDownload = serverDecks.filter(server => !localDecks.some(local => local.id === server.id));
      for (const deck of toDownload) {
        try {
          const fullDeck = await api.flashcards.decks.getById(deck.id);
          saveDeck(fullDeck.data);
          console.log('[Sync] Downloaded deck:', deck.id);
        } catch (error) {
          console.error('[Sync] Failed to download deck:', deck.id, error);
        }
      }

      console.log('[Sync] Flashcards synced:', { uploaded: toUpload.length, downloaded: toDownload.length });
    } catch (error) {
      console.error('[Sync] Flashcard sync failed:', error);
      throw error;
    }
  }

  // ============= SYNC CHAT =============
  async syncChat(): Promise<void> {
    try {
      console.log('[Sync] Syncing chat...');
      const localChatsRaw = await getChatHistory();
      const localChats = Array.isArray(localChatsRaw) ? localChatsRaw : [];
      if (!Array.isArray(localChats)) {
        console.warn('[Sync] localChats is not an array, resetting to empty array');
      }
      const serverResponse = await api.chat.getAll();
      const serverChats = serverResponse.data.sessions;

      const toUpload = localChats.filter(local => !serverChats.some(server => server.id === local.id));
      for (const chat of toUpload) {
        try {
          await api.chat.create(chat);
          console.log('[Sync] Uploaded chat:', chat.id);
        } catch (error) {
          console.error('[Sync] Failed to upload chat:', chat.id, error);
        }
      }

      const toDownload = serverChats.filter(server => !localChats.some(local => local.id === server.id));
      for (const chat of toDownload) {
        try {
          saveChatSession(chat);
          console.log('[Sync] Downloaded chat:', chat.id);
        } catch (error) {
          console.error('[Sync] Failed to download chat:', chat.id, error);
        }
      }

      console.log('[Sync] Chat synced:', { uploaded: toUpload.length, downloaded: toDownload.length });
    } catch (error) {
      console.error('[Sync] Chat sync failed:', error);
      throw error;
    }
  }

  // ============= SYNC ALL =============
  async syncAll(): Promise<void> {
    if (this.syncInProgress || !this.config.enabled || !navigator.onLine) {
      console.log('[Sync] Skipped:', { inProgress: this.syncInProgress, enabled: this.config.enabled, online: navigator.onLine });
      return;
    }
    this.syncInProgress = true;
    try {
      const startTime = Date.now();
      console.log('[Sync] Starting full sync...');
      await Promise.allSettled([this.syncExams(), this.syncFlashcards(), this.syncChat()]);
      this.lastSyncTime = Date.now();
      localStorage.setItem('last_sync_time', String(this.lastSyncTime));
      const duration = Date.now() - startTime;
      console.log(`[Sync] Completed in ${duration}ms`);
      window.dispatchEvent(new CustomEvent('sync-completed', { detail: { lastSyncTime: this.lastSyncTime } }));
    } catch (error) {
      console.error('[Sync] Failed:', error);
      if ((error as any).status === 401) {
        console.warn('[Sync] 401 detected, pausing auto-sync');
        this.pauseSync();
      }
      window.dispatchEvent(new CustomEvent('sync-error', { detail: { error } }));
    } finally {
      this.syncInProgress = false;
    }
  }

  // ============= AUTO SYNC =============
  startAutoSync(): void {
    if (this.isSyncPaused) {
      console.warn('[Sync] Auto-sync not started because sync is paused');
      return;
    }
    this.stopAutoSync();
    if (!this.config.enabled) return;
    this.syncTimer = window.setInterval(() => {
      if (navigator.onLine && this.config.enabled && !this.isSyncPaused) {
        this.syncAll();
      }
    }, this.config.syncInterval);
    console.log('[Sync] Auto-sync started:', this.config.syncInterval / 1000, 'seconds');
  }

  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
      console.log('[Sync] Auto-sync stopped');
    }
  }

  pauseSync(): void {
    this.isSyncPaused = true;
    this.stopAutoSync();
    console.warn('[Sync] Sync paused due to 401 Unauthorized');
  }

  resumeSync(): void {
    this.isSyncPaused = false;
    console.log('[Sync] Resuming sync...');
    if (this.config.autoSync && this.config.enabled) {
      this.startAutoSync();
      this.syncAll();
    }
  }

  // ============= STATUS =============
  getLastSyncTime(): number {
    const stored = localStorage.getItem('last_sync_time');
    return stored ? parseInt(stored) : 0;
  }

  isSyncing(): boolean {
    return this.syncInProgress;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}

// Export singleton
export const syncManager = new SyncManager();

// Public method to pause sync externally
export const pauseSync = () => syncManager.pauseSync();

export default syncManager;
