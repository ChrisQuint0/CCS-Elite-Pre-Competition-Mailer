import nodemailer from "nodemailer";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export async function sendWinnerEmail({
  toEmail,
  winnerName,
  place,
  programmingCategory,
  score,
  useEthereal = false,
}) {
  let transporter;

  if (useEthereal) {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Define styling based on place
  const placeConfig = {
    gold: {
      border_color: "#FFD700",
      banner_gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      banner_text_color: "#000000",
      accent_color: "#B8860B",
      stats_bg: "#FFFACD",
      border_color_light: "#FFE97F",
      trophy_emoji: "🥇",
      place_text: "1st",
      prize_message:
        "Please visit the CCS Elite booth to claim your prize and certificate. Bring a valid ID for verification.",
    },
    silver: {
      border_color: "#C0C0C0",
      banner_gradient: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)",
      banner_text_color: "#000000",
      accent_color: "#808080",
      stats_bg: "#F0F0F0",
      border_color_light: "#D3D3D3",
      trophy_emoji: "🥈",
      place_text: "2nd",
      prize_message:
        "Please visit the CCS Elite booth to claim your prize and certificate. Bring a valid ID for verification.",
    },
    bronze: {
      border_color: "#CD7F32",
      banner_gradient: "linear-gradient(135deg, #CD7F32 0%, #B8732C 100%)",
      banner_text_color: "#FFFFFF",
      accent_color: "#8B4513",
      stats_bg: "#FFE4C4",
      border_color_light: "#DDA76A",
      trophy_emoji: "🥉",
      place_text: "3rd",
      prize_message:
        "Please visit the CCS Elite booth to claim your prize and certificate. Bring a valid ID for verification.",
    },
  };

  const config = placeConfig[place];

  if (!config) {
    throw new Error(
      `Invalid place: ${place}. Must be gold, silver, or bronze.`
    );
  }

  const htmlTemplate = fs.readFileSync("winner-email-template.html", "utf8");

  let htmlContent = htmlTemplate
    .replace(/{{winner_name}}/g, winnerName)
    .replace(/{{place_text}}/g, config.place_text)
    .replace(/{{programming_category}}/g, programmingCategory)
    .replace(/{{score}}/g, score)
    .replace(/{{trophy_emoji}}/g, config.trophy_emoji)
    .replace(/{{prize_message}}/g, config.prize_message)
    .replace(/{{border_color}}/g, config.border_color)
    .replace(/{{banner_gradient}}/g, config.banner_gradient)
    .replace(/{{banner_text_color}}/g, config.banner_text_color)
    .replace(/{{accent_color}}/g, config.accent_color)
    .replace(/{{stats_bg}}/g, config.stats_bg)
    .replace(/{{border_color_light}}/g, config.border_color_light);

  const info = await transporter.sendMail({
    from: `"CCS Elite" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `🎉 Congratulations! You Won ${config.place_text} Place — CCS Days 2025`,
    html: htmlContent,
  });

  console.log("📨 Message sent:", info.messageId);

  let previewUrl = null;
  if (useEthereal) {
    previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("🔗 Preview URL:", previewUrl);
  }

  return previewUrl;
}
