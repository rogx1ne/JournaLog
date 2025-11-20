import React from 'react';
import { X, Moon, Sun, Download, Upload } from 'lucide-react'; 

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onExport: () => void;
  onImport: () => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  toggleTheme,
  onExport,
  onImport,
}) => {
  return (
    <>
      <div 
        className={`settings-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      
      <div className={`settings-drawer ${isOpen ? 'open' : ''}`}>
        
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
              <Upload size={18} />
              <span>Export Journal (JSON)</span>
            </button>

            <button 
              onClick={onImport}
              className="settings-drawer-btn"
            >
              <Download size={18} />
              <span>Import Backup</span>
            </button>
          </div>
        </section>
        <div className="settings-drawer-footer">
          Journal App v1.0
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;