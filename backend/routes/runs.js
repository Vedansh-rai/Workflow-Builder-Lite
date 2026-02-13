
const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { processStep } = require('../llmService');

// Get run history (limit 5)
router.get('/', (req, res) => {
  db.all('SELECT * FROM runs ORDER BY created_at DESC LIMIT 5', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Parse steps_output
    const runs = rows.map(row => ({
      ...row,
      steps_output: JSON.parse(row.steps_output)
    }));
    res.json(runs);
  });
});

// Execute workflow
router.post('/execute', async (req, res) => {
  const { workflowId, inputText } = req.body;

  if (!workflowId || !inputText) {
    return res.status(400).json({ error: 'Missing workflowId or inputText' });
  }

  // Fetch workflow
  db.get('SELECT * FROM workflows WHERE id = ?', [workflowId], async (err, workflow) => {
    if (err || !workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const steps = JSON.parse(workflow.steps);
    let currentText = inputText;
    const stepOutputs = [];
    let status = 'success';
    let errorMessage = null;

    try {
      for (const step of steps) {
        const output = await processStep(currentText, step.type, step.instructions);
        stepOutputs.push({
          stepId: step.id,
          type: step.type,
          input: currentText,
          output: output
        });
        currentText = output; // Pass output to next step
      }
    } catch (error) {
        status = 'failed';
        errorMessage = error.message;
        console.error("Execution failed:", error);
    }

    // Save run to DB
    const finalOutput = status === 'success' ? currentText : null;
    const stepsOutputJson = JSON.stringify(stepOutputs);

    const stmt = db.prepare(`INSERT INTO runs 
      (workflow_id, workflow_name, input_text, output_text, steps_output, status, error_message) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`);
    
    stmt.run(workflow.id, workflow.name, inputText, finalOutput, stepsOutputJson, status, errorMessage, function(err) {
        if (err) {
            console.error("Failed to save run:", err);
            // If we fail to save, we should probably still return the result if it was successful? 
            // But strict error handling implies telling the user using 500.
            return res.status(500).json({ error: 'Failed to save run history' });
        }
        
        res.json({
            runId: this.lastID,
            status,
            finalOutput,
            stepOutputs,
            error: errorMessage
        });
    });
    stmt.finalize();
  });
});

module.exports = router;
