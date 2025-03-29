import React from 'react';
import { motion } from 'framer-motion';

const NavUnderline = () => {
  return (
    <motion.div
      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-200 origin-left"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0 }}
      transition={{ duration: 0.2 }}
    />
  );
};

export default NavUnderline;