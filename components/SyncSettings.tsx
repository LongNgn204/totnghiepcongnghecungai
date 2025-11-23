import React, { useState, useEffect } from 'react';
import { RefreshCw, Cloud, Clock, Check, Info, Loader } from 'lucide-react';
import syncManager from '../utils/syncManager';

const SyncSettings: React.FC = () => {
  const [config, setConfig] = useState(syncManager.getConfig());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setConfig(syncManager.getConfig());
  }, []);

  const handleToggleAutoSync = () => {
    const newConfig = { ...config, autoSync: !config.autoSync };
    setConfig(newConfig);
    setSaving(true);
    syncManager.saveConfig(newConfig);
    setTimeout(() => setSaving(false), 500);
  };

  const handleToggleEnabled = () => {
    const newConfig = { ...config, enabled: !config.enabled };
    setConfig(newConfig);
    setSaving(true);
    syncManager.saveConfig(newConfig);
    setTimeout(() => setSaving(false), 500);
  };

  const handleIntervalChange = (minutes: number) => {
    const newConfig = { ...config, syncInterval: minutes * 60 * 1000 };
    setConfig(newConfig);
    setSaving(true);
    syncManager.saveConfig(newConfig);
    setTimeout(() => setSaving(false), 500);
  };

  const handleSyncNow = async () => {
    setSaving(true);
    await syncManager.syncAll();
    setSaving(false);
  };

  const lastSyncTime = syncManager.getLastSyncTime();
  const lastSyncDate = lastSyncTime ? new Date(lastSyncTime) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <RefreshCw className="w-6 h-6 text-blue-600" />
          </div>
          Cài đặt đồng bộ
        </h2>
        <p className="text-gray-600 ml-11">
          Quản lý trạng thái đồng bộ dữ liệu đám mây
        </p>
      </div>

      {/* Status */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-4 rounded-full shadow-sm">
              <Cloud className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1 uppercase tracking-wide">Lần đồng bộ cuối</p>
              <p className="text-2xl font-bold text-gray-900">
                {lastSyncDate ? lastSyncDate.toLocaleString('vi-VN') : 'Chưa đồng bộ'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSyncNow}
            disabled={saving || !config.enabled}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-3"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Đồng bộ ngay
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Enable/Disable Sync */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Bật đồng bộ
            </h3>
            <p className="text-sm text-gray-600">
              Tự động lưu dữ liệu lên cloud và đồng bộ giữa thiết bị
            </p>
          </div>
          <button
            onClick={handleToggleEnabled}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              config.enabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                config.enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {config.enabled && (
          <>
            {/* Auto Sync */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Tự động đồng bộ
                </h3>
                <p className="text-sm text-gray-600">
                  Đồng bộ định kỳ khi có kết nối Internet
                </p>
              </div>
              <button
                onClick={handleToggleAutoSync}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  config.autoSync ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    config.autoSync ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sync Interval */}
            {config.autoSync && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Tần suất đồng bộ
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { minutes: 0.5, label: '30 giây' },
                    { minutes: 1, label: '1 phút' },
                    { minutes: 5, label: '5 phút' },
                    { minutes: 15, label: '15 phút' },
                    { minutes: 30, label: '30 phút' },
                    { minutes: 60, label: '1 giờ' },
                  ].map(({ minutes, label }) => (
                    <button
                      key={minutes}
                      onClick={() => handleIntervalChange(minutes)}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        config.syncInterval === minutes * 60 * 1000
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Thông tin bảo mật
        </h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <span>Dữ liệu được mã hóa đầu cuối và lưu trữ an toàn trên Cloudflare R2.</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <span>Đồng bộ thời gian thực: Đề thi, Flashcards, Lịch sử chat, Tiến độ.</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <span>Chế độ Offline-first: Tiếp tục học ngay cả khi mất mạng.</span>
          </li>
        </ul>
      </div>

      {saving && (
        <div className="fixed bottom-6 left-6 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-3 z-50">
          <Check className="w-5 h-5 text-green-400" />
          <span className="font-medium">Đã lưu cài đặt thành công</span>
        </div>
      )}
    </div>
  );
};

export default SyncSettings;
