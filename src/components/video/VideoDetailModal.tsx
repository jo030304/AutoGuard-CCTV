import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

interface VideoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  thumbnailUrl: string;
  type: string;
  location: string;
  date: string;
  time: string;
  description?: string;
}

export default function VideoDetailModal({
  isOpen,
  onClose,
  videoUrl,
  thumbnailUrl,
  type,
  location,
  date,
  time,
  description
}: VideoDetailModalProps) {

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl aspect-square flex flex-col overflow-hidden shadow-2xl">
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{type}</h3>
            <p className="text-sm text-gray-400">
              카메라 {location} · {date} {time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 transition-colors"
          >
            <IoClose />
          </button>
        </div>

        {/* ✅ 영상 재생 영역 (썸네일 대신 video 태그 사용) */}
        <div className="flex-1 bg-black relative">
          <video
            src={videoUrl}
            poster={thumbnailUrl}
            controls
            autoPlay
            loop
            className="w-full h-full object-contain"
          >
            브라우저가 video 태그를 지원하지 않습니다.
          </video>
        </div>

        <div className="bg-gray-50">
          <button
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="font-bold text-gray-800 flex items-center gap-2">
              <span className="text-blue-600">📝</span>
              상황 요약
            </span>
            {isSummaryExpanded ? (
              <MdExpandLess className="text-2xl text-gray-600" />
            ) : (
              <MdExpandMore className="text-2xl text-gray-600" />
            )}
          </button>

          {isSummaryExpanded && (
            <div className="px-6 pb-6 animate-slideDown">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {description || "상황 요약 정보가 없습니다."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-200 flex gap-3">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
          >
            새 탭에서 열기
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}