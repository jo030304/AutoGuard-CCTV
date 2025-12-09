import { useState, useEffect } from 'react';

interface VideoItem {
  id: number;
  type: string;
  location: string;
  time: string;
  timestamp: Date;
  severity: 'high' | 'medium';
  description: string;
}

interface NewVideosProps {
  onVideoCountChange: (count: number) => void;
}

export default function NewVideos({ onVideoCountChange }: NewVideosProps) {
  // 새 영상 데이터 (나중에 실제 API 연동)
  const [newVideos, setNewVideos] = useState<VideoItem[]>([
    {
      id: 1,
      type: '폭행',
      location: 'CCTV #1 - 입구',
      time: '2분 전',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      severity: 'high',
      description: '폭행 의심 행동이 감지되었습니다'
    },
    {
      id: 2,
      type: '절도',
      location: 'CCTV #3 - 주차장',
      time: '15분 전',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      severity: 'medium',
      description: '절도 의심 행동이 감지되었습니다'
    },
  ]);

  // 영상 개수 변경 시 부모에게 알림
  useEffect(() => {
    onVideoCountChange(newVideos.length);
  }, [newVideos.length, onVideoCountChange]);

  const getSeverityColor = (severity: string) => {
    return severity === 'high' 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  // 영상 읽음 처리 (NEW에서 제거)
  const handleVideoRead = (videoId: number) => {
    setNewVideos(prev => prev.filter(v => v.id !== videoId));
  };

  // 빈 상태
  if (newVideos.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            최근 이상 행동 영상이 없습니다
          </h3>
          <p className="text-gray-600">
            새로운 이상 행동이 감지되면 여기에 표시됩니다
          </p>
        </div>
      </div>
    );
  }

  // 새 영상 목록
  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold text-gray-800">NEW</h2>
          <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse">
            {newVideos.length}개의 새 영상
          </span>
        </div>
        <p className="text-gray-600">최근 감지된 이상 행동 영상입니다</p>
      </div>

      {/* 영상 목록 */}
      <div className="space-y-3">
        {newVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-all cursor-pointer border-l-4 border-red-500 animate-glow"
            onClick={() => handleVideoRead(video.id)}
          >
            <div className="flex items-start justify-between">
              {/* 왼쪽: 썸네일 + 정보 */}
              <div className="flex gap-4 flex-1">
                {/* 썸네일 */}
                <div className="w-32 h-20 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                  <span className="text-3xl">🎥</span>
                  <div className="absolute top-1 right-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded animate-blink">
                    NEW
                  </div>
                </div>

                {/* 정보 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getSeverityColor(video.severity)}`}>
                      {video.type}
                    </span>
                    <span className="text-sm text-gray-600">{video.location}</span>
                  </div>
                  <p className="text-gray-800 mb-2">{video.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📅 {video.time}</span>
                    <span>⏱️ 00:45</span>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 액션 버튼 */}
              <div className="flex flex-col gap-2">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoRead(video.id);
                  }}
                >
                  재생
                </button>
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  다운로드
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}