import { Plus, Settings } from 'lucide-react';

interface HeaderProps {
  theme: string;
  onNewEntry: () => void;
  onOpenSettings: () => void;
}

function Header({ theme, onNewEntry, onOpenSettings }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="logo">
          Journa<span className={theme === 'light' ? 'logo-log-light' : 'logo-log-dark'}>Log</span>
        </div>
        <div className="header-actions">
          <button className="new-entry-btn" onClick={onNewEntry} aria-label="Create new entry">
            <Plus size={16} />
            <span>New Entry</span>
          </button>
          <button className="icon-btn settings-btn" onClick={onOpenSettings} aria-label="Open settings">
            <Settings size={18} />
            <span className="settings-btn-label">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
