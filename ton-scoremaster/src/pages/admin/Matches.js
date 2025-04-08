import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const AdminMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get('/api/matches');
                setMatches(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch matches');
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Matches
                </Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {matches.map((match) => (
                            <TableRow key={match._id}>
                                <TableCell>{match._id}</TableCell>
                                <TableCell>{match.name}</TableCell>
                                <TableCell>{match.status}</TableCell>
                                <TableCell>{new Date(match.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminMatches; 