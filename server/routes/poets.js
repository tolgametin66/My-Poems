const express = require('express');
const router = express.Router();
const db = require('../db');

const WITH_COUNT = `
  SELECT p.*, COUNT(e.id) as entry_count
  FROM poets p
  LEFT JOIN entries e ON p.id = e.poet_id
`;

// GET /api/poets
router.get('/', (req, res) => {
  const poets = db.prepare(`${WITH_COUNT} GROUP BY p.id ORDER BY p.name ASC`).all();
  res.json(poets);
});

// GET /api/poets/:id
router.get('/:id', (req, res) => {
  const poet = db.prepare(`${WITH_COUNT} WHERE p.id = ? GROUP BY p.id`).get(req.params.id);
  if (!poet) return res.status(404).json({ error: 'Poet not found' });
  res.json(poet);
});

// POST /api/poets
router.post('/', (req, res) => {
  const { name, initials, color, born, died, nationality, bio } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const autoInitials = initials || name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const result = db.prepare(`
    INSERT INTO poets (name, initials, color, born, died, nationality, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, autoInitials, color || '#7F77DD', born || null, died || null,
         nationality || null, bio || null);

  const poet = db.prepare(`${WITH_COUNT} WHERE p.id = ? GROUP BY p.id`).get(result.lastInsertRowid);
  res.status(201).json(poet);
});

// PUT /api/poets/:id
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM poets WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Poet not found' });

  const { name, initials, color, born, died, nationality, bio } = req.body;

  db.prepare(`
    UPDATE poets SET name=?, initials=?, color=?, born=?, died=?, nationality=?, bio=?
    WHERE id=?
  `).run(
    name        !== undefined ? name        : existing.name,
    initials    !== undefined ? initials    : existing.initials,
    color       !== undefined ? color       : existing.color,
    born        !== undefined ? (born || null)        : existing.born,
    died        !== undefined ? (died || null)        : existing.died,
    nationality !== undefined ? (nationality || null) : existing.nationality,
    bio         !== undefined ? (bio  || null)        : existing.bio,
    req.params.id
  );

  const poet = db.prepare(`${WITH_COUNT} WHERE p.id = ? GROUP BY p.id`).get(req.params.id);
  res.json(poet);
});

// DELETE /api/poets/:id
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT id FROM poets WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Poet not found' });

  const { count } = db.prepare('SELECT COUNT(*) as count FROM entries WHERE poet_id = ?').get(req.params.id);
  if (count > 0) {
    return res.status(400).json({ error: 'Cannot delete a poet who has entries. Remove or reassign their entries first.' });
  }

  db.prepare('DELETE FROM poets WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
