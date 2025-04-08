// ton-scoremaster-backend/src/models/Prediction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const predictionSchema = new mongoose.Schema({
    user: { // User who made the prediction
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    room: { // Room the prediction belongs to
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    predictions: [{ // Array of predictions, one for each match in the room
        match: { // Reference to the specific Match document
            type: Schema.Types.ObjectId,
            ref: 'Match',
            required: true,
        },
        predictedScore: {
            home: { type: Number, required: true, min: 0 },
            away: { type: Number, required: true, min: 0 },
        },
        points: { // Points awarded for this specific prediction after results
            type: Number,
            default: null, // Null until scored
        }
    }, { _id: false }], // Don't need individual _id for each prediction object in the array
    totalPoints: { // Sum of points for this user in this room
         type: Number,
         default: null, // Null until scored
         index: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdatedAt: {
         type: Date,
         default: Date.now,
    }
});

// Index to quickly find a user's prediction for a specific room
predictionSchema.index({ user: 1, room: 1 }, { unique: true });
// Index to quickly find all predictions for a room
predictionSchema.index({ room: 1 });

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;