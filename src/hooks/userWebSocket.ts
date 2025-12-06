// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: 'frame' | 'analysis' | 'error';
  data?: any;
  frame_number?: number;
  timestamp?: string;
  message?: string;
}

interface AnalysisData {
  objects: Array<{
    class: string;
    confidence: number;
    bbox: number[];
  }>;
  caption: string;
  danger: {
    detected: boolean;
    type: string;
    message: string;
    severity: string;
  };
  frame_number: number;
  timestamp: string;
}

export const useWebSocket = (url: string) => {
  const [frame, setFrame] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket 연결됨');
      setIsConnected(true);
      setError('');
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);

      if (message.type === 'frame') {
        setFrame(`data:image/jpeg;base64,${message.data}`);
      } else if (message.type === 'analysis') {
        setAnalysis(message.data as AnalysisData);
      } else if (message.type === 'error') {
        setError(message.message || '알 수 없는 오류');
      }
    };

    ws.onerror = () => {
      console.error('❌ WebSocket 오류');
      setIsConnected(false);
      setError('서버 연결 실패');
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket 연결 종료');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { frame, analysis, isConnected, error };
};