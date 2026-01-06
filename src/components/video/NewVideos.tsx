import { useState, useEffect, useRef } from "react";
import { useAlert } from "../context/AlertContext";
import VideoDetailModal from "./VideoDetailModal";

interface VideoItem {
  id: number;
  type: string;
  location: string;
  time: string;
  timestamp: Date;
  severity: "high" | "medium";
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface NewVideosProps {
  newVideos: VideoItem[];
  setNewVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  onVideoCountChange: (count: number) => void;
}

export default function NewVideos({
  newVideos,
  setNewVideos,
  onVideoCountChange,
}: NewVideosProps) {
  const [connectionStatus, setConnectionStatus] = useState<string>(
    "연결 시도 중..."
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const nextIdRef = useRef(1);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const { addAlert } = useAlert();

  // 🔥 타입 한글 변환 함수
  const translateType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'assault': '폭행',
      'fall': '실신',
      'theft': '절도'
    };
    return typeMap[type.toLowerCase()] || type;
  };

  const connectWebSocket = () => {
    // 🔥 이미 연결 중이거나 열려 있으면 재연결 금지
    if (
      isConnectingRef.current ||
      wsRef.current?.readyState === WebSocket.OPEN
    ) {
      console.log("⚠️ WebSocket 이미 연결됨, 재연결 방지");
      return;
    }

    isConnectingRef.current = true;

    console.log("🔌 WebSocket 연결 시도: ws://localhost:3001");
    const ws = new WebSocket("ws://localhost:3001");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket 연결 성공!");
      setConnectionStatus("연결됨 🟢");

      isConnectingRef.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 WebSocket 메시지 수신:", data);

        if (data.type === "NEW_DETECTION") {
          console.log("🚨 새로운 이상행동 감지!", data);

          const newVideo: VideoItem = {
            id: nextIdRef.current++,
            type: translateType(data.anomalyBehavior || "미분류"), // 🔥 한글 변환 적용
            location: `카메라 ${data.cameraId}` || "알 수 없음",
            time: "방금 전",
            timestamp: new Date(data.timestamp || Date.now()),
            severity: "high",
            description:
              data.description || "상황 요약 정보가 없습니다.",
            videoUrl: data.videoUrl,
            thumbnailUrl: data.thumbnailUrl,
            caption: data.caption,
          };

          setNewVideos((prev) => {
            const exists = prev.some(
              (v) => v.videoUrl === newVideo.videoUrl
            );

            if (exists) {
              console.log("⛔ 중복 영상 무시:", newVideo.videoUrl);
              return prev;
            }

            console.log("📝 NEW 영상 추가:", newVideo);
            return [newVideo, ...prev];
          });

          addAlert({
            id: Date.now(),
            type: newVideo.type,
            location: newVideo.location,
            time: "방금 전",
            severity: "high",
            message: newVideo.description,
            read: false,
          });
        }
      } catch (error) {
        console.error("❌ WebSocket 메시지 파싱 오류:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket 오류:", error);
      setConnectionStatus("오류 발생 🔴");
    };

    ws.onclose = (event) => {
      console.log("🔴 WebSocket 연결 종료", event.code, event.reason);
      setConnectionStatus("연결 끊김 🔴");

      isConnectingRef.current = false;

      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("🔄 WebSocket 재연결 시도...");
        connectWebSocket();
      }, 3000);
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    onVideoCountChange(newVideos.length);
  }, [newVideos.length, onVideoCountChange]);

  const getSeverityColor = (severity: string) => {
    return severity === "high"
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const handleVideoRead = (videoId: number) => {
    setNewVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

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

  const handleClearAll = () => {
    if (
      window.confirm(`${newVideos.length}개의 영상을 모두 삭제하시겠습니까?`)
    ) {
      setNewVideos([]);
    }
  };

  const handleVideoClick = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  const handleDownload = async (video: VideoItem) => {
    if (!video.videoUrl) {
      alert("영상 URL이 없습니다.");
      return;
    }

    try {
      const response = await fetch(video.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${video.type}_CAM${video.location}_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("다운로드 실패:", error);
      alert("다운로드에 실패했습니다.");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-800">NEW</h2>
            <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse">
              {newVideos.length}개의 새 영상
            </span>
          </div>

          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm flex items-center gap-2"
          >
            🗑️ 모두 비우기
          </button>
        </div>
        <p className="text-gray-600">최근 감지된 이상 행동 영상입니다</p>
      </div>

      {/* ✅ 그리드 레이아웃 */}
      <div className="grid grid-cols-2 gap-6">
        {newVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(video)}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden border-4 border-red-500 animate-glow relative"
          >
            <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
              NEW
            </div>

            <div className="relative aspect-video bg-black">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt="썸네일"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">🎥</span>
                </div>
              )}

              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold border ${getSeverityColor(
                    video.severity
                  )}`}
                >
                  {video.type}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-600 font-medium">
                  📍 {video.location}
                </span>
              </div>
              <p className="text-gray-800 mb-3 font-medium">
                {video.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>📅 {video.time}</span>
                <span>⏱️ 00:45</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(video);
                }}
                className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                다운로드
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <VideoDetailModal
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.videoUrl!}
          thumbnailUrl={selectedVideo.thumbnailUrl!}
          type={selectedVideo.type}
          location={selectedVideo.location}
          date={selectedVideo.timestamp.toISOString().split("T")[0]}
          time={selectedVideo.time}
          description={selectedVideo.description}
        />
      )}
    </div>
  );
}