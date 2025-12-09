import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { TbXboxXFilled } from "react-icons/tb";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface VideoItem {
  id: number;
  type: string;
  location: string;
  time: string;
  date: string; // YYYY-MM-DD 형식
  timestamp: Date;
  severity: 'high' | 'medium';
  description: string;
}

interface CategoryVideosProps {
  categoryType: string;
  categoryName: string;
}

export default function CategoryVideos({ categoryType, categoryName }: CategoryVideosProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
  const [hasSearched, setHasSearched] = useState(true); // true로 변경
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 더미 전체 데이터 (나중에 API로 대체)
  const allVideos: VideoItem[] = [
    {
      id: 1,
      type: categoryName,
      location: 'CCTV #1 - 입구',
      time: '14:30',
      date: '2024-12-09',
      timestamp: new Date('2024-12-09T14:30:00'),
      severity: 'high',
      description: `${categoryName} 의심 행동이 감지되었습니다`
    },
    {
      id: 2,
      type: categoryName,
      location: 'CCTV #3 - 주차장',
      time: '09:15',
      date: '2024-12-08',
      timestamp: new Date('2024-12-08T09:15:00'),
      severity: 'medium',
      description: `${categoryName} 의심 행동이 감지되었습니다`
    },
    {
      id: 3,
      type: categoryName,
      location: 'CCTV #2 - 복도',
      time: '18:45',
      date: '2024-12-07',
      timestamp: new Date('2024-12-07T18:45:00'),
      severity: 'high',
      description: `${categoryName} 의심 행동이 감지되었습니다`
    },
    {
      id: 4,
      type: categoryName,
      location: 'CCTV #4 - 후문',
      time: '11:20',
      date: '2024-12-06',
      timestamp: new Date('2024-12-06T11:20:00'),
      severity: 'medium',
      description: `${categoryName} 의심 행동이 감지되었습니다`
    },
    {
      id: 5,
      type: categoryName,
      location: 'CCTV #1 - 입구',
      time: '16:50',
      date: '2024-12-05',
      timestamp: new Date('2024-12-05T16:50:00'),
      severity: 'high',
      description: `${categoryName} 의심 행동이 감지되었습니다`
    },
    {
      id: 6,
      type: categoryName,
      location: 'CCTV #2 - 복도',
      time: '13:20',
      date: '2024-12-04',
      timestamp: new Date('2024-12-04T13:20:00'),
      severity: 'medium',
      description: `${categoryName} 의심 행동이 감지되었습니다`
    },
    {
      id: 7,
      type: categoryName,
      location: 'CCTV #3 - 주차장',
      time: '10:30',
      date: '2024-12-03',
      timestamp: new Date('2024-12-03T10:30:00'),
      severity: 'high',
      description: `${categoryName} 의심 행동이 감지되었습니다`
    },
    {
      id: 8,
      type: categoryName,
      location: 'CCTV #4 - 후문',
      time: '15:40',
      date: '2024-12-02',
      timestamp: new Date('2024-12-02T15:40:00'),
      severity: 'medium',
      description: `${categoryName} 의심 행동이 감지되었습니다`
    },
    {
      id: 9,
      type: categoryName,
      location: 'CCTV #1 - 입구',
      time: '17:25',
      date: '2024-12-01',
      timestamp: new Date('2024-12-01T17:25:00'),
      severity: 'high',
      description: `${categoryName} 의심 행동이 감지되었습니다`
    },
    {
      id: 10,
      type: categoryName,
      location: 'CCTV #2 - 복도',
      time: '12:10',
      date: '2024-11-30',
      timestamp: new Date('2024-11-30T12:10:00'),
      severity: 'medium',
      description: `${categoryName} 의심 행동이 감지되었습니다`
    },
  ];

  // 카테고리 변경 시 전체 데이터 자동 로드
  useEffect(() => {
    setFilteredVideos(allVideos);
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  }, [categoryType]);

  const getSeverityColor = (severity: string) => {
    return severity === 'high'
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  const handleSearch = () => {
    setHasSearched(true);
    setCurrentPage(1);

    if (!startDate || !endDate) {
      alert('시작 날짜와 종료 날짜를 모두 선택해주세요.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = allVideos.filter(video => {
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
    setStartDate('');
    setEndDate('');
    setFilteredVideos([]);
    setHasSearched(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{categoryName}</h2>
        <p className="text-gray-600">{categoryName} 관련 영상 목록</p>
      </div>

      {/* 검색 필터 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-end gap-4">
          {/* 시작 날짜 */}
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

          {/* 종료 날짜 */}
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

          {/* 검색 버튼 */}
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <FaSearch />
            검색
          </button>

          {/* 전체 보기 버튼 */}
          <button
            onClick={handleShowAll}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            전체 보기
          </button>

          {/* 초기화 버튼 */}
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 검색 결과 */}
      {hasSearched && (
        <>
          {filteredVideos.length === 0 ? (
            // 데이터 없음
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
                <p className="text-gray-600">
                  선택한 기간에 {categoryName} 영상이 없습니다
                </p>
              </div>
            </div>
          ) : (
            // 영상 목록
            <>
              <div className="mb-4 text-gray-600">
                총 <span className="font-bold text-blue-600">{filteredVideos.length}</span>개의 영상
              </div>
              <div className="space-y-3 mb-6">
                {currentVideos.map((video) => (
                  <div
                    key={video.id}
                    className={`bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                      video.severity === 'high' ? 'border-red-500' : 'border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      {/* 왼쪽: 썸네일 + 정보 */}
                      <div className="flex gap-4 flex-1">
                        {/* 썸네일 */}
                        <div className="w-32 h-20 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">🎥</span>
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
                            <span>📅 {video.date}</span>
                            <span>⏰ {video.time}</span>
                            <span>⏱️ 00:45</span>
                          </div>
                        </div>
                      </div>

                      {/* 오른쪽: 액션 버튼 */}
                      <div className="flex flex-col gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                          재생
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                          다운로드
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  {/* 이전 버튼 */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <MdNavigateBefore className="text-2xl" />
                  </button>

                  {/* 페이지 번호 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* 다음 버튼 */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-200'
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

      {/* 검색 전 안내 */}
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
              시작 날짜와 종료 날짜를 입력한 후 검색 버튼을 클릭하거나<br />
              전체 보기 버튼을 눌러주세요
            </p>
          </div>
        </div>
      )}
    </div>
  );
}