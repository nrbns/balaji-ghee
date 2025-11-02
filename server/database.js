const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'balaji_ghee.db');

// Initialize database
function initDatabase() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database');
    }
  });

  // Create tables
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('MASTER', 'STAFF')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Homepage versions table
    db.run(`
      CREATE TABLE IF NOT EXISTS homepage_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('draft', 'published')),
        data TEXT NOT NULL,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Site state table (pointers to published versions)
    db.run(`
      CREATE TABLE IF NOT EXISTS site_state (
        id INTEGER PRIMARY KEY DEFAULT 1 CHECK(id = 1),
        homepage_version_id INTEGER,
        FOREIGN KEY (homepage_version_id) REFERENCES homepage_versions(id)
      )
    `);

    // Leads table
    db.run(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT,
        email TEXT,
        phone TEXT,
        source TEXT,
        utm TEXT,
        message TEXT,
        status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'won', 'lost')),
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lead notes table
    db.run(`
      CREATE TABLE IF NOT EXISTS lead_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_id INTEGER NOT NULL,
        user_id INTEGER,
        note TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Audit logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        entity TEXT,
        entity_id INTEGER,
        meta TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Initialize site_state if needed
    db.run(`
      INSERT OR IGNORE INTO site_state (id, homepage_version_id) VALUES (1, NULL)
    `);

    console.log('Database tables initialized');
  });

  return db;
}

// Promisify database operations
function promisify(db) {
  return {
    get: (sql, params) => new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    all: (sql, params) => new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    run: (sql, params) => new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    })
  };
}

module.exports = { initDatabase, promisify };

