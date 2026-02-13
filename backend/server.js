
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./database');
const workflowRoutes = require('./routes/workflows');
const runRoutes = require('./routes/runs');
const statusRoute = require('./routes/status');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Routes
app.use('/api/workflows', workflowRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/status', statusRoute);

// Serve static files in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
} else {
  // Basic route for dev
  app.get('/', (req, res) => {
    res.send('Workflow Builder Lite API running');
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment Check:', {
      Groq: !!process.env.GROQ_API_KEY,
      OpenAI: !!process.env.OPENAI_API_KEY,
      Gemini: !!process.env.GEMINI_API_KEY,
      Anthropic: !!process.env.ANTHROPIC_API_KEY
  });
});
