
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export const api = {
  // Workflows
  getWorkflows: async () => {
    const res = await fetch(`${API_BASE_URL}/workflows`);
    if (!res.ok) throw new Error('Failed to fetch workflows');
    return res.json();
  },

  createWorkflow: async (workflow) => {
    const res = await fetch(`${API_BASE_URL}/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create workflow');
    }
    return res.json();
  },

  deleteWorkflow: async (id) => {
    const res = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete workflow');
    return res.json();
  },

  // Runs
  getHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/runs`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  executeWorkflow: async (workflowId, inputText) => {
    const res = await fetch(`${API_BASE_URL}/runs/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId, inputText }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to execute workflow');
    }
    return res.json();
  },

  // Status
  getStatus: async () => {
    const res = await fetch(`${API_BASE_URL}/status`);
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  },
};
