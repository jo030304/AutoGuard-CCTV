"""
FastAPI Backend for React Frontend
yolo_fall_result 영상 실시간 스트리밍
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import cv2
import base64
import random
from datetime import datetime
import os

app = FastAPI(
    title="CCTV Backend API",
    description="React 프론트엔드용 백엔드 서버",
    version="1.0.0"
)

# CORS 설정 (React 개발 서버용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React 기본 포트
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 영상 파일 경로
VIDEO_PATH = "yolo_fall_result.mp4"

# 더미 AI 캡션
DUMMY_CAPTIONS = [
    "사람이 복도를 걷고 있습니다",
    "사람이 서 있습니다",
    "사람이 바닥에 쓰러져 있습니다",
    "사람이 움직이지 않고 있습니다"
]

DUMMY_OBJECTS = [
    {"class": "person", "confidence": 0.95, "bbox": [100, 150, 300, 500]}
]

def detect_danger(caption):
    """위험 감지"""
    caption_lower = caption.lower()
    
    danger_rules = {
        'fall': {
            'keywords': ['쓰러', 'fall', '바닥', '누워'],
            'message': '⚠️ 쓰러짐 감지',
            'severity': 'high'
        },
        'kidnap': {
            'keywords': ['끌', 'dragging', '강제', '납치'],
            'message': '🚨 납치 의심',
            'severity': 'critical'
        },
        'fight': {
            'keywords': ['싸움', 'fight', '폭행'],
            'message': '⚠️ 폭행 의심',
            'severity': 'high'
        }
    }
    
    for danger_type, rule in danger_rules.items():
        if any(word in caption_lower for word in rule['keywords']):
            return {
                'detected': True,
                'type': danger_type,
                'message': rule['message'],
                'severity': rule['severity']
            }
    
    return {
        'detected': False,
        'type': 'normal',
        'message': '정상',
        'severity': 'low'
    }

@app.get("/")
async def root():
    """서버 상태 확인"""
    return {
        "status": "ok",
        "message": "CCTV Backend Server",
        "video": VIDEO_PATH,
        "video_exists": os.path.exists(VIDEO_PATH)
    }

@app.get("/api/health")
async def health_check():
    """헬스 체크"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    """WebSocket 실시간 스트리밍"""
    await websocket.accept()
    print("✅ React 클라이언트 연결됨")
    
    # 영상 파일 확인
    if not os.path.exists(VIDEO_PATH):
        await websocket.send_json({
            'type': 'error',
            'message': f'영상 파일을 찾을 수 없습니다: {VIDEO_PATH}'
        })
        await websocket.close()
        return
    
    cap = cv2.VideoCapture(VIDEO_PATH)
    frame_count = 0
    
    try:
        while True:
            ret, frame = cap.read()
            
            # 영상 끝나면 처음으로
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            
            frame_count += 1
            
            # 프레임 인코딩 (JPEG)
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            
            # 프레임 전송
            await websocket.send_json({
                'type': 'frame',
                'data': frame_base64,
                'frame_number': frame_count,
                'timestamp': datetime.now().isoformat()
            })
            
            # 3프레임마다 AI 분석
            if frame_count % 3 == 0:
                # 랜덤 캡션
                caption = random.choice(DUMMY_CAPTIONS)
                
                # 30프레임(3초)마다 쓰러짐 시뮬레이션
                if frame_count % 30 == 0:
                    caption = "사람이 바닥에 쓰러져 있습니다"
                
                # 위험 감지
                danger = detect_danger(caption)
                
                # 분석 결과 전송
                await websocket.send_json({
                    'type': 'analysis',
                    'data': {
                        'objects': DUMMY_OBJECTS,
                        'caption': caption,
                        'danger': danger,
                        'frame_number': frame_count,
                        'timestamp': datetime.now().isoformat()
                    }
                })
                
                print(f"📝 Frame {frame_count}: {caption}")
                if danger['detected']:
                    print(f"🚨 {danger['message']}")
            
            # 10 FPS (0.1초 대기)
            await asyncio.sleep(0.1)
            
    except WebSocketDisconnect:
        print("❌ React 클라이언트 연결 해제")
    except Exception as e:
        print(f"❌ 오류: {e}")
        await websocket.send_json({
            'type': 'error',
            'message': str(e)
        })
    finally:
        cap.release()
        print("🔌 WebSocket 종료")

if __name__ == "__main__":
    import uvicorn
    
    print("=" * 60)
    print("🎥 CCTV Backend Server (for React)")
    print("=" * 60)
    print(f"📡 서버: http://localhost:8000")
    print(f"📚 API 문서: http://localhost:8000/docs")
    print(f"🔌 WebSocket: ws://localhost:8000/ws/stream")
    print(f"📹 영상 파일: {VIDEO_PATH}")
    print(f"📹 파일 존재: {os.path.exists(VIDEO_PATH)}")
    print("=" * 60)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )