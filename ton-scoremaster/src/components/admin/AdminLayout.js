import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, People, MeetingRoom, AttachMoney, Receipt, Logout } from '@mui/icons-material';

const drawerWidth = 240;

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
        { text: 'Users', icon: <People />, path: '/admin/users' },
        { text: 'Rooms', icon: <MeetingRoom />, path: '/admin/rooms' },
        { text: 'Commission', icon: <AttachMoney />, path: '/admin/commission' },
        { text: 'Transactions', icon: <Receipt />, path: '/admin/transactions' },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Admin Panel
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        marginTop: '64px',
                    },
                }}
            >
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
                <Container maxWidth="lg">
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
};

export default AdminLayout; 