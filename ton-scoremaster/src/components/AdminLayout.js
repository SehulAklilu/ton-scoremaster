import React from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    SportsSoccer as SportsIcon,
    AccountBalance as BalanceIcon,
    History as HistoryIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Rooms', icon: <SportsIcon />, path: '/admin/rooms' },
        { text: 'Commission', icon: <BalanceIcon />, path: '/admin/commission' },
        { text: 'Transactions', icon: <HistoryIcon />, path: '/admin/transactions' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: 1300 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        TON ScoreMaster Admin
                    </Typography>
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
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    marginTop: '64px',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default AdminLayout; 