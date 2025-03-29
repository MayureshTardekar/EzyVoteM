import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const FooterAbout = () => {
  const handleScroll = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About EzyVote</h4>
            <p className="text-sm text-gray-200">
              EzyVote is a decentralized voting platform designed for secure and transparent elections. Powered by blockchain technology, it ensures integrity and ease of use.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Navigates</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleScroll('mission-statement')} className="text-gray-200 hover:text-white">
                  Mission Statement
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('core-values')} className="text-gray-200 hover:text-white">
                  Our Core Values
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('meet-the-team')} className="text-gray-200 hover:text-white">
                  Meet the Team
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-gray-200 hover:text-white transition-transform transform hover:scale-110" />
              </a> */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-gray-200 hover:text-green-900 transition-transform transform hover:scale-110" />
              </a>
              <a href="https://www.instagram.com/ezyvote" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-gray-200 hover:text-red-600 transition-transform transform hover:scale-110" />
              </a>
              {/* <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 text-gray-200 hover:text-blue-600 transition-transform transform hover:scale-110" />
              </a> */}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-gray-400 pt-4 text-center text-sm text-gray-200">
          &copy; {new Date().getFullYear()} EzyVote. All rights reserved by Rakesh Mal.
        </div>
      </div>
    </footer>
  );
};

export default FooterAbout;
