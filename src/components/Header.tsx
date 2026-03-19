import React from 'react';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  theme: string;
  onOpenSettings: () => void; 
}

const Header: React.FC<HeaderProps> = ({ theme, onOpenSettings }) => {
  return (
    <motion.header 
      className="app-header glass"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="logo"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Journa<span className={theme === 'light' ? 'logo-log-light' : 'logo-log-dark'}>LOG</span>
      </motion.div>
      <motion.button 
        className="settings-btn" 
        onClick={onOpenSettings} 
        aria-label="Open Settings"
        whileHover={{ rotate: 90 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Settings size={22} />
      </motion.button>
    </motion.header>
  );
};

export default Header;