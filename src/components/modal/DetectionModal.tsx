import { useState } from 'react';

interface DetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoType: string;
  location: string;
}

export default function DetectionModal({ isOpen, onClose, videoType, location }: DetectionModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  return (
    <>
      {/* 어두운 배경 */}
      <div
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${
          isClosing ? 'bg-opacity-0' : 'bg-opacity-60'
        }`}
        onClick={handleClose}
      />

      {/* 모달 */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          isClosing ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 border-4 border-red-500 animate-glow">
          {/* 아이콘 */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-4xl">🚨</span>
            </div>
          </div>

          {/* 제목 */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            이상행동 감지!
          </h2>

          {/* 내용 */}
          <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
            <p className="text-center text-gray-800 mb-2">
              <span className="font-bold text-red-600 text-lg">{videoType}</span> 행동이 감지되었습니다
            </p>
            <p className="text-center text-sm text-gray-600">
              📍 {location}
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
            >
              확인하기
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}