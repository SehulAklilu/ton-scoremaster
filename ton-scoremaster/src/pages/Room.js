import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const API_URL = "http://localhost:5000/api/rooms";

const Room = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch room");
        }
        const data = await response.json();
        setRoom(data);
      } catch (err) {
        setError("Error fetching room details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

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
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, px: 4 }}>
      <Typography variant="h4" gutterBottom>{room.name}</Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Match</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {room.matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.homeTeam} vs {match.awayTeam}</TableCell>
                <TableCell align="center">{match.date}</TableCell>
                <TableCell align="center">{match.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Room;
