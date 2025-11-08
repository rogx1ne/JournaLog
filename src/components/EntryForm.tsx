import { useState, useRef, useEffect } from 'react';

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
        placeholder="What's on your mind?"
      />
      <div className="entry-form-buttons">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Back
        </button>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default EntryForm;