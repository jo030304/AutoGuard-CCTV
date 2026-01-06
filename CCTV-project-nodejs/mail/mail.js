const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.naver.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendAlertMail({ cameraId, anomalyBehavior, timestamp, description }) {
  return transporter.sendMail({
    from: `"CCTV Alert" <${process.env.MAIL_USER}>`,
    to: process.env.ALERT_MAIL_TO,
    subject: `[경고] ${anomalyBehavior} 감지`,
    text: `
이상행동이 감지되었습니다.

카메라: ${cameraId}
유형: ${anomalyBehavior}
시간: ${timestamp}

${description || ""}
`
  });
}

module.exports = { sendAlertMail };
