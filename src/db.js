const { MongoClient } = require('mongodb');
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'nexusdocs';

let client;
let db;

async function connect() {
  if (db) return db;
  client = new MongoClient(url, { useUnifiedTopology: true });
  await client.connect();
  db = client.db(dbName);
  console.log('Connected to MongoDB:', dbName);
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not connected. Call connect() first.');
  return db;
}

module.exports = { connect, getDb };
