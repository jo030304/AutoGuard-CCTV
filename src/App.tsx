import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center text-white">
      <div className="flex gap-8 mb-8">
        <a 
          href="https://vite.dev" 
          target="_blank"
          className="transition-transform hover:scale-110 hover:drop-shadow-[0_0_2em_#646cffaa]"
        >
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a 
          href="https://react.dev" 
          target="_blank"
          className="transition-transform hover:scale-110 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin-slow"
        >
          <img src={reactLogo} className="h-24 w-24" alt="React logo" />
        </a>
      </div>

      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Vite + React
      </h1>

      <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-blue-500/50 mb-4"
        >
          count is {count}
        </button>
        <p className="text-gray-400 text-sm">
          Edit <code className="bg-gray-900 px-2 py-1 rounded text-cyan-400">src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="text-gray-500 mt-8 text-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App