// ton-scoremaster-backend/src/models/Room.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
    name: {
         type: String,
         required: [true, 'Room name is required'],
         trim: true,
    },
    creator: { // Reference to the User who created the room
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    matches: [{ // Array of references to Match documents
        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true,
    }],
    // Validate that matches array always has 6 elements upon creation? Can add validation logic.
    betAmountTON: { // The agreed bet amount in TON
        type: Number,
        required: true,
        min: [0, 'Bet amount cannot be negative'] // Or maybe min: 1?
    },
    status: { // Status of the room
        type: String,
        enum: ['PENDING', 'ACTIVE', 'LOCKED', 'COMPLETED', 'CANCELLED'], // PENDING: Created, not started. ACTIVE: Accepting predictions. LOCKED: Predictions closed, games ongoing. COMPLETED: Results calculated. CANCELLED: Problem.
        default: 'ACTIVE', // Should maybe default to PENDING until creator confirms? Or ACTIVE right away? Let's start with ACTIVE.
        required: true,
        index: true,
    },
    isPublic: { // Can users see this in a public list?
         type: Boolean,
         default: true,
         index: true,
    },
    predictionDeadline: { // Calculated based on the earliest match time
         type: Date,
         required: true,
    },
    participants: [{ // Users who have joined (and maybe paid?)
         type: Schema.Types.ObjectId,
         ref: 'User',
    }],
    maxParticipants: { // Optional limit
         type: Number,
         default: 30,
         min: 2,
         max: 30
    },
    jackpot: {
        totalAmount: {
            type: Number,
            default: 0
        },
        commission: {
            type: Number,
            default: 0
        },
        distributedAmount: {
            type: Number,
            default: 0
        }
    },
    winners: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        points: Number,
        prizeAmount: Number,
        walletAddress: String,
        payoutStatus: {
            type: String,
            enum: ['PENDING', 'PAID', 'REFUNDED'],
            default: 'PENDING'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Add indexes for common queries
});

// Index for finding public, active rooms
roomSchema.index({ isPublic: 1, status: 1 });

// Ensure a user can't create rooms with the exact same name? (Optional)
// roomSchema.index({ creator: 1, name: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;