import { useState } from 'react';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  badge?: number;
  subItems?: { id: string; label: string }[];
}

const menuItems: MenuItem[] = [
  { id: 'realtime', icon: '📹', label: '실시간 모니터' },
  { id: 'abnormal', icon: '⚠️', label: '이상행동', badge: 3 },
  {
    id: 'behavior',
    icon: '🚶',
    label: '행동별 분류',
    subItems: [
      { id: 'fall', label: '낙상' },
      { id: 'assault', label: '폭행/다툼' },
      { id: 'intrusion', label: '침입' },
      { id: 'loitering', label: '배회' },
      { id: 'abandonment', label: '물품 방치' },
    ],
  },
  { id: 'statistics', icon: '📊', label: '통계' },
];

export default function Sidebar() {
  const [selected, setSelected] = useState('realtime');
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">MULTIMODAL</h2>
        <p className="text-sm text-gray-400">CCTV System</p>
      </div>

      <nav className="px-3">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <button
              onClick={() => {
                setSelected(item.id);
                if (item.subItems) {
                  setExpanded(expanded === item.id ? null : item.id);
                }
              }}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors
                ${
                  selected === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.subItems && (
                <span className="text-sm">
                  {expanded === item.id ? '▼' : '▶'}
                </span>
              )}
            </button>

            {/* 서브메뉴 */}
            {item.subItems && expanded === item.id && (
              <div className="ml-8 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded"
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}