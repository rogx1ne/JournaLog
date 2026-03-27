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
  const formattedTime = new Date(entry.date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <button
      type="button"
      className="entry-item notebook-paper"
      onClick={() => onView(entry)}
    >
      <div className="entry-item-head">
        <small className="entry-item-date">{formattedDate} · {formattedTime}</small>
        <div className="entry-item-indicators">
          {entry.drawing && <span title="Has sketch" className="indicator-icon">🎨</span>}
          <span className="entry-item-mood" title={`Mood score: ${score}`}>
            {getMoodEmoji(score)}
          </span>
        </div>
      </div>
      <div className="entry-item-content">
        {entry.drawing && (
          <div className="entry-item-thumbnail">
            <img src={entry.drawing} alt="Sketch thumbnail" />
          </div>
        )}
        <p className="entry-item-text">{entry.text}</p>
      </div>
    </button>
  );
}
export default EntryItem;
