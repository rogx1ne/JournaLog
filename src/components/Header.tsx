import React from 'react';
import { Settings } from 'lucide-react';

interface HeaderProps {
  theme: string;
  onOpenSettings: () => void; 
}

const Header: React.FC<HeaderProps> = ({ theme, onOpenSettings }) => {
  return (
    <header className="app-header">
      <div className="logo">
        Journa<span className={theme === 'light' ? 'logo-log-light' : 'logo-log-dark'}>LOG</span>
      </div>
      <button 
        className="settings-btn" 
        onClick={onOpenSettings} 
        aria-label="Open Settings"
      >
        <Settings size={24} />
      </button>

    </header>
  );
};

export default Header;