import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TextField,
    Grid
} from '@mui/material';
import axios from 'axios';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalTransactions: 0,
        totalAmount: 0,
        averageAmount: 0
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('/api/admin/transactions');
            const completedRooms = response.data;
            
            // Calculate statistics
            const totalAmount = completedRooms.reduce((sum, room) => sum + room.jackpot.totalAmount, 0);
            const totalTransactions = completedRooms.length;
            const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

            setStats({
                totalTransactions,
                totalAmount,
                averageAmount
            });
            setTransactions(completedRooms);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.creator.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatCard = ({ title, value }) => (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                bgcolor: 'background.paper'
            }}
        >
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h4">
                {loading ? <CircularProgress size={24} /> : value}
            </Typography>
        </Paper>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Transaction History
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Transactions"
                        value={stats.totalTransactions}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Amount"
                        value={`${stats.totalAmount} TON`}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Average Amount"
                        value={`${stats.averageAmount.toFixed(2)} TON`}
                    />
                </Grid>
            </Grid>

            <TextField
                fullWidth
                label="Search Transactions"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
            />

            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Room Name</TableCell>
                                <TableCell>Creator</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Commission</TableCell>
                                <TableCell>Winners</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTransactions.map((room) => (
                                <TableRow key={room._id}>
                                    <TableCell>{room.name}</TableCell>
                                    <TableCell>{room.creator.username}</TableCell>
                                    <TableCell>
                                        {new Date(room.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{room.jackpot.totalAmount} TON</TableCell>
                                    <TableCell>{room.jackpot.commission} TON</TableCell>
                                    <TableCell>
                                        {room.winners.length > 0 ? (
                                            room.winners.map((winner, index) => (
                                                <Box key={index} sx={{ mb: 1 }}>
                                                    {winner.user.username} - {winner.prizeAmount} TON
                                                    <Chip
                                                        label={winner.payoutStatus}
                                                        color={winner.payoutStatus === 'PAID' ? 'success' : 'warning'}
                                                        size="small"
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                            ))
                                        ) : (
                                            'No winners'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={room.status}
                                            color={room.status === 'COMPLETED' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default Transactions; 