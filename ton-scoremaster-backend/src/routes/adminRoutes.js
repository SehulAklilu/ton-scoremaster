const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(isAdmin);

// Room management
router.get('/rooms', adminController.getAllRooms);
router.get('/rooms/:roomId', adminController.getRoomDetails);
router.post('/rooms/:roomId/distribute', adminController.forceDistributeJackpot);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);

// Statistics and reports
router.get('/stats/commission', adminController.getCommissionStats);
router.get('/transactions', adminController.getTransactionHistory);

module.exports = router; 