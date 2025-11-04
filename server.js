import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import { sendConfirmationEmail } from "./send-email.js";
import { sendWinnerEmail } from "./send-winner-email.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Original confirmation email endpoint
app.post("/send", async (req, res) => {
  const { email, name, category } = req.body;

  try {
    const previewUrl = await sendConfirmationEmail({
      toEmail: email,
      participantName: name,
      programmingLanguage: category,
      useEthereal: false,
    });

    if (previewUrl) console.log("🧪 Ethereal preview link:", previewUrl);

    res.json({
      success: true,
      message: "Email sent successfully!",
      previewUrl,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

// New winner email endpoint
app.post("/send-winner", async (req, res) => {
  const { email, name, place, category, score } = req.body;

  try {
    const previewUrl = await sendWinnerEmail({
      toEmail: email,
      winnerName: name,
      place: place,
      programmingCategory: category,
      score: score,
      useEthereal: false, // change to true for testing with Ethereal
    });

    if (previewUrl) console.log("🧪 Ethereal preview link:", previewUrl);

    res.json({
      success: true,
      message: "Winner email sent successfully!",
      previewUrl,
    });
  } catch (error) {
    console.error("❌ Error sending winner email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send winner email.",
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
