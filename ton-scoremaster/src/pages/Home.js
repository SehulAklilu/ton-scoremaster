import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Chip,
  Container,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 9
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0
  });
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString()
      }).toString();

      const response = await axios.get(`/api/rooms?${queryParams}`);
      setRooms(response.data?.rooms || []);
      setPagination(response.data?.pagination || { total: 0, totalPages: 0 });
      setError(null);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch rooms. Please try again later.');
      setRooms([]);
      setPagination({ total: 0, totalPages: 0 });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (event, value) => {
    setFilters(prev => ({
      ...prev,
      page: value
    }));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="200px"
          sx={{ backgroundColor: 'background.paper', p: 4, borderRadius: 1 }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => fetchRooms()}
            sx={{ mr: 2 }}
          >
            Retry
          </Button>
        </Box>
      );
    }

    if (!rooms || rooms.length === 0) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="200px"
          sx={{ backgroundColor: 'background.paper', p: 4, borderRadius: 1 }}
        >
          <Typography variant="body1" color="textSecondary" gutterBottom>
            No rooms available.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/create-room')}
            sx={{ mt: 2 }}
          >
            Create Your First Room
          </Button>
        </Box>
      );
    }

    return (
      <>
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" gutterBottom>
                      {room.name}
                    </Typography>
                    <Chip 
                      label={room.status} 
                      color={
                        room.status === 'waiting' ? 'primary' :
                        room.status === 'active' ? 'success' :
                        room.status === 'completed' ? 'default' :
                        'error'
                      }
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Match: {room.match?.homeTeam} vs {room.match?.awayTeam}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Players: {room.players?.length || 0}/{room.maxPlayers}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Entry Fee: {room.entryFee} TON
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Prize Pool: {room.prizePool} TON
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Created: {new Date(room.createdAt).toLocaleString()}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate(`/room/${room._id}`)}
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={room.status !== 'waiting'}
                  >
                    {room.status === 'waiting' ? 'Join Room' : 'View Room'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {pagination.totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={pagination.totalPages}
              page={filters.page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        sx={{
          backgroundColor: 'background.paper',
          p: 2,
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <Typography variant="h4" component="h1">
          Available Rooms
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/create-room')}
          size="large"
          sx={{
            minWidth: '200px',
            height: '48px'
          }}
        >
          Create New Room
        </Button>
      </Box>

      <Box mb={3} display="flex" gap={2} flexWrap="wrap">
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="waiting">Waiting</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            label="Sort By"
          >
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="players">Number of Players</MenuItem>
            <MenuItem value="entryFee">Entry Fee</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Order</InputLabel>
          <Select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            label="Order"
          >
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {renderContent()}
    </Container>
  );
}

export default Home;
