import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle, WifiOff, X } from 'lucide-react';
import syncManager from '../utils/syncManager';

const SyncStatus: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Load initial state
    setEnabled(syncManager.isEnabled());
    const lastSyncTime = syncManager.getLastSyncTime();
    if (lastSyncTime) {
      setLastSync(new Date(lastSyncTime));
    }

    // Listen to sync events
    const handleSyncCompleted = (e: any) => {
      setLastSync(new Date(e.detail.lastSyncTime));
      setSyncing(false);
    };

    const handleSyncError = () => {
      setSyncing(false);
    };

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('sync-completed', handleSyncCompleted);
    window.addEventListener('sync-error', handleSyncError);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if syncing
    const checkSyncing = setInterval(() => {
      setSyncing(syncManager.isSyncing());
    }, 500);

    return () => {
      window.removeEventListener('sync-completed', handleSyncCompleted);
      window.removeEventListener('sync-error', handleSyncError);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(checkSyncing);
    };
  }, []);

  const handleSync = async () => {
    if (!online || !enabled) return;
    setSyncing(true);
    await syncManager.syncAll();
  };

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    syncManager.saveConfig({ enabled: newEnabled });
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return 'Chưa đồng bộ';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return date.toLocaleString('vi-VN');
  };

  if (!enabled) {
    return (
      <div className="fixed bottom-4 right-4 z-50 group">
        <div className="bg-gray-100/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200 p-2 flex items-center gap-2 transition-all duration-300 hover:pr-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <CloudOff className="w-4 h-4" />
          </div>
          <div className="w-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 opacity-0 transition-all duration-300 whitespace-nowrap flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Đã tắt đồng bộ</span>
            <button
              onClick={handleToggle}
              className="text-blue-600 hover:text-blue-700 text-xs font-bold hover:underline"
            >
              Bật lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 group">
      <div className={`bg-white/90 backdrop-blur-xl rounded-full shadow-xl border transition-all duration-300 p-1.5 flex items-center gap-3 ${
        syncing ? 'border-blue-200 pr-4 shadow-blue-500/20' :
        !online ? 'border-amber-200 pr-4 shadow-amber-500/20' :
        'border-gray-100 hover:pr-4 hover:shadow-lg'
      }`}>
        
        {/* Icon Indicator */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          syncing ? 'bg-blue-50 text-blue-600 rotate-180' :
          !online ? 'bg-amber-50 text-amber-500' :
          'bg-green-50 text-green-600'
        }`}>
          {syncing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : !online ? (
            <WifiOff className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
        </div>

        {/* Content - Auto expand on hover or important state */}
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${
          syncing || !online ? 'w-auto opacity-100' : 'w-0 opacity-0 group-hover:w-auto group-hover:opacity-100'
        }`}>
          <div className="flex flex-col whitespace-nowrap">
            <span className={`text-xs font-bold ${
              syncing ? 'text-blue-600' :
              !online ? 'text-amber-600' :
              'text-gray-700'
            }`}>
              {syncing ? 'Đang đồng bộ...' :
               !online ? 'Mất kết nối' :
               'Đã đồng bộ'}
            </span>
            {!syncing && online && (
              <span className="text-[10px] text-gray-400 font-medium">{formatTime(lastSync)}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center border-l border-gray-200 pl-2 ml-1 gap-1">
            <button
              onClick={handleSync}
              disabled={syncing || !online}
              className={`p-1.5 rounded-lg transition-all ${
                syncing || !online
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title="Đồng bộ ngay"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleToggle}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Tắt đồng bộ"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncStatus;
