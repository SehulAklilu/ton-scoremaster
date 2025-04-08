import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Terms = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Terms of Use
                </Typography>
                <Typography variant="body1" paragraph>
                    This is a placeholder for the Terms of Use page. Please update with your actual terms.
                </Typography>
            </Box>
        </Container>
    );
};

export default Terms; 