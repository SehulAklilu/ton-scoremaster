const express = require("express");
const axios = require("axios");
const csvParser = require("csv-parser");
const stream = require("stream");

const router = express.Router();

// URL for fixtures data (Example: Premier League)
const FIXTURES_URL =
  "https://www.football-data.org/v4/competitions/PL/matches";

router.get("/fixtures", async (req, res) => {
  try {
    const response = await axios.get(FIXTURES_URL, {
      headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY },
    });
    res.json({ message: "Fixtures route is working" });
    res.json(response.data); // Send JSON response
    
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    res.status(500).json({ message: "Failed to fetch fixtures" });
  }
});

module.exports = router;
