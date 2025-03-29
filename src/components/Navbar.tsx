import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Vote, Home, Info, Mail, Shield, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavUnderline from './NavUnderline';
import { toast } from 'react-toastify';
import { useWallet } from './WalletContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { walletAddress, isWalletConnected, connectWallet, disconnectWallet } = useWallet();

  const navItems = [
    { path: '/', icon: <Home className="h-4 w-4" />, label: 'Home' },
    { path: '/about', icon: <Info className="h-4 w-4" />, label: 'About Us' },
    { path: '/contact', icon: <Mail className="h-4 w-4" />, label: 'Contact' },
    { path: '/privacy', icon: <Shield className="h-4 w-4" />, label: 'Privacy Policy' },
  ];

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY < 50 || window.scrollY < window.prevScrollY);
    window.prevScrollY = window.scrollY;
  }, []);

  useEffect(() => {
    window.prevScrollY = window.scrollY;
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleConnectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        toast.error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
        return;
      }

      // Request wallet connection from MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts && accounts.length > 0) {
        // Successfully connected wallet
        connectWallet(); // Call your connectWallet function to update state
        toast.success('Wallet connected successfully!');
      } else {
        // No accounts returned
        toast.error('Wallet connection failed. Please try again.');
      }
    } catch (error) {
      // If there's an error in connecting
      toast.error('Could not connect to MetaMask.');
      console.error('Error connecting MetaMask:', error);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    toast.info('Wallet disconnected successfully!');
  };

  return (
    <nav
      className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg fixed w-full z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <Vote className="h-8 w-8 transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-bold text-xl group-hover:text-purple-200 transition-colors">
                EzyVote
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 hover:text-purple-200 transition-colors relative group py-1 ${
                    location.pathname === item.path ? 'text-purple-200' : ''
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <AnimatePresence>{location.pathname === item.path && <NavUnderline />}</AnimatePresence>
                </Link>
              </motion.div>
            ))}
            <button
              onClick={isWalletConnected ? handleDisconnectWallet : handleConnectWallet}
              className="flex items-center space-x-1 hover:text-purple-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>{isWalletConnected ? 'Disconnect' : 'Connect Wallet'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className={`md:hidden overflow-hidden bg-indigo-700`}
      >
        <div className="px-4 py-2 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-600 transition-colors ${
                location.pathname === item.path ? 'bg-indigo-600' : ''
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => {
              isWalletConnected ? handleDisconnectWallet() : handleConnectWallet();
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-600 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>{isWalletConnected ? 'Disconnect' : 'Connect Wallet'}</span>
          </button>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;