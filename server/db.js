const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:anthology.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS poets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      initials TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#7F77DD',
      born INTEGER,
      died INTEGER,
      nationality TEXT,
      bio TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('poem', 'quote')),
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      excerpt TEXT,
      poet_id INTEGER REFERENCES poets(id) ON DELETE SET NULL,
      tags TEXT DEFAULT '[]',
      is_favorite INTEGER DEFAULT 0,
      source TEXT,
      year INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

module.exports = { client, initDb };
