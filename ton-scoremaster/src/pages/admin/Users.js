import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telegramId.toString().includes(searchTerm)
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Users Management
            </Typography>
            <TextField
                fullWidth
                label="Search Users"
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
                                <TableCell>Username</TableCell>
                                <TableCell>Telegram ID</TableCell>
                                <TableCell>Wallet Address</TableCell>
                                <TableCell>Joined Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.telegramId}</TableCell>
                                    <TableCell>{user.walletAddress || 'Not set'}</TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewDetails(user)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                {selectedUser && (
                    <>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Username:</strong> {selectedUser.username}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Telegram ID:</strong> {selectedUser.telegramId}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Wallet Address:</strong> {selectedUser.walletAddress || 'Not set'}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Joined Date:</strong> {new Date(selectedUser.createdAt).toLocaleString()}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Total Rooms Created:</strong> {selectedUser.roomsCreated || 0}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Total Rooms Joined:</strong> {selectedUser.roomsJoined || 0}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Total Wins:</strong> {selectedUser.totalWins || 0}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Total Winnings:</strong> {selectedUser.totalWinnings || 0} TON
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default Users; 