const express = require('express');
const router = express.Router();
const db = require('../db');

function parseEntry(entry) {
  if (!entry) return null;
  return {
    ...entry,
    tags: JSON.parse(entry.tags || '[]'),
    is_favorite: Boolean(entry.is_favorite),
  };
}

const WITH_POET = `
  SELECT e.*, p.name as poet_name, p.initials as poet_initials, p.color as poet_color
  FROM entries e
  LEFT JOIN poets p ON e.poet_id = p.id
`;

// GET /api/entries
router.get('/', (req, res) => {
  const { type, poet, tag, q } = req.query;

  let sql = `${WITH_POET} WHERE 1=1`;
  const params = [];

  if (type) { sql += ' AND e.type = ?'; params.push(type); }
  if (poet) { sql += ' AND e.poet_id = ?'; params.push(Number(poet)); }
  if (tag)  { sql += ' AND e.tags LIKE ?'; params.push(`%"${tag}"%`); }
  if (q) {
    sql += ' AND (e.title LIKE ? OR e.body LIKE ? OR p.name LIKE ?)';
    const p_ = `%${q}%`;
    params.push(p_, p_, p_);
  }

  sql += ' ORDER BY e.created_at DESC';

  const entries = db.prepare(sql).all(...params);
  res.json(entries.map(parseEntry));
});

// GET /api/entries/:id
router.get('/:id', (req, res) => {
  const entry = db.prepare(`${WITH_POET} WHERE e.id = ?`).get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  res.json(parseEntry(entry));
});

// POST /api/entries
router.post('/', (req, res) => {
  const { type, title, body, poet_id, tags, is_favorite, source, year } = req.body;

  if (!type || !title || !body) {
    return res.status(400).json({ error: 'type, title, and body are required' });
  }

  const exc = body.slice(0, 120) + (body.length > 120 ? '...' : '');
  const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);

  const result = db.prepare(`
    INSERT INTO entries (type, title, body, excerpt, poet_id, tags, is_favorite, source, year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(type, title, body, exc, poet_id || null, tagsJson,
         is_favorite ? 1 : 0, source || null, year || null);

  const entry = db.prepare(`${WITH_POET} WHERE e.id = ?`).get(result.lastInsertRowid);
  res.status(201).json(parseEntry(entry));
});

// PUT /api/entries/:id
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Entry not found' });

  const newBody = req.body.body !== undefined ? req.body.body : existing.body;
  const exc = newBody.slice(0, 120) + (newBody.length > 120 ? '...' : '');
  const tagsJson = req.body.tags !== undefined
    ? JSON.stringify(Array.isArray(req.body.tags) ? req.body.tags : [])
    : existing.tags;

  const { type, title, poet_id, is_favorite, source, year } = req.body;

  db.prepare(`
    UPDATE entries SET
      type = ?, title = ?, body = ?, excerpt = ?, poet_id = ?,
      tags = ?, is_favorite = ?, source = ?, year = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    type      !== undefined ? type      : existing.type,
    title     !== undefined ? title     : existing.title,
    newBody, exc,
    poet_id   !== undefined ? (poet_id || null) : existing.poet_id,
    tagsJson,
    is_favorite !== undefined ? (is_favorite ? 1 : 0) : existing.is_favorite,
    source    !== undefined ? (source || null) : existing.source,
    year      !== undefined ? (year   || null) : existing.year,
    req.params.id
  );

  const entry = db.prepare(`${WITH_POET} WHERE e.id = ?`).get(req.params.id);
  res.json(parseEntry(entry));
});

// DELETE /api/entries/:id
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT id FROM entries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Entry not found' });
  db.prepare('DELETE FROM entries WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
