import type { JournalEntry } from '../types';
import { motion } from 'framer-motion';

interface EntryModalProps {
  entry: JournalEntry;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function EntryModal({ entry, onClose, onDelete }: EntryModalProps) {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      onDelete(entry.id);
      onClose();
    }
  };

  const formattedDate = new Date(entry.date).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div 
      className="modal-backdrop" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-content glass" 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <h3 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>{formattedDate}</h3>
        <p style={{ minHeight: '150px' }}>{entry.text}</p>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Back</button>
          <button className="delete-btn" onClick={handleDelete}>Delete Entry</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
export default EntryModal;
