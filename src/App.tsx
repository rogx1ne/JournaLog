import { useState, useEffect } from 'react';
import type { JournalEntry } from './types';
import EntryList from './components/EntryList';
import EntryModal from './components/EntryModal';
import Header from './components/Header';
import NewEntryModal from './components/NewEntryModal'; 
import TypingAnimation from './components/TypingAnimation';

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

  return (
    <div className="App">
      <Header theme={theme} onToggle={toggleTheme} />
      
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