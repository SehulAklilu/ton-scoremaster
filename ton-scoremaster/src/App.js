// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TonConnectProvider } from './config/tonConnect';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import Room from './pages/Room';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminMatches from './pages/admin/Matches';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function App() {
    return (
        <TonConnectProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Routes>
                        {/* Public routes with Layout */}
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="create-room" element={<CreateRoom />} />
                            <Route path="room/:id" element={<Room />} />
                            <Route path="terms" element={<Terms />} />
                            <Route path="privacy" element={<Privacy />} />
                        </Route>

                        {/* Admin routes */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="matches" element={<AdminMatches />} />
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </TonConnectProvider>
    );
}

export default App;
