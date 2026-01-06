const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");   // 추가됨

require("dotenv").config();


app.use(express.json());
app.use(cors());   // ★ 모든 출처 허용

// 라우트 로드
const aiRoutes = require("./routes/ai");

// WebSocket 실행
const server = http.createServer(app);
const { initWebSocket } = require("./ws/ws");
initWebSocket(server);

// 라우트 등록
app.use("/api/ai", aiRoutes);

// 서버 시작
server.listen(3001, "0.0.0.0", () => {
    console.log("Node started");
});