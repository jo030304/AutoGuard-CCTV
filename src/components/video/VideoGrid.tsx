// src/components/video/VideoGrid.tsx
import VideoCard from './VideoCard';

export default function VideoGrid() {
  const cameras = [
    { 
      id: 1, 
      title: 'CCTV #1', 
      location: '입구',
      wsUrl: 'ws://localhost:8000/ws/stream'
    },
    { 
      id: 2, 
      title: 'CCTV #2', 
      location: '복도',
      wsUrl: 'ws://localhost:8000/ws/stream' // 같은 영상 (테스트용)
    },
    { 
      id: 3, 
      title: 'CCTV #3', 
      location: '주차장',
      wsUrl: 'ws://localhost:8000/ws/stream' // 같은 영상 (테스트용)
    },
    { 
      id: 4, 
      title: 'CCTV #4', 
      location: '후문',
      wsUrl: 'ws://localhost:8000/ws/stream' // 같은 영상 (테스트용)
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {cameras.map(camera => (
        <VideoCard
          key={camera.id}
          id={camera.id}
          title={camera.title}
          location={camera.location}
          wsUrl={camera.wsUrl}
        />
      ))}
    </div>
  );
}