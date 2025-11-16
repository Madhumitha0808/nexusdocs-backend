require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connect } = require('./db');

const authRoutes = require('../routes/auth');
const uploadRoutes = require('../routes/upload');

const PORT = process.env.PORT || 4000;

async function start() {
  await connect();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  app.use('/auth', authRoutes);
  app.use('/api', uploadRoutes);

  app.get('/', (req, res) => res.json({ status: 'nexusdocs-backend', env: process.env.NODE_ENV || 'dev' }));

  app.listen(PORT, () => console.log('Backend running on port', PORT));
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
