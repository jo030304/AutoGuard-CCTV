const pool = require("../db/db");

// 기록 추가 (DB 저장)
async function addRecord(record) {
    const { cameraId, videoUrl, thumbnailUrl, timestamp, anomalyBehavior,description    } = record;

    try {
        const sql = `
            INSERT INTO records (cameraId, videoUrl, thumbnailUrl, timestamp, anomalyBehavior,description   ) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await pool.execute(sql, [
            cameraId,
            videoUrl,
            thumbnailUrl,
            timestamp,
            anomalyBehavior,
            description   
        ]);

        console.log("💾 DB 저장 완료:", record);
    } catch (err) {
        console.error("❌ DB 저장 오류:", err);
    }
}

// 저장된 기록 조회
async function getRecords() {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM records 
            ORDER BY id DESC 
            LIMIT 200
        `);

        return rows;
    } catch (err) {
        console.error("❌ DB 조회 오류:", err);
        return [];
    }
}

module.exports = {
    addRecord,
    getRecords
};
