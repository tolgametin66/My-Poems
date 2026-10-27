const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/entries', require('./routes/entries'));
app.use('/api/poets', require('./routes/poets'));

module.exports = app;
