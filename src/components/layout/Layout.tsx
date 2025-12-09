import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onPageChange: (page: string) => void;
  newVideoCount: number;
}

export default function Layout({ children, onPageChange, newVideoCount }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onPageChange={onPageChange} newVideoCount={newVideoCount} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}