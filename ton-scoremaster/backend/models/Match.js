const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    homeTeam: {
        type: String,
        required: true,
        trim: true
    },
    awayTeam: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    league: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED'],
        default: 'UPCOMING'
    },
    score: {
        home: {
            type: Number,
            default: null
        },
        away: {
            type: Number,
            default: null
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
matchSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match; 