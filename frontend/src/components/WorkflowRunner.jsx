
import React, { useState, useEffect } from 'react';
import { Play, Loader2, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { api } from '../api';

export default function WorkflowRunner() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await api.getWorkflows();
      setWorkflows(data);
      if (data.length > 0) setSelectedWorkflowId(data[0].id);
    } catch (err) {
      console.error('Failed to load workflows', err);
    }
  };

  const handleRun = async () => {
    if (!selectedWorkflowId || !input.trim()) return;

    setIsRunning(true);
    setResult(null);
    setError(null);

    try {
      const data = await api.executeWorkflow(selectedWorkflowId, input);
      setResult(data);
      if (data.status === 'failed') {
          setError(data.error || 'Workflow execution failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const selectedWorkflow = workflows.find(w => w.id == selectedWorkflowId);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Run Workflow</h1>
        <p className="text-muted-foreground">Execute your saved workflows on new text.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Workflow</label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={selectedWorkflowId}
                  onChange={(e) => setSelectedWorkflowId(e.target.value)}
                >
                  {workflows.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                {selectedWorkflow && (
                   <p className="text-sm text-muted-foreground mt-2">{selectedWorkflow.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Paste your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                <Button onClick={handleRun} disabled={isRunning || !input.trim() || !selectedWorkflowId}>
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" /> Run Workflow
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
                <AlertCircle className="w-5 h-5"/>
                <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="text-xl font-semibold">Results</h3>
               
               {result.stepOutputs.map((step, index) => (
                 <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-secondary/50 py-3">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">{index + 1}</span>
                            <span className="font-medium text-sm">{step.type}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 bg-muted/20">
                        <div className="whitespace-pre-wrap text-sm">{step.output}</div>
                    </CardContent>
                 </Card>
               ))}

               {result.status === 'success' && (
                   <div className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                       <CheckCircle className="w-5 h-5 mr-2" />
                       <span className="font-medium">Workflow Completed Successfully</span>
                   </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
