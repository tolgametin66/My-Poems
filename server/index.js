const express = require('express');
const path = require('path');
const app = require('./app');
const { initDb } = require('./db');
const seed = require('./seed');

const PORT = process.env.PORT || 3001;

const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));

async function start() {
  await initDb();
  await seed();
  app.listen(PORT, () => console.log(`The Anthology running on http://localhost:${PORT}`));
}

start().catch(err => { console.error(err); process.exit(1); });
