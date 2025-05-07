import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface WalletContextType {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if wallet was previously connected
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            // Check if it's an admin wallet
            const isAdmin = await checkIfAdmin(accounts[0]);
            navigate(isAdmin ? '/admin-dashboard' : '/user-dashboard');
          }
        } catch (error) {
          console.error("Error checking wallet:", error);
        }
      }
    };
    checkWallet();
  }, []);

  const checkIfAdmin = async (address: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
      });
      const data = await response.json();
      return data.isAdmin;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask to use this feature');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);
      
      // Check if the connected wallet is an admin
      const isAdmin = await checkIfAdmin(address);
      
      // Navigate based on role
      if (isAdmin) {
        navigate('/admin-dashboard');
        toast.success('Welcome Admin!');
      } else {
        navigate('/user-dashboard');
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    navigate('/');
    toast.info('Wallet disconnected');
  };

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
