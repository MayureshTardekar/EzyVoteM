import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import TermsAndConditionsPopup from './TermsAndConditionsPopup'; // Import the popup component

interface WalletContextType {
  walletAddress: string | null;
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  userRole: 'user' | 'admin' | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false); // State for modal visibility

  // Check for cached wallet connection on initial load
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    const savedRole = localStorage.getItem('userRole') as 'user' | 'admin' | null;
    if (savedAddress && savedRole) {
      setWalletAddress(savedAddress);
      setIsWalletConnected(true);
      setUserRole(savedRole);
    }
  }, []);

  // Periodically check if the wallet is still connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length === 0 && isWalletConnected) {
            // Wallet disconnected, trigger logout
            await disconnectWallet();
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    const interval = setInterval(checkWalletConnection, 3000); // Check every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isWalletConnected]);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      return;
    }
    try {
      // Request account access via MetaMask popup
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const normalizedWallet = accounts[0].toLowerCase();
        // Request signature from the user
        const message = 'Please sign this message to verify your identity.';
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, normalizedWallet],
        });
        console.log('Signature:', signature);

        // Send wallet address and signature to backend for verification
        const response = await fetch('http://localhost:5000/api/wallet-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: normalizedWallet, signature }),
        });

        const data = await response.json();
        if (response.ok) {
          setWalletAddress(normalizedWallet);
          setIsWalletConnected(true);
          setUserRole(data.role);
          localStorage.setItem('walletAddress', normalizedWallet);
          localStorage.setItem('userRole', data.role);

          // Show terms and conditions modal
          setShowTermsModal(true);
        } else {
          throw new Error(data.message || 'Failed to authenticate wallet');
        }
      } else {
        toast.error('No account found. Please try again.');
      }
    } catch (error) {
      toast.error('Could not connect to MetaMask.');
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (walletAddress) {
        const response = await fetch('http://localhost:5000/api/wallet-disconnect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress }),
        });
        if (response.ok) {
          setWalletAddress(null);
          setIsWalletConnected(false);
          setUserRole(null);
          localStorage.removeItem('walletAddress');
          localStorage.removeItem('userRole');

          // Forcefully disconnect the wallet in MetaMask
          if (typeof window.ethereum !== 'undefined' && window.ethereum?.request) {
            await window.ethereum.request({
              method: 'wallet_revokePermissions',
              params: [{ eth_accounts: {} }],
            });
          }

          toast.success('Wallet disconnected successfully!');
          // Redirect to home page after disconnecting
          window.location.href = '/';
        } else {
          throw new Error('Failed to disconnect wallet.');
        }
      }
    } catch (error) {
      toast.error('An error occurred while disconnecting the wallet.');
      console.error('Error disconnecting wallet:', error);
    }
  };

  const handleTermsAccept = () => {
    setShowTermsModal(false); // Close the modal
    // Redirect based on role
    if (userRole === 'admin') {
      window.location.href = '/admin-dashboard';
    } else {
      window.location.href = '/user-dashboard';
    }
  };

  const handleTermsCancel = () => {
    setShowTermsModal(false); // Close the modal
    disconnectWallet(); // Disconnect the wallet
  };

  return (
    <WalletContext.Provider
      value={{ walletAddress, isWalletConnected, connectWallet, disconnectWallet, userRole }}
    >
      {children}
      {/* Render the Terms and Conditions Popup */}
      <TermsAndConditionsPopup
        isOpen={showTermsModal}
        onAccept={handleTermsAccept}
        onCancel={handleTermsCancel}
      />
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};