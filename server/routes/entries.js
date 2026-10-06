const express = require('express');
const router = express.Router();
const { client } = require('../db');

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

router.get('/', async (req, res) => {
  try {
    const { type, poet, tag, q } = req.query;
    let sql = `${WITH_POET} WHERE 1=1`;
    const args = [];

    if (type) { sql += ' AND e.type = ?'; args.push(type); }
    if (poet) { sql += ' AND e.poet_id = ?'; args.push(Number(poet)); }
    if (tag)  { sql += ' AND e.tags LIKE ?'; args.push(`%"${tag}"%`); }
    if (q) {
      sql += ' AND (e.title LIKE ? OR e.body LIKE ? OR p.name LIKE ?)';
      const p_ = `%${q}%`;
      args.push(p_, p_, p_);
    }
    sql += ' ORDER BY e.created_at DESC';

    const { rows } = await client.execute({ sql, args });
    res.json(rows.map(parseEntry));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await client.execute({ sql: `${WITH_POET} WHERE e.id = ?`, args: [req.params.id] });
    if (!rows[0]) return res.status(404).json({ error: 'Entry not found' });
    res.json(parseEntry(rows[0]));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, title, body, poet_id, tags, is_favorite, source, year } = req.body;
    if (!type || !title || !body) {
      return res.status(400).json({ error: 'type, title, and body are required' });
    }
    const exc = body.slice(0, 120) + (body.length > 120 ? '...' : '');
    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);

    const result = await client.execute({
      sql: `INSERT INTO entries (type, title, body, excerpt, poet_id, tags, is_favorite, source, year)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [type, title, body, exc, poet_id || null, tagsJson, is_favorite ? 1 : 0, source || null, year || null],
    });
    const { rows } = await client.execute({ sql: `${WITH_POET} WHERE e.id = ?`, args: [Number(result.lastInsertRowid)] });
    res.status(201).json(parseEntry(rows[0]));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { rows: existing } = await client.execute({ sql: 'SELECT * FROM entries WHERE id = ?', args: [req.params.id] });
    if (!existing[0]) return res.status(404).json({ error: 'Entry not found' });
    const ex = existing[0];

    const newBody = req.body.body !== undefined ? req.body.body : ex.body;
    const exc = newBody.slice(0, 120) + (newBody.length > 120 ? '...' : '');
    const tagsJson = req.body.tags !== undefined
      ? JSON.stringify(Array.isArray(req.body.tags) ? req.body.tags : [])
      : ex.tags;
    const { type, title, poet_id, is_favorite, source, year } = req.body;

    await client.execute({
      sql: `UPDATE entries SET type=?, title=?, body=?, excerpt=?, poet_id=?, tags=?, is_favorite=?, source=?, year=?, updated_at=datetime('now') WHERE id=?`,
      args: [
        type        !== undefined ? type        : ex.type,
        title       !== undefined ? title       : ex.title,
        newBody, exc,
        poet_id     !== undefined ? (poet_id || null)     : ex.poet_id,
        tagsJson,
        is_favorite !== undefined ? (is_favorite ? 1 : 0) : ex.is_favorite,
        source      !== undefined ? (source || null)      : ex.source,
        year        !== undefined ? (year   || null)      : ex.year,
        req.params.id,
      ],
    });
    const { rows } = await client.execute({ sql: `${WITH_POET} WHERE e.id = ?`, args: [req.params.id] });
    res.json(parseEntry(rows[0]));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await client.execute({ sql: 'SELECT id FROM entries WHERE id = ?', args: [req.params.id] });
    if (!rows[0]) return res.status(404).json({ error: 'Entry not found' });
    await client.execute({ sql: 'DELETE FROM entries WHERE id = ?', args: [req.params.id] });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
