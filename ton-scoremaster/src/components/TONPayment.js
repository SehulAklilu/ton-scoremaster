import React, { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const TONPayment = ({ amount, description, onSuccess, onError }) => {
    const [tonConnectUI] = useTonConnectUI();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);

            // Create the transaction
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
                messages: [
                    {
                        address: process.env.REACT_APP_CONTRACT_ADDRESS, // Your contract address
                        amount: (amount * 1000000000).toString(), // Convert to nanotons
                        payload: description
                    }
                ]
            };

            // Send the transaction
            const result = await tonConnectUI.sendTransaction(transaction);

            // Verify the transaction
            const response = await axios.post('/api/payments/verify', {
                transactionHash: result.boc,
                amount: amount
            });

            if (response.data.success) {
                onSuccess(result.boc);
            } else {
                throw new Error('Transaction verification failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            onError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Typography variant="h6">
                Pay {amount} TON
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handlePayment}
                disabled={loading}
                sx={{ minWidth: 200 }}
            >
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    'Pay with TON'
                )}
            </Button>
        </Box>
    );
};

export default TONPayment; 