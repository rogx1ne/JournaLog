import type { JournalEntry } from '../types';
import { motion } from 'framer-motion';

interface EntryModalProps {
  entry: JournalEntry;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (entry: JournalEntry) => void;
}

function EntryModal({ entry, onClose, onDelete, onEdit }: EntryModalProps) {
  const handleDelete = () => {
    onDelete(entry.id);
    onClose();
  };

  const handleEdit = () => {
    onEdit(entry);
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
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="modal-content glass entry-modal-content notebook-paper"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
      >
        <h3 className="entry-modal-date">{formattedDate}</h3>
        
        <div className="entry-modal-body">
          {entry.drawing && (
            <div className="entry-modal-drawing">
              <img src={entry.drawing} alt="Sketch" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}
          <p className="entry-modal-text notebook-lines">{entry.text}</p>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>Back</button>
          <button type="button" className="edit-btn" onClick={handleEdit}>Edit Entry</button>
          <button type="button" className="delete-btn" onClick={handleDelete}>Delete Entry</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
export default EntryModal;
