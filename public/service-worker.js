// Service Worker for PWA offline functionality
const CACHE_NAME = 'ai-hoc-tap-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Files to cache on install
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting(); // Force activation immediately
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static files');
      return cache.addAll(STATIC_FILES);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  return self.clients.claim(); // Take control immediately
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome-extension and non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 1. Auth Endpoints - STRICTLY NETWORK ONLY
  // This fixes the issue where auth status (401/200) gets cached incorrectly
  if (url.pathname.includes('/auth/')) {
    // Do not verify with cache, do not save to cache.
    // Just let the browser perform the fetch.
    return; 
  }

  // 2. API requests - Network First, Cache Fallback
  if (url.pathname.includes('/api/') || url.pathname.includes('generativelanguage')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Check if valid response to cache
          // Only cache GET requests and successful 200 OK responses
          // Do NOT cache 401, 403, 500, etc.
          if (request.method === 'GET' && response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline JSON
            return new Response(
              JSON.stringify({ error: 'Offline - No cached data available' }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 503,
              }
            );
          });
        })
    );
    return;
  }

  // 3. Static files - Cache First, Network Fallback (Stale-While-Revalidate logic)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version and update cache in background
        fetch(request)
          .then((networkResponse) => {
            // Only update cache if successful
            if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
                const responseClone = networkResponse.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(request, responseClone);
                });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone response to cache it
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            if (request.method === 'GET') {
              cache.put(request, responseClone);
            }
          });

          return response;
        })
        .catch(() => {
          // Return offline fallback
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});

// Background sync for pending actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-exam-results') {
    event.waitUntil(syncExamResults());
  } else if (event.tag === 'sync-flashcards') {
    event.waitUntil(syncFlashcards());
  } else if (event.tag === 'sync-chat-history') {
    event.waitUntil(syncChatHistory());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'AI Học Tập';
  const options = {
    body: data.body || 'Bạn có thông báo mới!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Xem ngay' },
      { action: 'close', title: 'Đóng' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const url = event.notification.data || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Sync functions
async function syncExamResults() {
  try {
    const pendingResults = await getFromIndexedDB('pending-exam-results');
    if (pendingResults && pendingResults.length > 0) {
      // Send to server when online
      console.log('[Service Worker] Syncing exam results:', pendingResults.length);
      // Implementation depends on your backend
    }
  } catch (error) {
    console.error('[Service Worker] Sync exam results failed:', error);
  }
}

async function syncFlashcards() {
  try {
    const pendingCards = await getFromIndexedDB('pending-flashcards');
    if (pendingCards && pendingCards.length > 0) {
      console.log('[Service Worker] Syncing flashcards:', pendingCards.length);
      // Implementation depends on your backend
    }
  } catch (error) {
    console.error('[Service Worker] Sync flashcards failed:', error);
  }
}

async function syncChatHistory() {
  try {
    const pendingChats = await getFromIndexedDB('pending-chats');
    if (pendingChats && pendingChats.length > 0) {
      console.log('[Service Worker] Syncing chat history:', pendingChats.length);
      // Implementation depends on your backend
    }
  } catch (error) {
    console.error('[Service Worker] Sync chat history failed:', error);
  }
}

// IndexedDB helper (simplified)
function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    // This is a simplified version
    // In production, implement proper IndexedDB operations
    resolve([]);
  });
}

