// ton-scoremaster-backend/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { // The unique Telegram User ID
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    firstName: { // From Telegram profile
        type: String,
        required: true,
    },
    lastName: { // Optional, from Telegram profile
        type: String,
    },
    username: { // Optional, from Telegram profile
        type: String,
        index: true,
    },
    isPremium: { // Optional, from Telegram profile
       type: Boolean,
       default: false,
    },
    walletAddress: { // TON wallet address
        type: String,
        index: true,
    },
    transactions: [{
        type: {
            type: String,
            enum: ['DEPOSIT', 'WITHDRAWAL', 'PRIZE', 'REFUND'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'FAILED', 'PENDING_TRANSFER'],
            default: 'PENDING'
        },
        transactionHash: String,
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // We'll add wallet info later, maybe as an embedded doc or separate collection
});

const User = mongoose.model('User', userSchema);

module.exports = User;