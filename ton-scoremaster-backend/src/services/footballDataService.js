// ton-scoremaster-backend/src/services/footballDataService.js
// NOTE: This file now uses TheSportsDB!

const axios = require('axios');
const Match = require('../models/Match');

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'http://api.football-data.org/v4';

const fetchAndCacheUpcomingMatches = async () => {
    try {
        console.log('Fetching upcoming matches...');
        
        const response = await axios.get(`${BASE_URL}/matches`, {
            headers: {
                'X-Auth-Token': FOOTBALL_DATA_API_KEY
            },
            params: {
                status: 'SCHEDULED',
                limit: 50
            }
        });

        const matches = response.data.matches;
        
        if (!matches || matches.length === 0) {
            console.log('No matches found in API response');
            return;
        }

        console.log(`Found ${matches.length} matches from API`);

        // Transform and save matches
        const matchPromises = matches.map(match => {
            return Match.findOneAndUpdate(
                { id: match.id },
                {
                    homeTeam: match.homeTeam.name,
                    awayTeam: match.awayTeam.name,
                    date: new Date(match.utcDate),
                    league: match.competition.name,
                    status: 'scheduled'
                },
                { upsert: true, new: true }
            );
        });

        await Promise.all(matchPromises);
        console.log('Successfully cached matches');
    } catch (error) {
        console.error('Error fetching and caching matches:', error.message);
    }
};

// --- Function to Fetch Results for Specific Matches ---
// Need to fetch results for specific finished match IDs using their API
const fetchMatchResults = async (matchApiIds) => {
    console.log(`Fetching results using TheSportsDB for match IDs: ${matchApiIds.join(',')}`);

     if (!FOOTBALL_DATA_API_KEY || FOOTBALL_DATA_API_KEY.includes('undefined')) {
         console.error('CRITICAL ERROR: FOOTBALL_DATA_API_KEY is not configured correctly for fetchMatchResults.');
         return [];
     }

    let results = [];
    // TheSportsDB typically requires fetching one event at a time by ID using lookupevent.php
    for (const eventId of matchApiIds) {
        const url = `${BASE_URL}/matches/${eventId}`;
        console.log(`---> Fetching result details for Event ID: ${eventId}`);

        const requestConfig = {
            headers: {
                'X-Auth-Token': FOOTBALL_DATA_API_KEY
            },
            timeout: 10000
        };

        try {
            const response = await axios.get(url, requestConfig);
            const apiEvent = response.data;

            if (apiEvent) {
                const { id, status, score } = apiEvent;
                const internalStatus = status;

                // Only return data if the match is actually finished according to our mapping
                 if (internalStatus === 'FINISHED' && score.fullTime.home !== null && score.fullTime.away !== null) {
                    results.push({
                         apiId: parseInt(id, 10),
                         status: internalStatus,
                         score: {
                             fullTime: score.fullTime
                         }
                     });
                 } else {
                     console.log(`   Event ${id} status is '${internalStatus}' or score missing, not considered finished.`);
                 }
            } else {
                 console.warn(`   No event details found for ID: ${eventId}`);
            }

            // Delay between requests
             await new Promise(resolve => setTimeout(resolve, 1100)); // 1.1 second delay

        } catch (error) {
             console.error(`--- ERROR fetching result for Event ID: ${eventId} ---`);
             // Simplified error logging for brevity
             if (error.response) console.error('API Error Status:', error.response.status);
             else if (error.request) console.error('Network Error fetching result.');
             else console.error('Setup Error fetching result:', error.message);
             // Continue to next ID even if one fails
        }
    } // End loop through matchApiIds

    console.log(`fetchMatchResults job (using TheSportsDB) finished. Found ${results.length} finished results.`);
    return results; // Return array of { apiId, status, score } objects
};

module.exports = {
    fetchAndCacheUpcomingMatches,
    fetchMatchResults,
};