import type { JournalEntry } from '../types';

interface EntryItemProps {
  entry: JournalEntry;
  onView: (entry: JournalEntry) => void;
}

function EntryItem({ entry, onView }: EntryItemProps) {
  return (
    <div 
      className="entry-item"
      onClick={() => onView(entry)}
    >
      <small>{new Date(entry.date).toLocaleString()}</small>
      <p>{entry.text}</p>
    </div>
  );
}
export default EntryItem;