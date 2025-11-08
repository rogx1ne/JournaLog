import EntryForm from './EntryForm';

interface NewEntryModalProps {
  onClose: () => void;
  onAddEntry: (text: string) => void;
}

function NewEntryModal({ onClose, onAddEntry }: NewEntryModalProps) {
  
  const handleSave = (text: string) => {
    onAddEntry(text);
    onClose(); 
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <h2>Entry on {new Date().toLocaleString()}</h2>
        
        <EntryForm 
          onSave={handleSave} 
          onCancel={onClose} 
        />
        
      </div>
    </div>
  );
}

export default NewEntryModal;