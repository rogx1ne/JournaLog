import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import type { JournalEntry } from './types';
import { db } from './db';

import EntryList from './components/EntryList';
import EntryModal from './components/EntryModal';
import Header from './components/Header';
import NewEntryModal from './components/NewEntryModal';
import TypingAnimation from './components/TypingAnimation';
import SettingsDrawer from './components/SettingsDrawer';

type ImportMode = 'replace' | 'append';
type DateFilter = 'all' | '7d' | '30d' | '365d';

const initializeTheme = (): string => {
  const savedTheme = localStorage.getItem('journalTheme');
  const theme = savedTheme ? savedTheme : 'light';
  document.body.className = `${theme}-theme`;
  return theme;
};

const NEW_ENTRY_DRAFT_KEY = 'journalDraft:new-entry';
const DELETE_UNDO_TIMEOUT_MS = 10000;

const isValidJournalEntry = (value: unknown): value is JournalEntry => {
  if (!value || typeof value !== 'object') return false;

  const maybeEntry = value as JournalEntry;
  if (
    typeof maybeEntry.id !== 'string' ||
    typeof maybeEntry.date !== 'string' ||
    typeof maybeEntry.text !== 'string'
  ) {
    return false;
  }

  return !Number.isNaN(new Date(maybeEntry.date).getTime());
};

const getCutoffTime = (filter: DateFilter): number | null => {
  const now = Date.now();

  switch (filter) {
    case '7d':
      return now - 7 * 24 * 60 * 60 * 1000;
    case '30d':
      return now - 30 * 24 * 60 * 60 * 1000;
    case '365d':
      return now - 365 * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
};

const sanitizeImportedEntries = (rawEntries: unknown[]) => {
  const seenIds = new Set<string>();
  const validEntries: JournalEntry[] = [];
  let invalidCount = 0;
  let duplicateCount = 0;

  for (const rawEntry of rawEntries) {
    if (!isValidJournalEntry(rawEntry)) {
      invalidCount += 1;
      continue;
    }

    if (seenIds.has(rawEntry.id)) {
      duplicateCount += 1;
      continue;
    }

    seenIds.add(rawEntry.id);
    validEntries.push({
      id: rawEntry.id,
      date: rawEntry.date,
      text: rawEntry.text,
    });
  }

  return { validEntries, invalidCount, duplicateCount };
};

function App() {
  const entries = useLiveQuery(() => db.entries.toArray()) || [];
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [recentlyDeletedEntry, setRecentlyDeletedEntry] = useState<JournalEntry | null>(null);
  const [theme, setTheme] = useState(initializeTheme);
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>('replace');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const undoDeleteTimeoutRef = useRef<number | null>(null);

  const clearUndoDeleteTimeout = () => {
    if (undoDeleteTimeoutRef.current) {
      window.clearTimeout(undoDeleteTimeoutRef.current);
      undoDeleteTimeoutRef.current = null;
    }
  };

  // Migration from localStorage
  useEffect(() => {
    const migrateData = async () => {
      const savedEntries = localStorage.getItem('journalEntries');
      if (savedEntries) {
        try {
          const parsedEntries = JSON.parse(savedEntries);
          if (Array.isArray(parsedEntries)) {
            const validEntries = parsedEntries.filter(isValidJournalEntry);
            if (validEntries.length > 0) {
              const count = await db.entries.count();
              if (count === 0) {
                await db.entries.bulkAdd(validEntries);
                console.log(`Migrated ${validEntries.length} entries to IndexedDB.`);
              }
            }
          }
          // After migration, we could remove it, but let's keep it for safety for now
          // localStorage.removeItem('journalEntries');
        } catch (err) {
          console.error('Failed to migrate data:', err);
        }
      }
    };
    migrateData();
  }, []);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const cutoffTime = getCutoffTime(dateFilter);

    return sortedEntries.filter((entry) => {
      const entryDate = new Date(entry.date).getTime();
      if (cutoffTime !== null && entryDate < cutoffTime) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return entry.text.toLowerCase().includes(normalizedQuery);
    });
  }, [dateFilter, sortedEntries, searchQuery]);

  const isFilterApplied = searchQuery.trim().length > 0 || dateFilter !== 'all';

  useEffect(() => {
    localStorage.setItem('journalTheme', theme);
    document.body.className = `${theme}-theme`;
  }, [theme]);

  useEffect(() => {
    return () => clearUndoDeleteTimeout();
  }, []);

  const handleAddEntry = async (text: string, drawing?: string) => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      text,
      drawing,
    };
    await db.entries.add(newEntry);
  };

  const handleUpdateEntry = async (id: string, text: string, drawing?: string) => {
    await db.entries.update(id, { text, drawing });
    setEditingEntry(null);
  };

  const handleDeleteEntry = async (id: string) => {
    const deletedEntry = await db.entries.get(id);
    if (!deletedEntry) return;

    await db.entries.delete(id);

    clearUndoDeleteTimeout();
    setRecentlyDeletedEntry(deletedEntry);
    undoDeleteTimeoutRef.current = window.setTimeout(() => {
      setRecentlyDeletedEntry(null);
      undoDeleteTimeoutRef.current = null;
    }, DELETE_UNDO_TIMEOUT_MS);
  };

  const handleUndoDelete = async () => {
    if (!recentlyDeletedEntry) return;

    await db.entries.add(recentlyDeletedEntry);
    setRecentlyDeletedEntry(null);
    clearUndoDeleteTimeout();
  };

  const handleStartNewEntry = () => {
    setEditingEntry(null);
    setIsNewEntryModalOpen(true);
  };

  const handleStartEditEntry = (entry: JournalEntry) => {
    setIsNewEntryModalOpen(false);
    setSelectedEntry(null);
    setEditingEntry(entry);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleExport = async () => {
    const allEntries = await db.entries.toArray();
    const fileData = JSON.stringify(allEntries, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 2000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result !== 'string') return;

      try {
        const parsedEntries = JSON.parse(result);
        if (!Array.isArray(parsedEntries)) {
          alert('Invalid file format: expected a JSON array of entries.');
          return;
        }

        const { validEntries, invalidCount, duplicateCount } = sanitizeImportedEntries(parsedEntries);
        let importedCount = 0;
        let totalDuplicateCount = duplicateCount;

        if (importMode === 'replace') {
          if (!window.confirm('This will overwrite your current entries. Continue?')) {
            return;
          }

          await db.entries.clear();
          await db.entries.bulkAdd(validEntries);
          setSelectedEntry(null);
          setEditingEntry(null);
          setRecentlyDeletedEntry(null);
          clearUndoDeleteTimeout();
          importedCount = validEntries.length;
        } else {
          const existingIds = new Set((await db.entries.toArray()).map((entry) => entry.id));
          const appendableEntries = validEntries.filter((entry) => !existingIds.has(entry.id));
          const duplicateWithExistingCount = validEntries.length - appendableEntries.length;
          totalDuplicateCount += duplicateWithExistingCount;
          importedCount = appendableEntries.length;

          if (appendableEntries.length > 0) {
            await db.entries.bulkAdd(appendableEntries);
          }
        }

        alert(
          [
            `Import complete (${importMode}).`,
            `Imported: ${importedCount}`,
            `Skipped invalid: ${invalidCount}`,
            `Skipped duplicate IDs: ${totalDuplicateCount}`,
          ].join('\n'),
        );

        setIsSettingsOpen(false);
      } catch (err) {
        console.error('Failed to parse file', err);
        alert('Error reading file.');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="App">
      <Header
        theme={theme}
        onNewEntry={handleStartNewEntry}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsDrawer
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            isDarkMode={theme === 'dark'}
            toggleTheme={toggleTheme}
            onExport={handleExport}
            onImport={handleImport}
            importMode={importMode}
            onImportModeChange={(mode) => setImportMode(mode)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="home-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div
          className="form-box"
          onClick={handleStartNewEntry}
          role="button"
          tabIndex={0}
          aria-label="Write new entry"
        >
          <TypingAnimation />
        </div>
        <div className="list-box">
          <div className="entry-controls">
            <input
              type="search"
              className="entry-search-input"
              placeholder="Search entries"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search entries"
            />
            <select
              className="entry-date-filter"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value as DateFilter)}
              aria-label="Filter entries by date"
            >
              <option value="all">All time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="365d">Last year</option>
            </select>
            {isFilterApplied && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setSearchQuery('');
                  setDateFilter('all');
                }}
              >
                Clear
              </button>
            )}
          </div>

          <EntryList
            entries={filteredEntries}
            onViewEntry={setSelectedEntry}
            emptyMessage={
              isFilterApplied
                ? 'No entries match your filters.'
                : 'No entries yet. Start writing your first one!'
            }
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedEntry && (
          <EntryModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onDelete={handleDeleteEntry}
            onEdit={handleStartEditEntry}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNewEntryModalOpen && (
          <NewEntryModal
            onClose={() => setIsNewEntryModalOpen(false)}
            onSaveEntry={handleAddEntry}
            draftStorageKey={NEW_ENTRY_DRAFT_KEY}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingEntry && (
          <NewEntryModal
            onClose={() => setEditingEntry(null)}
            onSaveEntry={(text, drawing) => handleUpdateEntry(editingEntry.id, text, drawing)}
            heading="Edit Entry"
            initialText={editingEntry.text}
            initialDrawing={editingEntry.drawing}
            saveButtonLabel="Update Entry"
            draftStorageKey={`journalDraft:edit:${editingEntry.id}`}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {recentlyDeletedEntry && (
          <motion.div
            className="undo-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span>Entry deleted.</span>
            <button type="button" className="undo-btn" onClick={handleUndoDelete}>
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
