const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../src/db');

const JWT_SECRET = process.env.JWT_SECRET || 'please_change_this';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const db = getDb();
    const users = db.collection('users');
    const existing = await users.findOne({ email });
    if (existing) return res.status(400).json({ error: 'user exists' });

    const hash = await bcrypt.hash(password, 10);
    const result = await users.insertOne({ name: name || '', email, password: hash, createdAt: new Date() });

    const user = { id: result.insertedId, email, name: name || '' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const db = getDb();
    const users = db.collection('users');
    const user = await users.findOne({ email });
    if (!user) return res.status(400).json({ error: 'invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'invalid credentials' });

    const payload = { id: user._id, email: user.email, name: user.name || '' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'please_change_this', { expiresIn: '7d' });
    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
