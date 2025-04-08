import React from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Button, Box, Typography } from '@mui/material';

const WalletConnect = () => {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();

    const handleConnect = () => {
        tonConnectUI.connectWallet();
    };

    const handleDisconnect = () => {
        tonConnectUI.disconnect();
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {wallet ? (
                <>
                    <Typography variant="body2">
                        Connected: {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-4)}
                    </Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDisconnect}
                    >
                        Disconnect
                    </Button>
                </>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConnect}
                >
                    Connect Wallet
                </Button>
            )}
        </Box>
    );
};

export default WalletConnect; 