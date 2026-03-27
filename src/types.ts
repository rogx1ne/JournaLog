export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  drawing?: string; // Base64 or JSON string of the canvas data
  type?: 'text' | 'sketch' | 'hybrid';
}
