
import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { api } from '../api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
       <div className="flex items-center justify-between">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Run History</h1>
            <p className="text-muted-foreground">View your recent workflow executions.</p>
        </div>
        <Button variant="outline" size="icon" onClick={loadHistory} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-4">
        {history.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
                No history found. Run a workflow to see it here.
            </div>
        )}

        {history.map((run) => (
            <Card key={run.id} className="overflow-hidden">
                <CardHeader className="bg-secondary/30 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-lg">{run.workflow_name}</CardTitle>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(run.created_at).toLocaleString()}
                            </div>
                        </div>
                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            run.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {run.status.toUpperCase()}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input Preview</span>
                        <div className="p-3 bg-muted/40 rounded-md text-sm line-clamp-3 h-24">
                            {run.input_text}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Final Output</span>
                        {run.status === 'success' ? (
                            <div className="p-3 bg-muted/40 rounded-md text-sm line-clamp-3 h-24">
                                {run.output_text}
                            </div>
                        ) : (
                            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm h-24 flex items-center">
                                Error: {run.error_message}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
