const Room = require('../models/Room');

// POST: Create a new room
const createRoom = async (req, res) => {
  try {
    const { name, matches } = req.body;
    const newRoom = new Room({ name, matches });
    await newRoom.save();
    res.status(201).json({ message: 'Room created successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error });
  }
};

// GET: Fetch all rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error });
  }
};

module.exports = { createRoom, getRooms };
