
const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { checkLlmStatus } = require('../llmService');

router.get('/', async (req, res) => {
  const status = {
    server: 'up',
    database: 'unknown',
    llm: 'unknown',
    timestamp: new Date().toISOString(),
  };

  // Check Database
  try {
    await new Promise((resolve, reject) => {
      db.get('SELECT 1', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    status.database = 'connected';
  } catch (error) {
    status.database = 'error';
    status.databaseError = error.message;
  }
    
    // Check LLM
    try {
        await checkLlmStatus();
        status.llm = 'connected';
    } catch (error) {
        status.llm = 'error';
    }

  res.json(status);
});

module.exports = router;
