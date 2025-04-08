require("dotenv").config();

const sportsDbApiKey = process.env.THESPORTSDB_API_KEY || '3'; // Default to '3'

module.exports = {
  BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  PORT: process.env.PORT || 5002,
  MONGODB_URI: process.env.MONGODB_URI,
  theSportsDbApiKey: sportsDbApiKey,
  theSportsDbBaseUrl: `https://www.thesportsdb.com/api/v1/json/${sportsDbApiKey}`, 
};
