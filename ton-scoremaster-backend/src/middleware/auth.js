const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require("crypto");
const { BOT_TOKEN } = require("../config/env");

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

const isAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

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

const isAuthenticated = (req, res, next) => {
    try {
        const initData = req.headers['x-telegram-init-data'];
        
        if (!initData) {
            return res.status(401).json({ message: 'Telegram authentication required' });
        }

        if (!verifyTelegramAuth(initData)) {
            return res.status(403).json({ message: 'Invalid Telegram authentication' });
        }

        // Parse user data from initData
        const userData = new URLSearchParams(initData).get('user');
        if (userData) {
            req.user = JSON.parse(userData);
        }

        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = {
    auth,
    isAdmin,
    isAuthenticated
}; 