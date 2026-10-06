const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./db');
const seed = require('./seed');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/entries', require('./routes/entries'));
app.use('/api/poets', require('./routes/poets'));

const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));

async function start() {
  await initDb();
  await seed();
  app.listen(PORT, () => console.log(`The Anthology running on http://localhost:${PORT}`));
}

start().catch(err => { console.error(err); process.exit(1); });
