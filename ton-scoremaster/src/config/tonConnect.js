import { TonConnectUIProvider } from '@tonconnect/ui-react';

// Use local manifest file during development
const manifestUrl = process.env.NODE_ENV === 'development' 
    ? '/tonconnect-manifest.json'
    : 'https://ton-scoremaster.vercel.app/tonconnect-manifest.json';

// Create the TON Connect provider component
export const TonConnectProvider = ({ children }) => {
    return (
        <TonConnectUIProvider manifestUrl={manifestUrl}>
            {children}
        </TonConnectUIProvider>
    );
}; 