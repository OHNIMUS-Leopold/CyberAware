// server/db/database.ts
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./server/db/db.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la database:', err);
  } else {
    console.log('Connecté à la database');
    initDatabase();
  }
});

// Initialise la base de données
function initDatabase() {
  db.serialize(() => {
    // Créer la table des sessions
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        code TEXT PRIMARY KEY,
        moderator TEXT,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table des participants
    db.run(`
      CREATE TABLE IF NOT EXISTS participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_code TEXT,
        pseudo TEXT,
        FOREIGN KEY (session_code) REFERENCES sessions(code)
      )
    `);
  });
}

export default db;