interface VideoCardProps {
  id: number;
  location: string;
  status: 'normal' | 'warning' | 'danger';
  caption: string;
  objects: Array<{ type: string; count: number }>;
}

export default function VideoCard({ location, status, caption, objects }: VideoCardProps) {
  const statusColors = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500 animate-pulse',
  };

  const statusLabels = {
    normal: '정상',
    warning: '주의',
    danger: '위험',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* 비디오 영역 */}
      <div className="bg-gray-900 aspect-video flex items-center justify-center relative">
        <span className="text-gray-600 text-6xl">📹</span>
        
        {/* 상태 배지 */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-sm font-bold ${statusColors[status]}`}>
          {statusLabels[status]}
        </div>

        {/* 위치 표시 */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 px-3 py-1 rounded text-white text-sm">
          {location}
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="p-4">
        {/* AI 캡션 */}
        <div className="mb-3">
          <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
            <span className="text-lg">🤖</span>
            <p className="text-sm text-gray-700 flex-1">{caption}</p>
          </div>
        </div>

        {/* 객체 탐지 결과 */}
        <div className="flex gap-2 flex-wrap">
          {objects.map((obj, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium"
            >
              {obj.type}({obj.count})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}