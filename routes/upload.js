const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../src/db');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const d = path.join(__dirname, '..', 'uploads');
    fs.mkdirSync(d, { recursive: true });
    cb(null, d);
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname.replace(/\\s+/g, '_');
    cb(null, name);
  }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file required' });
    const db = getDb();
    const files = db.collection('files');

    const doc = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: '/uploads/' + req.file.filename,
      uploadedAt: new Date(),
      status: 'uploaded'
    };

    const result = await files.insertOne(doc);

    // Respond with file metadata and id
    res.json({ id: result.insertedId, file: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'upload failed' });
  }
});

module.exports = router;
