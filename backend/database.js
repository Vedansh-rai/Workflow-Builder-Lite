
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'workflow-builder.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const initDb = () => {
  db.serialize(() => {
    // Workflows table
    db.run(`CREATE TABLE IF NOT EXISTS workflows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      steps TEXT NOT NULL, -- JSON string of steps
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Runs table
    db.run(`CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow_id INTEGER,
      workflow_name TEXT,
      input_text TEXT,
      output_text TEXT,
      steps_output TEXT, -- JSON string of results per step
      status TEXT, -- 'success', 'failed'
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(workflow_id) REFERENCES workflows(id)
    )`);
  });
};

module.exports = { db, initDb };
