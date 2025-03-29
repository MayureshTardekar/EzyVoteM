import React from 'react';
import { motion } from 'framer-motion';

// Tutorial data with 10 tutorials (some are blogs, some are YouTube videos)
const tutorialsData = [
  {
    id: 1,
    title: 'What is Blockchain? How Elections on Blockchain work?',
    description: 'Blockchain is a secure digital ledger, and blockchain elections use it to securely store votes.',
    duration: '5 min read',
    thumbnail: '',
    type: 'video', // Indicates this is a blog
    link: 'https://youtu.be/ENrjn-lD1e8?si=fbjV7eR4Ezp1zge9', // Link to the YouTube video
  },
  {
    id: 2,
    title: 'Could We Use Blockchain For Voting',
    description: 'Blockchain can securely record votes, ensuring transparency and preventing tampering.',
    duration: '8 min read',
    thumbnail: '', // Leave this empty for YouTube videos
    type: 'video', // Indicates this is a YouTube video
    link: 'https://youtu.be/G60DzaQy3a4?si=xXcSkZau0a1XbaJi', // Link to the blog page
  },
  {
    id: 3,
    title: 'Bringing Voting Systems into the Digital Age with Blockchain',
    description: 'Blockchain can modernize voting systems by offering secure, transparent, and tamper-proof digital voting.',
    duration: '12 min read',
    thumbnail: '', // Leave this empty for YouTube videos
    type: 'video', // Indicates this is a YouTube video
    link: 'https://youtu.be/EKzZOZUAbfg?si=g_b2YzlMI-HkkSNz', // Link to the YouTube video
  },
  // Add other tutorials here...
  // Ensure the total number of tutorials does not exceed 10
];

// Function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  // Handle full YouTube URLs (https://www.youtube.com/watch?v=VIDEO_ID)
  if (url.includes('v=')) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  }
  // Handle shortened YouTube URLs (https://youtu.be/VIDEO_ID)
  else if (url.includes('youtu.be')) {
    const match = url.match(/youtu.be\/([^&]+)/);
    return match ? match[1] : null;
  }
  // Handle embedded YouTube URLs (https://www.youtube.com/embed/VIDEO_ID)
  else if (url.includes('embed')) {
    const match = url.match(/embed\/([^&]+)/);
    return match ? match[1] : null;
  }
  return null;
};

// Function to get YouTube embed URL
const getYouTubeEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}`;
};

// Tutorial Card Component
const TutorialCard = ({ tutorial }) => {
  const isVideo = tutorial.type === 'video';
  const videoId = isVideo ? getYouTubeVideoId(tutorial.link) : null;
  const embedUrl = isVideo ? getYouTubeEmbedUrl(videoId) : null;

  const handleClick = () => {
    if (tutorial.type === 'blog') {
      // Navigate to the blog page
      window.location.href = tutorial.link;
    } else if (tutorial.type === 'video') {
      // Open the YouTube video in a new tab
      window.open(tutorial.link, '_blank');
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      whileHover={{ scale: 1.03 }}
      onClick={handleClick} // Make the card clickable
    >
      {isVideo ? (
        // Embed YouTube video
        <iframe
          src={embedUrl}
          title={tutorial.title}
          className="w-full h-48 sm:h-56 md:h-48 lg:h-56"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        // Show thumbnail for blogs
        <img
          src={tutorial.thumbnail}
          alt={tutorial.title}
          className="w-full h-48 sm:h-56 md:h-48 lg:h-56 object-cover"
          onError={(e) => {
            // Fallback to a default thumbnail if the image fails to load
            e.target.src = 'https://via.placeholder.com/300x200'; // Replace with a fallback image URL
          }}
        />
      )}
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{tutorial.title}</h3>
        <p className="text-sm sm:text-base text-gray-600 mt-2">{tutorial.description}</p>
        <p className="mt-2 sm:mt-4 text-xs sm:text-sm text-blue-500">{tutorial.duration}</p>
      </div>
    </motion.div>
  );
};

// Tutorials Component
const Tutorials = () => {
  // Limit the number of tutorials to 10
  const limitedTutorialsData = tutorialsData.slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-[-25px]">
      {/* Header */}
      <div className="bg-gradient-to-l from-indigo-600 to-purple-600 text-white py-8 sm:py-12 px-4 text-center">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tutorials
        </motion.h1>
        <motion.p
          className="mt-2 text-base sm:text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Explore guides and resources to make the most out of EzyVote.
        </motion.p>
      </div>

      {/* Tutorials Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {limitedTutorialsData.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </div>
    </div>
  );
};

export default Tutorials;