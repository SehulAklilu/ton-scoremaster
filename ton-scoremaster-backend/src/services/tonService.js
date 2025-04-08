const { TonClient, WalletContractV4, internal } = require('@ton/ton');
const { mnemonicToWalletKey } = require('@ton/crypto');
const dotenv = require('dotenv');

dotenv.config();

const initTON = async () => {
    try {
        // Initialize TON client
        const client = new TonClient({
            endpoint: process.env.TON_ENDPOINT || 'https://toncenter.com/api/v2/jsonRPC',
            apiKey: process.env.TON_API_KEY
        });

        // Load wallet mnemonic from environment variables
        const mnemonic = process.env.WALLET_MNEMONIC?.split(' ');
        if (!mnemonic || mnemonic.length !== 24) {
            throw new Error('Invalid wallet mnemonic');
        }

        // Create wallet from mnemonic
        const keyPair = await mnemonicToWalletKey(mnemonic);
        const wallet = WalletContractV4.create({ 
            publicKey: keyPair.publicKey,
            workchain: 0 
        });

        console.log('✅ TON initialized successfully');
        console.log('Wallet address:', wallet.address.toString());

        return {
            client,
            wallet,
            keyPair
        };
    } catch (error) {
        console.error('Error initializing TON:', error);
        throw error;
    }
};

// Function to send TON
const sendTON = async (toAddress, amount) => {
    try {
        const { client, wallet, keyPair } = await initTON();
        
        // Create transfer message
        const transfer = internal({
            to: toAddress,
            value: amount.toString(),
            bounce: false
        });

        // Send transaction
        const seqno = await client.getSeqno(wallet.address);
        const transferMessage = wallet.createTransferMessage({
            seqno,
            secretKey: keyPair.secretKey,
            messages: [transfer]
        });

        await client.sendMessage(transferMessage);
        console.log('TON sent successfully');
    } catch (error) {
        console.error('Error sending TON:', error);
        throw error;
    }
};

// Function to verify transaction
const verifyTransaction = async (transactionHash) => {
    try {
        const { client } = await initTON();
        
        // Get transaction details
        const transaction = await client.getTransaction(transactionHash);
        
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        return {
            success: true,
            transaction
        };
    } catch (error) {
        console.error('Error verifying transaction:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    initTON,
    sendTON,
    verifyTransaction
}; 