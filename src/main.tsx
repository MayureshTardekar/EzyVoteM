// src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WalletProvider } from './components/WalletContext'; // Import WalletProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider> {/* Wrap your app with the WalletProvider */}
      <App />
    </WalletProvider>
  </StrictMode>
);
