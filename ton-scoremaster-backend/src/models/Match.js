// ton-scoremaster-backend/src/models/Match.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    id: Number, // football-data.org team ID
    name: String,
    shortName: String,
    crest: String, // URL to team crest
}, { _id: false });

const scoreSchema = new mongoose.Schema({
    home: { type: Number, default: null },
    away: { type: Number, default: null }
}, { _id: false });

const matchSchema = new mongoose.Schema({
    apiId: { // The unique ID from football-data.org
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    utcDate: { // Match date/time in UTC
        type: Date,
        required: true,
        index: true,
    },
    status: { // e.g., 'SCHEDULED', 'LIVE', 'IN_PLAY', 'PAUSED', 'FINISHED', 'SUSPENDED', 'POSTPONED', 'CANCELLED'
        type: String,
        required: true,
        index: true,
    },
    leagueCode: { // e.g., 'PL', 'SA', 'BL1', 'FL1', 'DED', 'PD'
         type: String,
         required: true,
         index: true,
    },
    homeTeam: teamSchema,
    awayTeam: teamSchema,
    score: { // Stores the final score ('FT' from API)
        fullTime: scoreSchema,
        // You could add halfTime, penalties etc. if needed later
    },
    lastUpdatedApi: Date, // When was this match data last fetched/updated from API
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

// Compound index for efficient querying of upcoming matches by league and date
matchSchema.index({ leagueCode: 1, utcDate: 1, status: 1 });

// Only define the model if it hasn't been defined before
const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);

module.exports = Match;