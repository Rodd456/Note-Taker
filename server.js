const express = require('express');
const { readFile, writeFile } = require('fs/promises');
const { join } = require('path');
const { v4: uuid } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const db = join(__dirname, 'db', 'db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', async (req, res) => {
  const notes = await readFile(db, 'utf-8');
  res.json(JSON.parse(notes));
});

app.post('/api/notes', async (req, res) => {
  const newNote = { ...req.body, id: uuid() };
  const notes = JSON.parse(await readFile(db, 'utf-8'));
  notes.push(newNote);
  await writeFile(db, JSON.stringify(notes, null, 2));
  res.json(notes);
});

app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  let notes = JSON.parse(await readFile(db, 'utf-8'));
  notes = notes.filter((n) => n.id !== id);
  await writeFile(db, JSON.stringify(notes, null, 2));
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
