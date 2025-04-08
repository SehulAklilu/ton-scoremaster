const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { isAdmin, isAuthenticated } = require('../src/middleware/auth');

// Test endpoint (public)
router.get('/test', (req, res) => {
    res.json([
        {
            id: "1",
            homeTeam: "Manchester United",
            awayTeam: "Liverpool",
            date: "2024-03-20T15:00:00Z",
            league: "Premier League"
        },
        {
            id: "2",
            homeTeam: "Barcelona",
            awayTeam: "Real Madrid",
            date: "2024-03-21T20:00:00Z",
            league: "La Liga"
        }
    ]);
});

// Get all matches (requires authentication)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        console.log('Fetching matches...');
        const matches = await Match.find()
            .sort({ date: 1 })
            .limit(50);

        if (!matches || matches.length === 0) {
            console.log('No matches found, returning test data');
            return res.json([
                {
                    id: "1",
                    homeTeam: "Manchester United",
                    awayTeam: "Liverpool",
                    date: "2024-03-20T15:00:00Z",
                    league: "Premier League"
                },
                {
                    id: "2",
                    homeTeam: "Barcelona",
                    awayTeam: "Real Madrid",
                    date: "2024-03-21T20:00:00Z",
                    league: "La Liga"
                }
            ]);
        }

        console.log(`Found ${matches.length} matches`);
        res.json(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ 
            message: 'Error fetching matches',
            error: error.message 
        });
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
        res.status(500).json({ 
            message: 'Error creating match',
            error: error.message 
        });
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
        res.status(500).json({ 
            message: 'Error updating match',
            error: error.message 
        });
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
        res.status(500).json({ 
            message: 'Error deleting match',
            error: error.message 
        });
    }
});

module.exports = router; 