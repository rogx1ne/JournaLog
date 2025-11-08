import { useState, useEffect } from 'react';

const phrases = [
  "How was today...",
  "What's on your mind?",
  "Tell me about your day...",
  "New entry..."
];

const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_DURATION = 1500;

function TypingAnimation() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        if (displayedText.length > 0) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }
      } else {
        if (displayedText.length < currentPhrase.length) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
        }
      }
    };

    const typingSpeed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    const timeoutId = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, phraseIndex]);

  return (
    <div className="typing-animation">
      {displayedText}
      <span className="typing-cursor"></span>
    </div>
  );
}

export default TypingAnimation;