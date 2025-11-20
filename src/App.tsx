import { useState, useEffect, useRef } from 'react'; 
import type { JournalEntry } from './types';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';
import EntryModal from './components/EntryModal';
import Header from './components/Header';
import NewEntryModal from './components/NewEntryModal';
import TypingAnimation from './components/TypingAnimation';
import SettingsDrawer from './components/SettingsDrawer';

const initializeTheme = (): string => {
  const savedTheme = localStorage.getItem("journalTheme");
  const theme = savedTheme ? savedTheme : 'light';
  document.body.className = theme + '-theme';
  return theme;
};

function App() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [theme, setTheme] = useState(initializeTheme);
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("journalTheme", theme);
    document.body.className = theme + '-theme';
  }, [theme]);

  const handleAddEntry = (text: string) => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      text: text,
    };
    setEntries([newEntry, ...entries]);
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleExport = () => {
    const fileData = JSON.stringify(entries, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        try {
          const parsedEntries = JSON.parse(result);
          if (Array.isArray(parsedEntries)) {
            if (window.confirm("This will OVERWRITE your current entries. Are you sure?")) {
              setEntries(parsedEntries);
              setIsSettingsOpen(false);
            }
          } else {
            alert("Invalid file format.");
          }
        } catch (err) {
          console.error("Failed to parse file", err);
          alert("Error reading file.");
        }
      }
    };
    reader.readAsText(file);
    event.target.value = ''; 
  };

  return (
    <div className="App">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <input 
        type="file" 
        accept=".json" 
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} 
      />

      <SettingsDrawer 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={theme === 'dark'}
        toggleTheme={toggleTheme}
        onExport={handleExport}
        onImport={triggerImport} 
      />

      <div className="home-container">
        <div 
          className="form-box clickable-animation-box" 
          onClick={() => setIsNewEntryModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Write new entry"
        >
          <TypingAnimation />
        </div>
        <div className="list-box">
          <EntryList entries={entries} onViewEntry={setSelectedEntry}/>
        </div>
      </div>

      {selectedEntry && (
        <EntryModal 
          entry={selectedEntry} 
          onClose={() => setSelectedEntry(null)} 
          onDelete={handleDeleteEntry}
        />
      )}
      
      {isNewEntryModalOpen && (
        <NewEntryModal
          onClose={() => setIsNewEntryModalOpen(false)}
          onAddEntry={handleAddEntry}
        />
      )}
    </div>
  );
}

export default App;