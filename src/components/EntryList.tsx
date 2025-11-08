import type { JournalEntry } from '../types';
import EntryItem from './EntryItem';

interface EntryListProps {
  entries: JournalEntry[];
  onViewEntry: (entry: JournalEntry) => void;
}

function EntryList({ entries, onViewEntry }: EntryListProps) {
  if (entries.length === 0) {
    return <h2 className="entry-list-empty">No entries yet. Write one!</h2>;
  }

  return (
    <div className="entry-list">
      <h3>Your Entries</h3>
      {entries.map((entry) => (
        <EntryItem
          key={entry.id}
          entry={entry}
          onView={onViewEntry}
        />
      ))}
    </div>
  );
}
export default EntryList;