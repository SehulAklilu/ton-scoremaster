import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Alert,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MatchSelector from '../components/MatchSelector';

const CreateRoom = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        entryFee: '',
        description: ''
    });
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleMatchSelect = (match) => {
        setSelectedMatch(match);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedMatch) {
            setError('Please select a match');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/rooms', {
                ...formData,
                matchId: selectedMatch.id,
                matchDetails: {
                    homeTeam: selectedMatch.homeTeam,
                    awayTeam: selectedMatch.awayTeam,
                    date: selectedMatch.date,
                    league: selectedMatch.league
                }
            });

            navigate(`/rooms/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
            console.error('Error creating room:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Create New Room
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Room Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Entry Fee (TON)"
                            name="entryFee"
                            type="number"
                            value={formData.entryFee}
                            onChange={handleChange}
                            required
                            inputProps={{ min: 0.1, step: 0.1 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Select Match
                        </Typography>
                        <MatchSelector onMatchSelect={handleMatchSelect} />
                    </Grid>

                    {selectedMatch && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Selected Match
                                    </Typography>
                                    <Typography>
                                        {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {selectedMatch.league} - {new Date(selectedMatch.date).toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || !selectedMatch}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'Create Room'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default CreateRoom;
