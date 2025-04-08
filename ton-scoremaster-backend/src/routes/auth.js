const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Function to verify Telegram authentication data
const verifyTelegramAuth = (authData) => {
    const secretKey = crypto.createHmac("sha256", BOT_TOKEN).digest();
    const checkString = Object.keys(authData)
        .filter((key) => key !== "hash")
        .sort()
        .map((key) => `${key}=${authData[key]}`)
        .join("\n");

    const hash = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

    return hash === authData.hash;
};

// Route to verify Telegram authentication
router.post("/auth/telegram", (req, res) => {
    const authData = req.body;

    if (!verifyTelegramAuth(authData)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // If authentication is successful, return user data
    return res.json({
        message: "Authenticated",
        user: {
            id: authData.id,
            first_name: authData.first_name,
            last_name: authData.last_name,
            username: authData.username,
            photo_url: authData.photo_url,
        },
    });
});

module.exports = router;
