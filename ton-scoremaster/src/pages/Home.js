import React from 'react';
import { Grid, Button, Card, CardContent, Typography } from '@mui/material';

function Home() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Featured Match 1</Typography>
              <Typography variant="body2">Details about the match...</Typography>
              <Button variant="contained" color="primary">View Match</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Featured Match 2</Typography>
              <Typography variant="body2">Details about the match...</Typography>
              <Button variant="contained" color="primary">View Match</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Featured Match 3</Typography>
              <Typography variant="body2">Details about the match...</Typography>
              <Button variant="contained" color="primary">View Match</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
