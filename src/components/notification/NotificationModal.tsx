import { useState } from 'react';
import { useAlert } from '../context/AlertContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  // ✅ 전역 알림 상태
  const { alerts, markAllAsRead, removeAlert } = useAlert();

  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  if (!isOpen && !isClosing) return null;

  // 컴포넌트 마운트 시 애니메이션 시작
  if (isOpen && isOpening) {
    setTimeout(() => setIsOpening(false), 10);
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsOpening(true);
      onClose();
    }, 300);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 🔥 개별 알림 삭제
  const handleRemoveAlert = (alertId: number) => {
    setRemovingIds(prev => new Set(prev).add(alertId));
    
    setTimeout(() => {
      removeAlert(alertId);
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }, 300);
  };

  // 🔥 모두 읽음으로 표시 (슬라이드 애니메이션)
  const handleMarkAllAsRead = () => {
    if (alerts.length === 0) return;
    
    // 모든 알림 ID를 removingIds에 추가
    const allIds = new Set(alerts.map(alert => alert.id));
    setRemovingIds(allIds);

    // 애니메이션 완료 후 실제로 삭제
    setTimeout(() => {
      markAllAsRead();
      setRemovingIds(new Set());
    }, 300 + (alerts.length * 50));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isClosing ? 'bg-opacity-0' : 'bg-opacity-50'
        }`}
        onClick={handleClose}
      />

      {/* 모달 */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          isClosing || isOpening ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">알림</h2>
            <p className="text-sm text-gray-500 mt-1">
              최근 알림 {alerts.length}개
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 알림 리스트 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <div className="space-y-3">
            {alerts.length === 0 && (
              <p className="text-sm text-gray-400 text-center mt-10">
                새로운 알림이 없습니다
              </p>
            )}

            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => handleRemoveAlert(alert.id)}
                className={`p-4 rounded-lg border transition-all duration-300 ease-out ${getSeverityColor(alert.severity)} hover:shadow-md cursor-pointer ${
                  removingIds.has(alert.id)
                    ? 'translate-x-full opacity-0 h-0 mb-0 py-0 overflow-hidden'
                    : 'translate-x-0 opacity-100'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm">{alert.type}</span>
                  <span className="text-xs text-gray-600">{alert.time}</span>
                </div>
                <p className="text-sm mb-2">{alert.message}</p>
                <p className="text-xs text-gray-600">{alert.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleMarkAllAsRead}
            disabled={alerts.length === 0}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              alerts.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            모두 읽음으로 표시
          </button>
        </div>
      </div>
    </>
  );
}