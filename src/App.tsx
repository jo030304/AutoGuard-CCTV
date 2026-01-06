import { useState } from 'react';
import Layout from './components/layout/Layout';
import NewVideos from './components/video/NewVideos';
import CategoryVideos from './components/video/CategoryVideos';
import AllVideos from './components/video/AllVideos';
import DetectionModal from './components/modal/DetectionModal';

import { AlertProvider } from './components/context/AlertContext';

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

function App() {
  const [currentPage, setCurrentPage] = useState('new');
  const [newVideos, setNewVideos] = useState<VideoItem[]>([]); // ✅ 상태 추가
  const [showDetectionModal, setShowDetectionModal] = useState(false);
  const [detectionInfo, setDetectionInfo] = useState({ type: '폭행', location: 'CCTV #1 - 입구' });

  const renderPage = () => {
    switch (currentPage) {
      case 'new':
        return (
          <NewVideos 
            newVideos={newVideos}
            setNewVideos={setNewVideos}
            onVideoCountChange={() => {}} // 더 이상 필요 없음
          />
        );
      case 'all':
        return <AllVideos />;
      case 'assault':
        return <CategoryVideos categoryType="assault" categoryName="폭행" />;
      case 'fall':
        return <CategoryVideos categoryType="fall" categoryName="실신" />;
      default:
        return (
          <NewVideos 
            newVideos={newVideos}
            setNewVideos={setNewVideos}
            onVideoCountChange={() => {}}
          />
        );
    }
  };

  return (
    <AlertProvider>
      <Layout 
        onPageChange={setCurrentPage} 
        newVideoCount={newVideos.length} // ✅ newVideos.length로 변경
      >
        {renderPage()}
      </Layout>

      <DetectionModal
        isOpen={showDetectionModal}
        onClose={() => setShowDetectionModal(false)}
        videoType={detectionInfo.type}
        location={detectionInfo.location}
      />
    </AlertProvider>
  );
}

export default App;