import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EntryFormProps {
  onSave: (text: string) => void;
  onCancel: () => void;
  initialText?: string;
  saveButtonLabel?: string;
  draftStorageKey?: string;
}

const getInitialText = (initialText: string, draftStorageKey?: string): string => {
  if (draftStorageKey) {
    const savedDraft = localStorage.getItem(draftStorageKey);
    if (savedDraft !== null) {
      return savedDraft;
    }
  }

  return initialText;
};

function EntryForm({
  onSave,
  onCancel,
  initialText = '',
  saveButtonLabel = 'Save Entry',
  draftStorageKey,
}: EntryFormProps) {
  const [text, setText] = useState<string>(() => getInitialText(initialText, draftStorageKey));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!draftStorageKey) return;

    if (text.trim()) {
      localStorage.setItem(draftStorageKey, text);
    } else {
      localStorage.removeItem(draftStorageKey);
    }
  }, [draftStorageKey, text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) return;

    if (draftStorageKey) {
      localStorage.removeItem(draftStorageKey);
    }

    onSave(trimmedText);
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
        <div className="draft-status" aria-live="polite">
          {draftStorageKey ? 'Draft autosaves locally' : ''}
        </div>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saveButtonLabel}
        </motion.button>
      </div>
    </form>
  );
}

export default EntryForm;
