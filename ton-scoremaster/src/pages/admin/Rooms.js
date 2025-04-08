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
    TextField,
    Chip
} from '@mui/material';
import axios from 'axios';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('/api/admin/rooms');
            setRooms(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setLoading(false);
        }
    };

    const handleViewDetails = (room) => {
        setSelectedRoom(room);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRoom(null);
    };

    const handleDistributeJackpot = async (roomId) => {
        try {
            await axios.post(`/api/admin/rooms/${roomId}/distribute`);
            fetchRooms(); // Refresh rooms data
        } catch (error) {
            console.error('Error distributing jackpot:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'COMPLETED':
                return 'primary';
            case 'LOCKED':
                return 'warning';
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    };

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.creator.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Rooms Management
            </Typography>
            <TextField
                fullWidth
                label="Search Rooms"
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
                                <TableCell>Status</TableCell>
                                <TableCell>Participants</TableCell>
                                <TableCell>Jackpot</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRooms.map((room) => (
                                <TableRow key={room._id}>
                                    <TableCell>{room.name}</TableCell>
                                    <TableCell>{room.creator.username}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={room.status}
                                            color={getStatusColor(room.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {room.participants.length}/{room.maxParticipants}
                                    </TableCell>
                                    <TableCell>{room.jackpot.totalAmount} TON</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewDetails(room)}
                                            sx={{ mr: 1 }}
                                        >
                                            View Details
                                        </Button>
                                        {room.status === 'COMPLETED' && room.winners.some(w => w.payoutStatus === 'PENDING') && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                onClick={() => handleDistributeJackpot(room._id)}
                                            >
                                                Distribute
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                {selectedRoom && (
                    <>
                        <DialogTitle>Room Details</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Room Name:</strong> {selectedRoom.name}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Creator:</strong> {selectedRoom.creator.username}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Status:</strong> {selectedRoom.status}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Participants:</strong> {selectedRoom.participants.length}/{selectedRoom.maxParticipants}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Bet Amount:</strong> {selectedRoom.betAmountTON} TON
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Total Jackpot:</strong> {selectedRoom.jackpot.totalAmount} TON
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Commission:</strong> {selectedRoom.jackpot.commission} TON
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Created At:</strong> {new Date(selectedRoom.createdAt).toLocaleString()}
                                </Typography>
                                
                                {selectedRoom.winners.length > 0 && (
                                    <>
                                        <Typography variant="h6" sx={{ mt: 2 }}>
                                            Winners
                                        </Typography>
                                        {selectedRoom.winners.map((winner, index) => (
                                            <Box key={index} sx={{ mt: 1 }}>
                                                <Typography variant="subtitle1">
                                                    <strong>Winner {index + 1}:</strong> {winner.user.username}
                                                </Typography>
                                                <Typography variant="subtitle1">
                                                    <strong>Points:</strong> {winner.points}
                                                </Typography>
                                                <Typography variant="subtitle1">
                                                    <strong>Prize Amount:</strong> {winner.prizeAmount} TON
                                                </Typography>
                                                <Typography variant="subtitle1">
                                                    <strong>Payout Status:</strong> {winner.payoutStatus}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </>
                                )}
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

export default Rooms; 