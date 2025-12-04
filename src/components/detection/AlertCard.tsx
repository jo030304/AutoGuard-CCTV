interface AlertCardProps {
  time: string;
  location: string;
  type: string;
  severity: 'high' | 'medium';
  caption: string;
}

export default function AlertCard({ time, location, type, severity, caption }: AlertCardProps) {
  return (
    <div
      className={`bg-white p-5 rounded-lg shadow-md border-l-4 hover:shadow-lg transition-shadow
        ${severity === 'high' ? 'border-red-500' : 'border-yellow-500'}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold
              ${severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
            `}
          >
            {type}
          </span>
          <span className="text-gray-600 text-sm">{location}</span>
        </div>
        <span className="text-sm text-gray-500">{time}</span>
      </div>

      <p className="text-gray-800 mb-4">{caption}</p>

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          영상 보기
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
          확인 완료
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
          무시
        </button>
      </div>
    </div>
  );
}