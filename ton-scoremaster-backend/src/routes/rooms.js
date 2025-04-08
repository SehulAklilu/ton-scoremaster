import express from 'express';
import Room from '../models/Room.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get all rooms with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    const query = {};
    if (status) query.status = status;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const rooms = await Room.find(query)
      .populate('match')
      .populate('players.user', 'username')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Room.countDocuments(query);

    res.json({
      rooms,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('match')
      .populate('players.user', 'username')
      .populate('createdBy', 'username');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new room
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const room = new Room({
      ...req.body,
      createdBy: req.user._id
    });

    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a room
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Only allow the creator to update the room
    if (room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this room' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('match').populate('players.user', 'username');

    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a room
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Only allow the creator to delete the room
    if (room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a room
router.post('/:id/join', isAuthenticated, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.status !== 'waiting') {
      return res.status(400).json({ message: 'Room is not accepting new players' });
    }

    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ message: 'Room is full' });
    }

    // Check if user is already in the room
    if (room.players.some(player => player.user.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Already joined this room' });
    }

    room.players.push({
      user: req.user._id,
      score: 0
    });

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 