import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import {
    People as PeopleIcon,
    SportsSoccer as SportsIcon,
    AccountBalance as BalanceIcon,
    History as HistoryIcon
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeRooms: 0,
        totalCommission: 0,
        totalTransactions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, roomsRes, commissionRes, transactionsRes] = await Promise.all([
                    axios.get('/api/admin/users'),
                    axios.get('/api/admin/rooms'),
                    axios.get('/api/admin/stats/commission'),
                    axios.get('/api/admin/transactions')
                ]);

                setStats({
                    totalUsers: usersRes.data.length,
                    activeRooms: roomsRes.data.filter(room => room.status === 'ACTIVE').length,
                    totalCommission: commissionRes.data.totalCommission,
                    totalTransactions: transactionsRes.data.length
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon }) => (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 140,
            }}
        >
            {icon}
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                {title}
            </Typography>
            <Typography component="p" variant="h4">
                {loading ? <CircularProgress size={24} /> : value}
            </Typography>
        </Paper>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Rooms"
                        value={stats.activeRooms}
                        icon={<SportsIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Commission"
                        value={`${stats.totalCommission} TON`}
                        icon={<BalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Transactions"
                        value={stats.totalTransactions}
                        icon={<HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 