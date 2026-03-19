import EntryForm from './EntryForm';
import { motion } from 'framer-motion';

interface NewEntryModalProps {
  onClose: () => void;
  onAddEntry: (text: string) => void;
}

function NewEntryModal({ onClose, onAddEntry }: NewEntryModalProps) {
  
  const handleSave = (text: string) => {
    onAddEntry(text);
    onClose(); 
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
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
        <h2>{formattedDate}</h2>
        <EntryForm 
          onSave={handleSave} 
          onCancel={onClose} 
        />
      </motion.div>
    </motion.div>
  );
}

export default NewEntryModal;
