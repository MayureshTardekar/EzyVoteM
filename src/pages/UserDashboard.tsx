import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Clock, Vote, Activity, BookOpen } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import BackToTopButton from '../components/BackToTopButton';

const Dashboard = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const userFeatures = [
    {
      title: 'Upcoming Elections',
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      description: 'View and participate in upcoming voting events.',
      onClick: () => navigate('/upcoming-elections'),
    },
    {
      title: 'Securely Voting',
      icon: <Vote className="h-8 w-8 text-indigo-600" />,
      description: 'Cast your vote in securely active elections.',
      onClick: () => navigate('/securely-voting'),
    },
    {
      title: 'Voting History',
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      description: 'View your past voting activities and results.',
      onClick: () => navigate('/voting-history'),
    },
    {
      title: 'Live Results',
      icon: <Activity className="h-8 w-8 text-indigo-600" />,
      description: 'Monitor real-time voting results and analytics.',
      onClick: () => navigate('/live-results'),
    },
  ];

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);
    } catch (error) {
      alert('Could not connect to MetaMask. Please try again.');
    }
  };

  return (
    <div
      className={`flex-1 transition-all duration-300 mt-[-50px] ${
        isSidebarOpen ? 'ml-1' : 'ml-0'
      } p-6`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 text-center  mb-8">
        <h1 className="text-4xl font-bold">User Dashboard</h1>
        <p className="mt-2 text-lg">Participate in elections and manage your voting activities.</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userFeatures.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Button onClick={feature.onClick} variant="primary" className="w-full">
                {feature.title}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Wallet Connection Status */}
      {isWalletConnected && (
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Connected wallet: <strong>{walletAddress}</strong>
          </p>
        </div>
      )}
      <BackToTopButton />
    </div>
  );
};

export default Dashboard;