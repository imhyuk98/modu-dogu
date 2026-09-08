import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

// Real SQLite constraints and queries, with the small D1 surface used by the API.
export function testDatabase() {
  const sql = new DatabaseSync(':memory:');
  sql.exec('PRAGMA foreign_keys = ON');
  sql.exec(readFileSync(new URL('./migrations/0001_inboxes.sql', import.meta.url), 'utf8'));
  const DB = {
    prepare(query) {
      const statement = sql.prepare(query);
      const bound = (values = []) => ({
        bind: (...args) => bound(args),
        first: async () => statement.get(...values) ?? null,
        all: async () => ({ results: statement.all(...values) }),
        run: async () => ({ success: true, meta: statement.run(...values) }),
      });
      return bound();
    },
  };
  return { DB, sql };
}
