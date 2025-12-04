import Layout from './components/layout/Layout';
import VideoGrid from './components/video/VideoGrid';

function App() {
  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">실시간 모니터링</h2>
        <p className="text-gray-600 mt-1">현재 4개의 CCTV가 활성화되어 있습니다</p>
      </div>
      <VideoGrid />
    </Layout>
  );
}

export default App;