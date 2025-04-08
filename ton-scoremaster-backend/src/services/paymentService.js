const axios = require('axios');
const User = require('../models/User');
const Room = require('../models/Room');

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

const paymentService = {
    // Create a payment request for room entry
    createPaymentRequest: async (userId, roomId) => {
        try {
            const user = await User.findOne({ telegramId: userId });
            const room = await Room.findById(roomId);

            if (!user || !room) {
                throw new Error('User or room not found');
            }

            // Create a payment request that will be sent to the frontend
            const paymentRequest = {
                type: 'ROOM_ENTRY',
                roomId: room._id,
                userId: user._id,
                amount: room.betAmountTON,
                description: `Entry fee for prediction room: ${room.name}`
            };

            return paymentRequest;
        } catch (error) {
            console.error('Error creating payment request:', error);
            throw error;
        }
    },

    // Verify and process a TON payment
    verifyAndProcessPayment: async (paymentData) => {
        try {
            const { userId, roomId, transactionHash, amount } = paymentData;
            
            // Verify the transaction on the TON blockchain
            const isVerified = await verifyTONTransaction(transactionHash, amount);
            if (!isVerified) {
                throw new Error('Transaction verification failed');
            }

            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Record the transaction
            user.transactions.push({
                type: 'DEPOSIT',
                amount: amount,
                status: 'COMPLETED',
                transactionHash: transactionHash,
                roomId: roomId
            });
            await user.save();

            // Add user to room participants
            const room = await Room.findById(roomId);
            if (!room) {
                throw new Error('Room not found');
            }

            if (!room.participants.includes(userId)) {
                room.participants.push(userId);
                room.jackpot.totalAmount += amount;
                await room.save();
            }

            return true;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    },

    // Verify a TON transaction
    verifyTONTransaction: async (transactionHash, expectedAmount) => {
        try {
            // This is a placeholder - you'll need to implement actual TON blockchain verification
            // You can use TON API or a blockchain explorer API
            const response = await axios.get(`https://tonapi.io/v2/blockchain/transactions/${transactionHash}`);
            
            // Verify the transaction details
            const transaction = response.data;
            return transaction && 
                   transaction.out_msgs && 
                   transaction.out_msgs.some(msg => msg.value === expectedAmount);
        } catch (error) {
            console.error('Error verifying transaction:', error);
            return false;
        }
    },

    // Process prize distribution
    distributePrizes: async (roomId) => {
        try {
            const room = await Room.findById(roomId)
                .populate('winners.user');

            if (!room || room.status !== 'COMPLETED') {
                throw new Error('Room not found or not completed');
            }

            for (const winner of room.winners) {
                if (winner.payoutStatus === 'PENDING') {
                    // Create a payment request for the winner
                    const paymentRequest = {
                        type: 'PRIZE',
                        roomId: room._id,
                        userId: winner.user._id,
                        amount: winner.prizeAmount,
                        description: `Prize for winning room: ${room.name}`
                    };

                    // The frontend will handle the actual TON transfer
                    // We just need to wait for the transaction verification
                    winner.payoutStatus = 'PENDING_TRANSFER';
                    await room.save();

                    // Record the pending transaction
                    winner.user.transactions.push({
                        type: 'PRIZE',
                        amount: winner.prizeAmount,
                        status: 'PENDING',
                        roomId: room._id
                    });
                    await winner.user.save();
                }
            }

            return true;
        } catch (error) {
            console.error('Error distributing prizes:', error);
            throw error;
        }
    },

    // Process refunds
    processRefund: async (roomId) => {
        try {
            const room = await Room.findById(roomId)
                .populate('participants');

            if (!room) {
                throw new Error('Room not found');
            }

            for (const participant of room.participants) {
                // Create a refund request
                const refundRequest = {
                    type: 'REFUND',
                    roomId: room._id,
                    userId: participant._id,
                    amount: room.betAmountTON,
                    description: `Refund for room: ${room.name}`
                };

                // The frontend will handle the actual TON transfer
                // We just need to wait for the transaction verification
                participant.transactions.push({
                    type: 'REFUND',
                    amount: room.betAmountTON,
                    status: 'PENDING',
                    roomId: room._id
                });
                await participant.save();
            }

            room.status = 'CANCELLED';
            await room.save();
            return true;
        } catch (error) {
            console.error('Error processing refunds:', error);
            throw error;
        }
    }
};

module.exports = paymentService; 