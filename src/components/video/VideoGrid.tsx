import VideoCard from './VideoCard';

// 더미 데이터
const dummyVideos = [
  {
    id: 1,
    location: 'CCTV-01 (1층 로비)',
    status: 'normal' as const,
    caption: '여러 사람이 정상적으로 이동하고 있습니다.',
    objects: [
      { type: '👤 사람', count: 5 },
      { type: '🎒 가방', count: 2 },
    ],
  },
  {
    id: 2,
    location: 'CCTV-02 (주차장)',
    status: 'warning' as const,
    caption: '한 사람이 같은 구역을 반복적으로 왕복하고 있습니다.',
    objects: [
      { type: '👤 사람', count: 1 },
      { type: '🚗 차량', count: 8 },
    ],
  },
  {
    id: 3,
    location: 'CCTV-03 (복도)',
    status: 'danger' as const,
    caption: '사람이 바닥에 쓰러져 움직이지 않고 있습니다.',
    objects: [
      { type: '👤 사람', count: 1 },
    ],
  },
  {
    id: 4,
    location: 'CCTV-04 (계단)',
    status: 'normal' as const,
    caption: '사람들이 계단을 오르내리고 있습니다.',
    objects: [
      { type: '👤 사람', count: 3 },
    ],
  },
];

export default function VideoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
      {dummyVideos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  );
}