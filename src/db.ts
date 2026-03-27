import Dexie, { type Table } from 'dexie';
import type { JournalEntry } from './types';

export class JournalDatabase extends Dexie {
  entries!: Table<JournalEntry>;

  constructor() {
    super('JournalDatabase');
    this.version(1).stores({
      entries: 'id, date' // 'id' is primary, 'date' is indexed for filtering
    });
  }
}

export const db = new JournalDatabase();
