const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { isAdmin } = require('../middleware/auth');

// Get all matches
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find()
            .sort({ date: 1 }) // Sort by date ascending
            .limit(50); // Limit to 50 matches to prevent overload

        res.json(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Error fetching matches' });
    }
});

// Create a new match (admin only)
router.post('/', isAdmin, async (req, res) => {
    try {
        const { homeTeam, awayTeam, date, league } = req.body;

        const match = new Match({
            homeTeam,
            awayTeam,
            date: new Date(date),
            league
        });

        await match.save();
        res.status(201).json(match);
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ message: 'Error creating match' });
    }
});

// Update a match (admin only)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        res.json(match);
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({ message: 'Error updating match' });
    }
});

// Delete a match (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const match = await Match.findByIdAndDelete(req.params.id);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        res.json({ message: 'Match deleted successfully' });
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ message: 'Error deleting match' });
    }
});

module.exports = router; 