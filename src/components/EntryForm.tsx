import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EntryFormProps {
  onSave: (text: string) => void;
  onCancel: () => void;
}

function EntryForm({ onSave, onCancel }: EntryFormProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSave(text); 
  };

  return (
    <form onSubmit={handleSubmit} className="new-entry-form">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind today?"
      />
      <div className="entry-form-buttons">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Entry
        </motion.button>
      </div>
    </form>
  );
}

export default EntryForm;