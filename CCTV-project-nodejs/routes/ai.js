

const express = require("express");
const router = express.Router();

const { addRecord, getRecords } = require("../data/records");
const { broadcast } = require("../ws/ws");

const { sendAlertMail } = require("../mail/mail");  //츄가



// 🔧 LLM 요약 정제 함수
function cleanDescription(text) {
    if (!text) return null;

    return text
        .replace(/ENGLISH:[\s\S]*/g, "")        // ENGLISH 이후 제거
        .replace(/[^\uAC00-\uD7A3\s.,]/g, "")   // 한글 + 기본 문장부호만
        .replace(/\s+/g, " ")
        .trim();
}

// FastAPI → Node.js 전달 API
router.post("/result", async (req, res) => {
    try {
        const {
            cameraId,
            videoUrl,
            thumbnailUrl,
            timestamp,
            anomalyBehavior,
            caption
        } = req.body;

        // ✅ 여기서 description 추출
        const rawDescription = caption?.summary?.ko || null;
        const description = cleanDescription(rawDescription);

        console.log("📩 FastAPI → Node.js 결과 수신");
        console.log("📝 description:", description);

        // ✅ DB에는 필요한 필드만 저장
        await addRecord({
            cameraId,
            videoUrl,
            thumbnailUrl,
            timestamp,
            anomalyBehavior,
            description
        });

        // ✅ WebSocket으로 관리자 웹 전송
        broadcast({
            type: "NEW_DETECTION",
            cameraId,
            videoUrl,
            thumbnailUrl,
            timestamp,
            anomalyBehavior,
            description
        });


        console.log("📡 WebSocket 방송 완료");
        return res.json({ status: "ok" });

    } catch (err) {
        console.error("❌ AI 결과 처리 실패:", err);
        return res.status(500).json({ status: "error" });
    }
});

// 영상 목록 조회
router.get("/list", async (req, res) => {
    const rows = await getRecords();
    res.json(rows);
});


// 🚨 이상행동 즉시 알림 (메일용)
router.post("/alert", async (req, res) => {
    console.log("🔥 /alert 요청 도착", req.body);
    const { cameraId, anomalyBehavior, timestamp } = req.body;

    try {
        await sendAlertMail({
            cameraId,
            anomalyBehavior,
            timestamp,
            description: "이상행동이 감지되어 녹화를 시작했습니다."
        });

        console.log("🚨 즉시 알림 메일 전송 완료");
        return res.json({ status: "ok" });

    } catch (err) {
        console.error("❌ 즉시 메일 전송 실패", err);
        return res.status(500).json({ status: "error" });
    }
});



module.exports = router;
