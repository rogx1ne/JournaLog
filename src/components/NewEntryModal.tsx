import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Edit3 } from 'lucide-react';
import Canvas from './Canvas';

interface NewEntryModalProps {
  onClose: () => void;
  onSaveEntry: (text: string, drawing?: string) => void;
  heading?: string;
  initialText?: string;
  initialDrawing?: string;
  saveButtonLabel?: string;
  draftStorageKey: string;
}

function NewEntryModal({
  onClose,
  onSaveEntry,
  heading = 'New Entry',
  initialText = '',
  initialDrawing = '',
  saveButtonLabel = 'Save Entry',
  draftStorageKey,
}: NewEntryModalProps) {
  const [text, setText] = useState(initialText);
  const [drawing, setDrawing] = useState(initialDrawing);
  const [isSketchMode, setIsSketchMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const draft = localStorage.getItem(draftStorageKey);
    if (draft && !initialText) {
      try {
        const parsedDraft = JSON.parse(draft);
        setText(parsedDraft.text || '');
        setDrawing(parsedDraft.drawing || '');
      } catch {
        setText(draft);
      }
    }
  }, [draftStorageKey, initialText]);

  useEffect(() => {
    localStorage.setItem(draftStorageKey, JSON.stringify({ text, drawing }));
  }, [text, drawing, draftStorageKey]);

  // Focus textarea when switching back to text mode
  useEffect(() => {
    if (!isSketchMode && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isSketchMode]);

  const handleSave = () => {
    if (text.trim() || drawing) {
      onSaveEntry(text, drawing);
      localStorage.removeItem(draftStorageKey);
      onClose();
    }
  };

  return (
    <motion.div
      className="modal-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal-content apple-notes-modal glass"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        <div className="modal-header">
          <h2>{heading}</h2>
          <div className="apple-notes-toolbar">
            <button
              type="button"
              className={`tool-toggle-btn ${!isSketchMode ? 'active' : ''}`}
              onClick={() => setIsSketchMode(false)}
              title="Type Mode"
            >
              <Edit2 size={18} />
            </button>
            <button
              type="button"
              className={`tool-toggle-btn ${isSketchMode ? 'active' : ''}`}
              onClick={() => setIsSketchMode(true)}
              title="Scribble Mode"
            >
              <Edit3 size={18} />
            </button>
          </div>
        </div>

        <div className="notebook-surface-container">
          <div className="notebook-paper-surface">
            <textarea
              ref={textareaRef}
              className="apple-notes-textarea notebook-lines"
              placeholder="Start writing..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ 
                pointerEvents: isSketchMode ? 'none' : 'auto',
                zIndex: isSketchMode ? 1 : 4 // Ensure it's on top when typing
              }}
            />
            <div 
              className="apple-notes-canvas-wrapper"
              style={{ 
                pointerEvents: isSketchMode ? 'auto' : 'none',
                zIndex: isSketchMode ? 4 : 1 // Ensure it's on top when sketching
              }}
            >
              <Canvas 
                onSave={setDrawing} 
                initialData={drawing} 
                isActive={isSketchMode} 
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="save-btn"
            onClick={handleSave}
            disabled={!text.trim() && !drawing}
          >
            {saveButtonLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default NewEntryModal;
