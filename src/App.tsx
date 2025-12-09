import { useState } from 'react';
import Layout from './components/layout/Layout';
import NewVideos from './components/video/NewVideos';
import CategoryVideos from './components/video/CategoryVideos';
import DetectionModal from './components/modal/DetectionModal';

function App() {
  const [currentPage, setCurrentPage] = useState('new');
  const [newVideoCount, setNewVideoCount] = useState(2);
  const [showDetectionModal, setShowDetectionModal] = useState(false);
  const [detectionInfo, setDetectionInfo] = useState({ type: '폭행', location: 'CCTV #1 - 입구' });

  const renderPage = () => {
    switch (currentPage) {
      case 'new':
        return <NewVideos onVideoCountChange={setNewVideoCount} />;
      case 'assault':
        return <CategoryVideos categoryType="assault" categoryName="폭행" />;
      case 'fight':
        return <CategoryVideos categoryType="fight" categoryName="싸움" />;
      case 'theft':
        return <CategoryVideos categoryType="theft" categoryName="절도" />;
      case 'vandalism':
        return <CategoryVideos categoryType="vandalism" categoryName="기물파손" />;
      case 'fainting':
        return <CategoryVideos categoryType="fainting" categoryName="실신" />;
      default:
        return <NewVideos onVideoCountChange={setNewVideoCount} />;
    }
  };

  return (
    <>
      <Layout onPageChange={setCurrentPage} newVideoCount={newVideoCount}>
        {renderPage()}
      </Layout>

      <DetectionModal
        isOpen={showDetectionModal}
        onClose={() => setShowDetectionModal(false)}
        videoType={detectionInfo.type}
        location={detectionInfo.location}
      />
    </>
  );
}

export default App;