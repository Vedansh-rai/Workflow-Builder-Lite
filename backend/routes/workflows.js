
const express = require('express');
const router = express.Router();
const { db } = require('../database');

// Get all workflows
router.get('/', (req, res) => {
  db.all('SELECT * FROM workflows ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Parse steps JSON
    const workflows = rows.map(row => ({
      ...row,
      steps: JSON.parse(row.steps)
    }));
    res.json(workflows);
  });
});

// Create new workflow
router.post('/', (req, res) => {
  const { name, description, steps } = req.body;

  if (!name || !steps || !Array.isArray(steps)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  if (steps.length < 2 || steps.length > 4) {
    return res.status(400).json({ error: 'Workflow must have 2-4 steps' });
  }

  const stepsJson = JSON.stringify(steps);

  const stmt = db.prepare('INSERT INTO workflows (name, description, steps) VALUES (?, ?, ?)');
  stmt.run(name, description, stepsJson, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, description, steps });
  });
  stmt.finalize();
});

// Delete workflow
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM workflows WHERE id = ?', id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});

module.exports = router;
