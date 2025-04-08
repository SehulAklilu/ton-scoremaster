const Room = require('../models/Room');
const User = require('../models/User');
const { distributeJackpot } = require('../services/scoringService');

const adminController = {
    // Get all rooms with detailed information
    getAllRooms: async (req, res) => {
        try {
            const rooms = await Room.find()
                .populate('creator', 'username telegramId')
                .populate('participants', 'username telegramId')
                .populate('winners.user', 'username telegramId');
            res.json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get room details
    getRoomDetails: async (req, res) => {
        try {
            const room = await Room.findById(req.params.roomId)
                .populate('creator', 'username telegramId')
                .populate('participants', 'username telegramId')
                .populate('winners.user', 'username telegramId')
                .populate('matches');
            res.json(room);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find()
                .select('-password')
                .sort({ createdAt: -1 });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get user details
    getUserDetails: async (req, res) => {
        try {
            const user = await User.findById(req.params.userId)
                .select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Force distribute jackpot for a room
    forceDistributeJackpot: async (req, res) => {
        try {
            await distributeJackpot(req.params.roomId);
            res.json({ message: 'Jackpot distribution initiated' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get commission statistics
    getCommissionStats: async (req, res) => {
        try {
            const stats = await Room.aggregate([
                {
                    $match: {
                        status: 'COMPLETED',
                        'jackpot.commission': { $gt: 0 }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalCommission: { $sum: '$jackpot.commission' },
                        totalRooms: { $sum: 1 },
                        averageCommission: { $avg: '$jackpot.commission' }
                    }
                }
            ]);
            res.json(stats[0] || { totalCommission: 0, totalRooms: 0, averageCommission: 0 });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get transaction history
    getTransactionHistory: async (req, res) => {
        try {
            const rooms = await Room.find({
                status: 'COMPLETED'
            })
                .select('name createdAt jackpot winners')
                .populate('winners.user', 'username telegramId')
                .sort({ createdAt: -1 });
            res.json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = adminController; 