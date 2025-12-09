import { useState } from 'react';

interface Alert {
  id: number;
  type: string;
  location: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);

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
    }, 300); // 애니메이션 시간과 동일
  };

  // 더미 알림 데이터
  const alerts: Alert[] = [
    {
      id: 1,
      type: '폭행',
      location: 'CCTV #1 - 입구',
      time: '2분 전',
      severity: 'high',
      message: '폭행 의심 행동이 감지되었습니다'
    },
    {
      id: 2,
      type: '절도',
      location: 'CCTV #3 - 주차장',
      time: '15분 전',
      severity: 'medium',
      message: '절도 의심 행동이 감지되었습니다'
    },
    {
      id: 3,
      type: '실신',
      location: 'CCTV #2 - 복도',
      time: '1시간 전',
      severity: 'high',
      message: '사람이 쓰러져 있습니다'
    },
    {
      id: 4,
      type: '기물파손',
      location: 'CCTV #4 - 후문',
      time: '3시간 전',
      severity: 'medium',
      message: '기물 파손 의심 행동이 감지되었습니다'
    },
    {
      id: 5,
      type: '싸움',
      location: 'CCTV #1 - 입구',
      time: '5시간 전',
      severity: 'high',
      message: '싸움 의심 행동이 감지되었습니다'
    },
  ];

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

  return (
    <>
      {/* 어두운 배경 (Overlay) */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isClosing ? 'bg-opacity-0' : 'bg-opacity-50'
        }`}
        onClick={handleClose}
      />

      {/* 모달 - 오른쪽에서 슬라이드 */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
        isClosing || isOpening ? 'translate-x-full' : 'translate-x-0'
      }`}>
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">알림</h2>
            <p className="text-sm text-gray-500 mt-1">최근 알림 {alerts.length}개</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 알림 리스트 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} hover:shadow-md transition-shadow cursor-pointer`}
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

        {/* 하단 버튼 */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            모두 읽음으로 표시
          </button>
        </div>
      </div>
    </>
  );
}