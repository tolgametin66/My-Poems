const express = require('express');
const router = express.Router();
const { client } = require('../db');

const WITH_COUNT = `
  SELECT p.*, COUNT(e.id) as entry_count
  FROM poets p
  LEFT JOIN entries e ON p.id = e.poet_id
`;

router.get('/', async (req, res) => {
  try {
    const { rows } = await client.execute(`${WITH_COUNT} GROUP BY p.id ORDER BY p.name ASC`);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await client.execute({ sql: `${WITH_COUNT} WHERE p.id = ? GROUP BY p.id`, args: [req.params.id] });
    if (!rows[0]) return res.status(404).json({ error: 'Poet not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, initials, color, born, died, nationality, bio } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const autoInitials = initials || name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const result = await client.execute({
      sql: `INSERT INTO poets (name, initials, color, born, died, nationality, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [name, autoInitials, color || '#7F77DD', born || null, died || null, nationality || null, bio || null],
    });
    const { rows } = await client.execute({ sql: `${WITH_COUNT} WHERE p.id = ? GROUP BY p.id`, args: [Number(result.lastInsertRowid)] });
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { rows: existing } = await client.execute({ sql: 'SELECT * FROM poets WHERE id = ?', args: [req.params.id] });
    if (!existing[0]) return res.status(404).json({ error: 'Poet not found' });
    const ex = existing[0];
    const { name, initials, color, born, died, nationality, bio } = req.body;

    await client.execute({
      sql: `UPDATE poets SET name=?, initials=?, color=?, born=?, died=?, nationality=?, bio=? WHERE id=?`,
      args: [
        name        !== undefined ? name        : ex.name,
        initials    !== undefined ? initials    : ex.initials,
        color       !== undefined ? color       : ex.color,
        born        !== undefined ? (born || null)        : ex.born,
        died        !== undefined ? (died || null)        : ex.died,
        nationality !== undefined ? (nationality || null) : ex.nationality,
        bio         !== undefined ? (bio  || null)        : ex.bio,
        req.params.id,
      ],
    });
    const { rows } = await client.execute({ sql: `${WITH_COUNT} WHERE p.id = ? GROUP BY p.id`, args: [req.params.id] });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rows: existing } = await client.execute({ sql: 'SELECT id FROM poets WHERE id = ?', args: [req.params.id] });
    if (!existing[0]) return res.status(404).json({ error: 'Poet not found' });

    const { rows: countRows } = await client.execute({ sql: 'SELECT COUNT(*) as count FROM entries WHERE poet_id = ?', args: [req.params.id] });
    if (Number(countRows[0].count) > 0) {
      return res.status(400).json({ error: 'Cannot delete a poet who has entries. Remove or reassign their entries first.' });
    }
    await client.execute({ sql: 'DELETE FROM poets WHERE id = ?', args: [req.params.id] });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
