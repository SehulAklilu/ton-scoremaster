import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import axios from 'axios';

const Commission = () => {
    const [stats, setStats] = useState({
        totalCommission: 0,
        totalRooms: 0,
        averageCommission: 0
    });
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCommissionData();
    }, []);

    const fetchCommissionData = async () => {
        try {
            const [statsRes, roomsRes] = await Promise.all([
                axios.get('/api/admin/stats/commission'),
                axios.get('/api/admin/rooms')
            ]);

            setStats(statsRes.data);
            setRooms(roomsRes.data.filter(room => room.status === 'COMPLETED' && room.jackpot.commission > 0));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching commission data:', error);
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, color }) => (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                bgcolor: color || 'background.paper'
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
                Commission Tracking
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Commission"
                        value={`${stats.totalCommission} TON`}
                        color="#e3f2fd"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Rooms"
                        value={stats.totalRooms}
                        color="#f3e5f5"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Average Commission"
                        value={`${stats.averageCommission.toFixed(2)} TON`}
                        color="#e8f5e9"
                    />
                </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom>
                Commission History
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Room Name</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total Jackpot</TableCell>
                                <TableCell>Commission (10%)</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rooms.map((room) => (
                                <TableRow key={room._id}>
                                    <TableCell>{room.name}</TableCell>
                                    <TableCell>
                                        {new Date(room.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{room.jackpot.totalAmount} TON</TableCell>
                                    <TableCell>{room.jackpot.commission} TON</TableCell>
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

export default Commission; 