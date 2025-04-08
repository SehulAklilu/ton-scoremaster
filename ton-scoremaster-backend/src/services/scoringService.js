const Prediction = require('../models/Prediciton');
const Room = require('../models/Room');

const calculateMatchPoints = (actualScore, predictedScore) => {
    const { home: actualHome, away: actualAway } = actualScore;
    const { home: predictedHome, away: predictedAway } = predictedScore;

    // Exact score prediction
    if (actualHome === predictedHome && actualAway === predictedAway) {
        return 6;
    }

    const actualOutcome = actualHome > actualAway ? 'home' : actualHome < actualAway ? 'away' : 'draw';
    const predictedOutcome = predictedHome > predictedAway ? 'home' : predictedHome < predictedAway ? 'away' : 'draw';

    // Correct outcome with one correct score
    if (actualOutcome === predictedOutcome && 
        (actualHome === predictedHome || actualAway === predictedAway)) {
        return 4;
    }

    // Correct outcome only
    if (actualOutcome === predictedOutcome) {
        return 2;
    }

    // Incorrect prediction
    return 0;
};

const calculateTotalPoints = async (roomId) => {
    const predictions = await Prediction.find({ room: roomId });
    
    for (const prediction of predictions) {
        let totalPoints = 0;
        for (const pred of prediction.predictions) {
            const match = await Match.findById(pred.match);
            if (match && match.actualScore) {
                const points = calculateMatchPoints(match.actualScore, pred.predictedScore);
                pred.points = points;
                totalPoints += points;
            }
        }
        prediction.totalPoints = totalPoints;
        await prediction.save();
    }
};

const distributeJackpot = async (roomId) => {
    const room = await Room.findById(roomId);
    if (!room || room.status !== 'COMPLETED') {
        throw new Error('Room not found or not completed');
    }

    const predictions = await Prediction.find({ room: roomId })
        .sort({ totalPoints: -1 });

    if (predictions.length === 0) {
        // Refund all participants if no predictions
        await refundParticipants(room);
        return;
    }

    const highestScore = predictions[0].totalPoints;
    const winners = predictions.filter(p => p.totalPoints === highestScore);
    
    const jackpotAmount = room.jackpot.totalAmount * 0.9; // 90% of total
    const prizePerWinner = jackpotAmount / winners.length;

    // Update room with winners
    room.winners = winners.map(winner => ({
        user: winner.user,
        points: winner.totalPoints,
        prizeAmount: prizePerWinner,
        walletAddress: winner.user.walletAddress,
        payoutStatus: 'PENDING'
    }));

    room.jackpot.distributedAmount = jackpotAmount;
    room.jackpot.commission = room.jackpot.totalAmount * 0.1; // 10% commission
    await room.save();
};

const refundParticipants = async (room) => {
    // Implement refund logic using TON blockchain
    // This will need to be implemented based on your TON integration
    for (const participant of room.participants) {
        // Refund betAmountTON to each participant
        // Update room status and transaction history
    }
};

module.exports = {
    calculateMatchPoints,
    calculateTotalPoints,
    distributeJackpot,
    refundParticipants
}; 