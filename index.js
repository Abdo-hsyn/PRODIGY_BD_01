const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const app = express();
app.use(express.json());


const users = {};


const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).required()
});


app.post('/users', (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const id = uuidv4();
  users[id] = { id, ...value };

  res.status(201).json(users[id]);
});


app.get('/users', (req, res) => {
  res.json(Object.values(users));
});


app.get('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});


app.put('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  users[req.params.id] = { id: req.params.id, ...value };
  res.json(users[req.params.id]);
});


app.delete('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });

  delete users[req.params.id];
  res.status(204).send();
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
