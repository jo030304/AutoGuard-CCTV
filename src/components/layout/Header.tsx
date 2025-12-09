import { useState } from 'react';
import NotificationModal from '../notification/NotificationModal';
import { IoMdRefresh } from "react-icons/io";
import { BiSolidBell } from "react-icons/bi";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // 한 바퀴 회전 후 새로고침
    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1초 동안 회전
  };

  return (
    <>
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Multimodal-CCTV
        </h1>
        <div className="flex items-center gap-4">
          {/* 알림 버튼 */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BiSolidBell className="text-2xl text-yellow-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 새로고침 버튼 */}
          <button 
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isRefreshing}
          >
            <IoMdRefresh 
              className={`text-2xl text-gray-700 ${isRefreshing ? 'animate-spin-once' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* 알림 모달 */}
      <NotificationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}