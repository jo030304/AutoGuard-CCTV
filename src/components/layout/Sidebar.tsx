import { useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
}

const menuItems: MenuItem[] = [
  { id: 'new', label: 'NEW', icon: '🆕' },
  { id: 'assault', label: '폭행', icon: '👊' },
  { id: 'fight', label: '싸움', icon: '🤜' },
  { id: 'theft', label: '절도', icon: '🦹' },
  { id: 'vandalism', label: '기물파손', icon: '🔨' },
  { id: 'fainting', label: '실신', icon: '🤕' },
];

interface SidebarProps {
  onPageChange: (page: string) => void;
  newVideoCount: number;
}

export default function Sidebar({ onPageChange, newVideoCount }: SidebarProps) {
  const [selected, setSelected] = useState('new');

  const handleMenuClick = (menuId: string) => {
    setSelected(menuId);
    onPageChange(menuId);
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">MULTIMODAL</h2>
        <p className="text-sm text-gray-400">CCTV System</p>
      </div>

      <nav className="px-3 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg mb-1 font-medium transition-colors flex items-center gap-3 relative
              ${
                selected === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }
              ${item.id === 'new' && newVideoCount > 0 ? 'animate-glow' : ''}
            `}
          >
            {item.icon && <span className="text-xl">{item.icon}</span>}
            <span>{item.label}</span>
            
            {/* NEW 개수 뱃지 */}
            {item.id === 'new' && newVideoCount > 0 && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                {newVideoCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* 하단 정보 */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">© 2024 CCTV System</p>
      </div>
    </aside>
  );
}