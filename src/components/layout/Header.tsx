import { useState } from 'react';
import NotificationModal from '../notification/NotificationModal';
import { IoMdRefresh } from "react-icons/io";
import { BiSolidBell } from "react-icons/bi";
import { useAlert } from '../context/AlertContext';

export default function Header() {
  // ✅ 여기! 컴포넌트 안에서 호출
  const { unreadCount } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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

            {/* ✅ unreadCount 있을 때만 빨간 점 */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* 새로고침 버튼 */}
          <button 
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isRefreshing}
          >
            <IoMdRefresh 
              className={`text-2xl text-gray-700 ${
                isRefreshing ? 'animate-spin-once' : ''
              }`}
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
