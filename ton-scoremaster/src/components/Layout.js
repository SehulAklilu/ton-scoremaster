import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import WalletConnect from './WalletConnect';

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        TON ScoreMaster
                    </Typography>
                    <WalletConnect />
                </Toolbar>
            </AppBar>
            <Container component="main" sx={{ flex: 1, py: 4 }}>
                <Outlet />
            </Container>
            <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
                <Container maxWidth="sm">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} TON ScoreMaster. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout; 