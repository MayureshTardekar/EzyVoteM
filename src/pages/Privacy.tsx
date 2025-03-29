import React, { useState } from 'react';
import { Shield, Lock, Eye, Database, ThumbsUp, Mail } from 'lucide-react'; // Import icons for Your Rights and Contact Us
import BackToTopButton from '../components/BackToTopButton';
import FooterPrivacyPolicy from '../components/FooterPrivacyPolicy';

const Privacy = () => {
  // State to track whether a section is hovered
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isTitleHovered, setIsTitleHovered] = useState(false); // Hover state for "Privacy Policy" title

  const sections = [
    {
      title: 'Data Security',
      icon: <Lock className="h-6 w-6 mr-2" />,
      content: (
        <p className="text-gray-600 leading-relaxed mb-4">
          At EzyVote, we take the security of your data seriously. All voting data is stored on 
          the blockchain, ensuring transparency and immutability. Personal information is 
          encrypted and stored securely following industry best practices.
        </p>
      ),
    },
    {
      title: 'Information We Collect',
      icon: <Eye className="h-6 w-6 mr-2" />,
      content: (
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Email address (for authentication)</li>
          <li>Wallet address (for blockchain transactions)</li>
          <li>Voting preferences and history</li>
          <li>Device information for security purposes</li>
        </ul>
      ),
    },
    {
      title: 'How We Use Your Information',
      icon: <Database className="h-6 w-6 mr-2" />,
      content: (
        <>
          <p className="text-gray-600 leading-relaxed mb-4">
            Your information is used solely for:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Facilitating secure voting processes</li>
            <li>Authenticating your identity</li>
            <li>Sending important notifications about votes</li>
            <li>Improving our platform's functionality</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Your Rights',
      icon: <ThumbsUp className="h-6 w-6 mr-2" />,
      content: (
        <>
          <p className="text-gray-600 leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Access your personal data</li>
            <li>Request data correction</li>
            <li>Delete your account</li>
            <li>Export your voting history</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Contact Us',
      icon: <Mail className="h-6 w-6 mr-2" />,
      content: (
        <p className="text-gray-600 leading-relaxed">
          If you have any questions about our privacy policy, please contact us at{' '}
          <a href="mailto:malrakesh172@gmail.com" className="text-indigo-600 hover:text-indigo-500">
            malrakesh172@gmail.com
          </a>
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-indigo-50 via-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-indigo-600 mx-auto mb-4 transition-transform transform hover:scale-110" />
            <h1
              className={`text-4xl font-bold mb-4 transition-colors duration-200 ${
                isTitleHovered ? 'text-indigo-600' : 'text-gray-900'
              }`}
              onMouseEnter={() => setIsTitleHovered(true)} // On mouse enter
              onMouseLeave={() => setIsTitleHovered(false)} // On mouse leave
            >
              Privacy Policy
            </h1>
            <p
              className="text-gray-600"
              onMouseEnter={() => setIsTitleHovered(true)} // On mouse enter of "Last updated"
              onMouseLeave={() => setIsTitleHovered(false)} // On mouse leave of "Last updated"
            >
              {/* Last updated: {new Date().toLocaleDateString('en-IN')}  // English-India */}
              {/* 'en-GM' - English- Great Britain */}
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>

          <div id="privacy-policy" className="space-y-8">
            {sections.map((section, index) => (
              <section
                key={index} 
                onMouseEnter={() => setHoveredSection(index)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <h2
                  className={`text-2xl font-bold mb-4 flex items-center transition-colors duration-200 ${
                    hoveredSection === index ? 'text-indigo-600' : 'text-gray-900'
                  }`}
                >
                  {React.cloneElement(section.icon, {
                    className: `h-6 w-6 mr-2 text-indigo-600 transition-transform transform ${
                      hoveredSection === index ? 'scale-110' : ''
                    }`
                  })}
                  {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </div>
        </div>
      </div>
      <BackToTopButton />
      <FooterPrivacyPolicy />
    </div>
  );
};

export default Privacy;
