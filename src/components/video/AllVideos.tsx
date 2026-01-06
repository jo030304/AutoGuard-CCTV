import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { TbXboxXFilled } from "react-icons/tb";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import VideoDetailModal from "./VideoDetailModal";

interface VideoItem {
  id: number;
  type: string;
  location: string;
  time: string;
  date: string;
  timestamp: Date;
  severity: "high" | "medium";
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export default function AllVideos() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const itemsPerPage = 4;

  // 🔥 타입 한글 변환 함수
  const translateType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'assault': '폭행',
      'fall': '실신',
      'theft': '절도'
    };
    return typeMap[type.toLowerCase()] || type;
  };

  const fetchVideos = async () => {
    try {
      console.log("📡 API 호출 시작: /api/ai/list");
      const response = await fetch("/api/ai/list");
      const data = await response.json();
      console.log("📦 API 응답 데이터:", data);

      const videos: VideoItem[] = data.map((item: any) => {
        const timestamp = new Date(item.timestamp);
        return {
          id: item.id,
          type: translateType(item.anomalyBehavior || "미분류"), // 🔥 한글 변환 적용
          location: item.cameraId || "알 수 없음",
          time: timestamp.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: timestamp.toISOString().split("T")[0],
          timestamp: timestamp,
          severity: "high" as const,
          description: item.description || "상황 요약 정보가 없습니다.",
          thumbnailUrl: item.thumbnailUrl,
          videoUrl: item.videoUrl,
          caption: item.caption,
        };
      });

      console.log("✅ 변환된 비디오 데이터:", videos);
      setAllVideos(videos);
      return videos;
    } catch (error) {
      console.error("❌ API 호출 오류:", error);
      setAllVideos([]);
      return [];
    }
  };

  useEffect(() => {
    const init = async () => {
      const videos = await fetchVideos();
      setFilteredVideos(videos);
      setHasSearched(true);
      setCurrentPage(1);
      setStartDate("");
      setEndDate("");
    };
    init();
  }, []);

  const getSeverityColor = (severity: string) => {
    return severity === "high"
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  const handleSearch = () => {
    setHasSearched(true);
    setCurrentPage(1);

    if (!startDate || !endDate) {
      alert("시작 날짜와 종료 날짜를 모두 선택해주세요.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = allVideos.filter((video) => {
      const videoDate = new Date(video.date);
      return videoDate >= start && videoDate <= end;
    });

    setFilteredVideos(filtered);
  };

  const handleShowAll = () => {
    setHasSearched(true);
    setCurrentPage(1);
    setFilteredVideos(allVideos);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setFilteredVideos([]);
    setHasSearched(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">전체</h2>
        <p className="text-gray-600">모든 카테고리 영상 목록</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작 날짜
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료 날짜
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <FaSearch />
            검색
          </button>

          <button
            onClick={handleShowAll}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            전체 보기
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            초기화
          </button>
        </div>
      </div>

      {hasSearched && (
        <>
          {filteredVideos.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                    <TbXboxXFilled className="text-6xl text-red-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  데이터가 없습니다
                </h3>
                <p className="text-gray-600">선택한 기간에 영상이 없습니다</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                총{" "}
                <span className="font-bold text-blue-600">
                  {filteredVideos.length}
                </span>
                개의 영상
              </div>
              
              {/* ✅ 그리드 레이아웃 */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {currentVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoClick(video)}
                    className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden border-4 ${
                      video.severity === "high"
                        ? "border-red-500"
                        : "border-yellow-500"
                    }`}
                  >
                    <div className="relative aspect-video bg-black">
                      <img
                        src={video.thumbnailUrl}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/vite.svg";
                        }}
                      />
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
                        <span>📅 {video.date}</span>
                        <span>⏰ {video.time}</span>
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

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <MdNavigateBefore className="text-2xl" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <MdNavigateNext className="text-2xl" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {!hasSearched && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <HiOutlineMagnifyingGlass className="text-6xl text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              날짜를 선택하고 검색해주세요
            </h3>
            <p className="text-gray-600">
              시작 날짜와 종료 날짜를 입력한 후 검색 버튼을 클릭하거나
              <br />
              전체 보기 버튼을 눌러주세요
            </p>
          </div>
        </div>
      )}

      {selectedVideo && (
        <VideoDetailModal
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.videoUrl}
          thumbnailUrl={selectedVideo.thumbnailUrl}
          type={selectedVideo.type}
          location={selectedVideo.location}
          date={selectedVideo.date}
          time={selectedVideo.time}
          description={selectedVideo.description}
        />
      )}
    </div>
  );
}