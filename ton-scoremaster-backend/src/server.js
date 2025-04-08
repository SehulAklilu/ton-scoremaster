require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const { PORT } = require("./config/env");
const bodyParser = require('body-parser');
const roomRoutes = require('./routes/roomRoutes');
const authRoutes = require("./routes/authRoutes");
const fixturesRoutes = require('./routes/fixtures');  // Importing the fixtures route
const roomsRoutes = require("./routes/roomRoutes");
const adminRoutes = require("./routes/adminRoutes");
const matchRoutes = require('../routes/matches');  // Add this line
const { fetchAndCacheUpcomingMatches } = require('./services/footballDataService');
const { initTON } = require('./services/tonService');
const path = require('path');

// dotenv.config();

const app = express();
// const port = 5000;
const port = process.env.PORT || 5002; 
const mongoUri = process.env.MONGODB_URI; 

// Enhanced CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5002'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

mongoose.connect(mongoUri || 'mongodb://localhost/ton_scoremaster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api", authRoutes);
// app.use('/api', roomRoutes);
app.use('/api', fixturesRoutes); 
app.use("/api/rooms", roomsRoutes);  
app.use("/api/admin", adminRoutes);
app.use("/api/matches", matchRoutes);  // Add this line

// Test endpoint
app.get("/api/matches/test", (req, res) => {
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

// Health check endpoint with better response
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../ton-scoremaster/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../ton-scoremaster/build', 'index.html'));
    });
}

// Initialize services with error handling
const initializeServices = async () => {
    try {
        await initTON();
        await fetchAndCacheUpcomingMatches();
        console.log('✅ Services initialized successfully');
    } catch (error) {
        console.error('Error initializing services:', error);
    }
};

// Start server with error handling
const server = app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    initializeServices();
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
    } else {
        console.error('Server error:', error);
    }
});