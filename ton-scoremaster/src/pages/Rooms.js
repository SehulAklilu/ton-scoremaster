import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";


const API_URL = "http://localhost:5000/api/fixtures"; // Updated to our backend route

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setRooms(data.matches || []); // Ensure it's an array
      } catch (err) {
        setError("Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#F5F5F5", minHeight: "100vh" }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Let's Play & Compete!
        </Typography>
      </Box>
      <Grid container spacing={2} justifyContent="center">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room._id}>
              <Card sx={{ borderRadius: 3, p: 2, textAlign: "center" }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 2 }}>
                    <SportsSoccerIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {room.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {room.matches.length} Matches Selected
                  </Typography>
                  <Link to={`/rooms/${room._id}`} style={{ textDecoration: "none" }}>
                    <Button variant="contained" fullWidth>
                      Join Room
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No rooms available.</Typography>
        )}
      </Grid>
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Link to="/create-room" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="secondary" size="large">
            Create a Room
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Rooms;
