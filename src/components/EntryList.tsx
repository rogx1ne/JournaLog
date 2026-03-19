import type { JournalEntry } from '../types';
import EntryItem from './EntryItem';
import { motion } from 'framer-motion';

interface EntryListProps {
  entries: JournalEntry[];
  onViewEntry: (entry: JournalEntry) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function EntryList({ entries, onViewEntry }: EntryListProps) {
  if (entries.length === 0) {
    return <div className="entry-list-empty">No entries yet. Start writing your first one!</div>;
  }

  return (
    <motion.div 
      className="entry-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Your Entries</h3>
      {entries.map((entry) => (
        <motion.div key={entry.id} variants={itemVariants}>
          <EntryItem
            entry={entry}
            onView={onViewEntry}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
export default EntryList;
