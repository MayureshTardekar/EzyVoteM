// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import CountUp from 'react-countup';
import { Wallet, UserPlus, Vote, Shield, LineChart, LogInIcon, LogOut } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../components/Footer';
import BackToTopButton from '../components/BackToTopButton';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../components/WalletContext';
import enData from '../locales/en/translation.json';
import hiData from '../locales/hi/translation.json';
import taData from '../locales/ta/translation.json';
import bnData from '../locales/bn/translation.json';
import mrData from '../locales/mr/translation.json';
import guData from '../locales/gu/translation.json';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const localeData = {
  en: enData,
  hi: hiData,
  ta: taData,
  bn: bnData,
  mr: mrData,
  gu: guData,
};

const Home = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const { t, i18n } = useTranslation();
  const { walletAddress, isWalletConnected, connectWallet, disconnectWallet } = useWallet();
const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, i18n]);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

    const handleDisconnectWallet = () => {
    disconnectWallet();
    toast.success('Wallet disconnected successfully!');
  };

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
  
  const features = t('features', { returnObjects: true }) || [];
  const steps = t('howItWorks', { returnObjects: true }) || [];
  const testimonials = t('testimonials', { returnObjects: true }) || [];
  const funFacts = t('funFacts', { returnObjects: true }) || [];
  const statistics = t('statistics', { returnObjects: true }) || [];

  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    draggable: true,
    pauseOnHover: true,
  };

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success('Wallet address copied to clipboard!');
    }
  };

  const truncateWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-indigo-50 via-purple-50 to-white">
      {/* Language Selector */}
      <div className="absolute top-20 left-6 sm:left-12 sm:top-20 z-10 sm:block hidden">
        <LanguageSelector onChange={handleLanguageChange} currentLanguage={currentLanguage} />
      </div>

      <div className="flex justify-end sm:hidden px-4 pt-4">
        <LanguageSelector onChange={handleLanguageChange} currentLanguage={currentLanguage} />
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            {t('hero.welcome')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </motion.div>

        {/* Wallet Section */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          {!isWalletConnected ? (
            <Button onClick={handleConnectWallet} icon={<Wallet />} variant="primary">
              {t('hero.connectWallet')}
            </Button>
          ) : (
 // No display of wallet address or Disconnect button
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              <Button onClick={handleDisconnectWallet} icon={<LogOut />} variant="primary">
                {t('hero.disconnectWallet')}
              </Button>
            </p>
          </div>
          )}
        </div>

        {/* Features Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature: any, index: number) => (
            <Card key={index} className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
                  {index === 0 ? <Vote className="h-8 w-8 text-indigo-600" /> : index === 1 ? <Shield className="h-8 w-8 text-indigo-600" /> : <LineChart className="h-8 w-8 text-indigo-600" />}
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 transition-colors duration-200 ${
                    hoveredFeature === index ? 'text-indigo-600' : 'text-gray-900'
                  }`}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            </Card>
          ))}
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="bg-white-50 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('howItWorksTitle', { defaultValue: 'How It Works' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {steps.map((step: any, index: number) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
                <span className="block w-12 h-12 rounded-full bg-indigo-600 text-white mx-auto text-lg font-bold flex items-center justify-center mb-4">
                  {step.step}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div id='testimonials' className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('testimonialsTitle', { defaultValue: 'What Our Users Say' })}
          </h2>
          <div className="max-w-4xl mx-auto">
            <Slider {...slickSettings}>
              {testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-md text-center">
                  <img src={testimonial.image} alt={testimonial.name} className="w-20 h-20 rounded-full mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">&ldquo;{testimonial.feedback}&rdquo;</p>
                  <h4 className="text-gray-900 font-bold">{testimonial.name}</h4>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Fun Fact Section */}
        <div id='fun-facts' className="bg-indigo-100 py-12">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">
            {t('funFactsTitle', { defaultValue: 'Fun Facts About EzyVote' })}
          </h2>
          <div className="text-center text-lg text-indigo-600 max-w-2xl mx-auto">
            {funFacts.map((fact: string, index: number) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 }}
                className="mb-4"
              >
                {fact}
              </motion.p>
            ))}
          </div>
        </div>
    
        {/* Statistics Section */}
        <div className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {statistics.map((stat: any, index: number) => (
              <div key={index} className="p-6">
                <h3 className="text-5xl font-bold text-indigo-400 mb-2">
                  <CountUp start={0} end={parseInt(stat.value.replace(/[^0-9]/g, '')) || 0} duration={30} />
                </h3>
                <p className="text-3xl font-bold mb-5 text-white">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-white-50 py-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            {t('faq.heading')}
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {t('faq.items', { returnObjects: true }).map((faq: any, index: number) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow hover:shadow-md">
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  className="w-full text-left flex justify-between items-center"
                >
                  <h3 className="text-lg font-semibold text-indigo-600">{faq.question}</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transform transition-transform ${activeFAQ === index ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {activeFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 text-gray-600"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <BackToTopButton />
      <Footer />
    </div>
  );
};

export default Home;