import React, { useState } from 'react';
import { Vote, Linkedin, Twitter, Target, ShieldCheck } from 'lucide-react'; // Added icons
import { FaInstagram } from 'react-icons/fa';
import Card from '../components/Card';
import BackToTopButton from '../components/BackToTopButton';
import FooterAbout from '../components/FooterAbout';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const About = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isIconHovered, setIconHovered] = useState(false);
  const [isTitleHovered, setTitleHovered] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const { t } = useTranslation(); // Initialize the useTranslation hook

  // Fetch team members from translation.json
  const teamMembers = Array.isArray(t('about.team.members', { returnObjects: true }))
    ? t('about.team.members', { returnObjects: true })
    : []; // Fallback to an empty array if data is invalid

  // Debugging: Log teamMembers to ensure data is fetched correctly
  console.log(teamMembers);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 pt-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Vote
            className={`h-16 w-16 mx-auto mb-4 transition-transform transform ${
              isIconHovered ? 'scale-105 text-indigo-600' : 'text-indigo-600'
            }`}
            onMouseEnter={() => setIconHovered(true)}
            onMouseLeave={() => setIconHovered(false)}
          />
          <h1
            className={`text-4xl font-bold mb-4 transition-colors duration-200 ${
              isTitleHovered ? 'text-indigo-600' : 'text-gray-900'
            }`}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
          >
            {t('about.header.title')}
          </h1>
          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto cursor-default"
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
          >
            {t('about.header.description')}
          </p>
        </div>

        {/* Mission Statement */}
        <div
          id="mission-statement"
          className="bg-white p-8 rounded-lg shadow-md mb-12 transition-all duration-300 hover:shadow-lg hover:scale-102 hover:bg-indigo-50"
          onMouseEnter={() => setHoveredSection('mission')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center mb-4">
            <Target
              className={`h-6 w-6 mr-2 transition-transform transform duration-300 ${
                hoveredSection === 'mission' ? 'text-indigo-600 scale-110' : 'text-gray-900'
              }`}
            />
            <h2
              className={`text-2xl font-bold transition-colors duration-300 ${
                hoveredSection === 'mission' ? 'text-indigo-600' : 'text-gray-900'
              }`}
            >
              {t('about.mission.title')}
            </h2>
          </div>
          <p className="text-gray-700">{t('about.mission.description')}</p>
        </div>

        {/* Core Values */}
        <div
          id="core-values"
          className="bg-white p-8 rounded-lg shadow-md mb-12 transition-all duration-300 hover:shadow-lg hover:scale-102 hover:bg-indigo-50"
          onMouseEnter={() => setHoveredSection('values')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center mb-4">
            <ShieldCheck
              className={`h-6 w-6 mr-2 transition-transform transform duration-300 ${
                hoveredSection === 'values' ? 'text-indigo-600 scale-110' : 'text-gray-900'
              }`}
            />
            <h2
              className={`text-2xl font-bold transition-colors duration-300 ${
                hoveredSection === 'values' ? 'text-indigo-600' : 'text-gray-900'
              }`}
            >
              {t('about.values.title')}
            </h2>
          </div>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>{t('about.values.transparency')}</li>
            <li>{t('about.values.security')}</li>
            <li>{t('about.values.inclusivity')}</li>
            <li>{t('about.values.innovation')}</li>
          </ul>
        </div>

        {/* Team Section */}
        <div id="meet-the-team" className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.team.title')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.length > 0 ? (
              teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="p-6 text-center"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Render the image dynamically */}
                  <img
                    src={member.image || `https://via.placeholder.com/150?text=${encodeURIComponent(member.name)}`} // Fallback image
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3
                    className={`text-xl font-semibold transition-colors duration-200 ${
                      hoveredIndex === index ? 'text-indigo-600' : 'text-gray-900'
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-gray-600 mb-4"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {member.role}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a
                      href={member.social?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-red-600 transition-transform transform hover:scale-110"
                    >
                      <FaInstagram className="h-5 w-5" />
                    </a>
                    <a
                      href={member.social?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-indigo-600 transition-transform transform hover:scale-110"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={member.social?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-transform transform hover:scale-110"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-600 text-center">No team members available.</p>
            )}
          </div>
        </div>
      </div>
      <BackToTopButton />
      <FooterAbout />
    </div>
  );
};

export default About;