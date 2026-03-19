import type { JournalEntry } from '../types';
import Sentiment from 'sentiment';

interface EntryItemProps {
  entry: JournalEntry;
  onView: (entry: JournalEntry) => void;
}

const sentiment = new Sentiment();

function EntryItem({ entry, onView }: EntryItemProps) {
  const result = sentiment.analyze(entry.text);
  const score = result.score;
  
  const getMoodEmoji = (score: number) => {
    if (score > 3) return '✨';
    if (score > 0) return '🙂';
    if (score === 0) return '😐';
    if (score > -3) return '🙁';
    return '😢';
  };

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      className="entry-item"
      onClick={() => onView(entry)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <small>{formattedDate}</small>
        <span style={{ fontSize: '1.2rem' }} title={`Mood score: ${score}`}>
          {getMoodEmoji(score)}
        </span>
      </div>
      <p>{entry.text}</p>
    </div>
  );
}
export default EntryItem;