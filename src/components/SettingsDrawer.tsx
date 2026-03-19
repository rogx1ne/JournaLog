import React from 'react';
import { X, Moon, Sun, Download, Upload } from 'lucide-react'; 
import { motion } from 'framer-motion';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void; 
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  onClose,
  isDarkMode,
  toggleTheme,
  onExport,
  onImport,
}) => {
  return (
    <>
      <motion.div 
        className="settings-drawer-overlay open"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div 
        className="settings-drawer open"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="settings-drawer-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="settings-drawer-close-btn" aria-label="Close settings">
            <X size={24} />
          </button>
        </div>

        <section className="settings-drawer-section">
          <h3>Appearance</h3>
          <button 
            onClick={toggleTheme}
            className="settings-drawer-btn settings-theme-btn"
          >
            <span>Theme</span>
            <span className="theme-icon">
              {isDarkMode ? <Moon size={18} className="moon-icon"/> : <Sun size={18} className="sun-icon"/>}
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          </button>
        </section>

        <section className="settings-drawer-section">
          <h3>Data</h3>
          <div className="settings-drawer-btn-group">
            <button 
              onClick={onExport}
              className="settings-drawer-btn"
            >
              <Download size={18} />
              <span>Export Journal (JSON)</span>
            </button>

            <label className="settings-drawer-btn">
              <Upload size={18} />
              <span>Import Backup</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={onImport} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
        </section>

        <div className="settings-drawer-footer">
          JournaLog v1.0.0
        </div>
      </motion.div>
    </>
  );
};

export default SettingsDrawer;
