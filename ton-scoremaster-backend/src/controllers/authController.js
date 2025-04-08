const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { BOT_TOKEN, JWT_SECRET } = require("../config/env");

// Telegram authentication
const verifyTelegramAuth = (initData) => {
  if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN is not set in environment variables.");
  }

  const secret = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const data = new URLSearchParams(initData);
  const hash = data.get("hash");

  data.delete("hash");
  const checkString = [...data].sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => `${k}=${v}`).join("\n");

  const calculatedHash = crypto.createHmac("sha256", secret).update(checkString).digest("hex");

  return calculatedHash === hash;
};

// JWT-based authentication
const login = (req, res) => {
  const { username, password } = req.body;

  // For testing purposes, we'll use a simple hardcoded user
  // In production, you should verify against a database
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign(
      { 
        username: 'admin',
        isAdmin: true 
      },
      JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

const authenticateUser = (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ error: "Missing authentication data." });
  }

  if (verifyTelegramAuth(initData)) {
    // Generate JWT token for Telegram auth as well
    const token = jwt.sign(
      { 
        telegramUser: true,
        isAdmin: false
      },
      JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    res.json({ success: true, message: "Authentication successful!", token });
  } else {
    res.status(403).json({ error: "Invalid authentication data." });
  }
};

module.exports = { 
  authenticateUser,
  login
};
