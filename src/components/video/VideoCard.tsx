// src/components/video/VideoCard.tsx
import { useWebSocket } from '../../hooks/userWebSocket';

interface VideoCardProps {
  id: number;
  title: string;
  location: string;
  wsUrl: string;
}

export default function VideoCard({ id, title, location, wsUrl }: VideoCardProps) {
  const { frame, analysis, isConnected, error } = useWebSocket(wsUrl);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
        <div>
          <h3 className="text-white font-semibold">{title}</h3>
          <p className="text-gray-400 text-sm">{location}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`} />
          <span className="text-gray-400 text-xs">
            {isConnected ? 'LIVE' : 'OFF'}
          </span>
        </div>
      </div>

      {/* 영상 영역 */}
      <div className="relative aspect-video bg-black">
        {frame ? (
          <img 
            src={frame} 
            alt={`CCTV ${id}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {error ? (
              <div className="text-center">
                <span className="text-red-400 text-sm">⚠️ {error}</span>
              </div>
            ) : (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">연결 중...</p>
              </div>
            )}
          </div>
        )}

        {/* 위험 알림 오버레이 */}
        {analysis?.danger.detected && (
          <div className={`absolute top-0 left-0 right-0 px-3 py-2 ${
            analysis.danger.severity === 'critical' 
              ? 'bg-red-600/90' 
              : 'bg-yellow-600/90'
          }`}>
            <p className="text-white text-sm font-bold flex items-center gap-2">
              {analysis.danger.severity === 'critical' ? '🚨' : '⚠️'}
              {analysis.danger.message}
            </p>
          </div>
        )}

        {/* 프레임 번호 */}
        {analysis && (
          <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-xs">
            #{analysis.frame_number}
          </div>
        )}
      </div>

      {/* AI 캡션 */}
      {analysis && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 text-lg">🤖</span>
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed">
                {analysis.caption}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {analysis.objects.map((obj, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                  >
                    👤 {obj.class} ({(obj.confidence * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}