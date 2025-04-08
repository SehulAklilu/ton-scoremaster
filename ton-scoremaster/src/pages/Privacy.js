import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Privacy = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Privacy Policy
                </Typography>
                <Typography variant="body1" paragraph>
                    This is a placeholder for the Privacy Policy page. Please update with your actual privacy policy.
                </Typography>
            </Box>
        </Container>
    );
};

export default Privacy; 