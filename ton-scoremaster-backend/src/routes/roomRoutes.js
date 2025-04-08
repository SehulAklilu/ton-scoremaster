const express = require('express');
const { createRoom, getRooms } = require('../controllers/roomController');

const router = express.Router();

// Route for creating a room
router.post('/rooms', createRoom);

// Route for getting all rooms
router.get('/rooms', getRooms);

module.exports = router;
