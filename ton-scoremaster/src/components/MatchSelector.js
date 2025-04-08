import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import axios from 'axios';

const MatchSelector = ({ onMatchSelect }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState('');
    const [selectedLeague, setSelectedLeague] = useState('all');
    const [leagues, setLeagues] = useState([]);
    const [retryCount, setRetryCount] = useState(0);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get Telegram initData
            const initData = window.Telegram.WebApp.initData;
            if (!initData) {
                setError('Telegram authentication required');
                return;
            }

            // Make the API call with Telegram initData
            const response = await axios.get('/api/matches', {
                headers: {
                    'X-Telegram-Init-Data': initData
                }
            });
            
            const matchesData = response.data;
            setMatches(matchesData);

            // Extract unique leagues
            const uniqueLeagues = [...new Set(matchesData.map(match => match.league))];
            setLeagues(uniqueLeagues);
        } catch (err) {
            console.error('Error fetching matches:', err);
            if (err.response?.status === 401) {
                setError('Telegram authentication required');
            } else if (retryCount < 3) {
                setRetryCount(prev => prev + 1);
                setTimeout(fetchMatches, 2000); // Retry after 2 seconds
            } else {
                setError('Failed to fetch matches. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [retryCount]);

    const handleLeagueChange = (event) => {
        setSelectedLeague(event.target.value);
        setSelectedMatch(''); // Reset selected match when league changes
    };

    const handleMatchSelect = (match) => {
        setSelectedMatch(match.id);
        onMatchSelect(match);
    };

    const filteredMatches = selectedLeague === 'all' 
        ? matches 
        : matches.filter(match => match.league === selectedLeague);

    if (loading && retryCount === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button 
                    variant="contained" 
                    onClick={() => {
                        setRetryCount(0);
                        fetchMatches();
                    }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select League</InputLabel>
                <Select
                    value={selectedLeague}
                    onChange={handleLeagueChange}
                    label="Select League"
                >
                    <MenuItem value="all">All Leagues</MenuItem>
                    {leagues.map((league) => (
                        <MenuItem key={league} value={league}>
                            {league}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={2}>
                {filteredMatches.map((match) => (
                    <Grid item xs={12} sm={6} md={4} key={match.id}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                backgroundColor: selectedMatch === match.id ? 'primary.light' : 'background.paper'
                            }}
                            onClick={() => handleMatchSelect(match)}
                        >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {match.homeTeam} vs {match.awayTeam}
                                </Typography>
                                <Typography color="text.secondary">
                                    {new Date(match.date).toLocaleDateString()}
                                </Typography>
                                <Typography color="text.secondary">
                                    {match.league}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MatchSelector; 