const WebSocket = require("ws");

let wss = null;

function initWebSocket(server) {
    wss = new WebSocket.Server({ server });

    console.log("🔥 WebSocket 서버 실행: ws://localhost:3001 (HTTP와 동일 포트)");

    wss.on("connection", (ws) => {
        console.log("🟢 브라우저 클라이언트 WebSocket 연결됨");

        ws.send(JSON.stringify({ message: "AI CCTV Websocket 연결 성공" }));

        ws.on("close", () => {
            console.log("🔴 WebSocket 클라이언트 연결 종료");
        });
    });
}

// 외부에서 WebSocket 메시지 보내기 위한 함수
function broadcast(data) {
    if (!wss) return;

    const json = JSON.stringify(data);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    });
}

module.exports = { initWebSocket, broadcast };
