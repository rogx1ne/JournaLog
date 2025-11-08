import type { JournalEntry } from '../types';

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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <h3>{new Date(entry.date).toLocaleString()}</h3>
        <p>{entry.text}</p>
        
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>Back</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>

      </div>
    </div>
  );
}
export default EntryModal;