
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Activity, Database, Server, Cpu, Check, X, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export default function Status() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getStatus();
        setStatus(data);
      } catch (err) {
        console.error(err);
        setStatus({ error: true });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const StatusItem = ({ icon: Icon, label, status, detail }) => (
    <div className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-md">
                <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
                <p className="font-medium">{label}</p>
                {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
            </div>
        </div>
        <div className="flex items-center gap-2">
            {status === 'connected' || status === 'up' ? (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                    <Check className="w-3 h-3 mr-1" /> Operational
                </div>
            ) : status === 'unknown' ? (
                 <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-medium">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Unknown
                </div>
            ) : (
                <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-medium">
                    <X className="w-3 h-3 mr-1" /> Error
                </div>
            )}
        </div>
    </div>
  );

  if (loading && !status) return <div className="p-8 text-center">Loading status...</div>;
  if (!status) return <div className="p-8 text-center text-red-500">Failed to load system status.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-muted-foreground">Real-time monitoring of system components.</p>
      </div>

      <div className="grid gap-4">
        <StatusItem 
            icon={Server} 
            label="Backend API" 
            status={status.server || (status.error ? 'down' : 'up')} 
            detail="Node.js/Express Server"
        />
        <StatusItem 
            icon={Database} 
            label="Database" 
            status={status.database} 
            detail="SQLite Storage"
        />
        <StatusItem 
            icon={Cpu} 
            label="LLM Service" 
            status={status.llm} 
            detail="Anthropic Claude API"
        />
      </div>

      <div className="text-xs text-muted-foreground text-center pt-8">
          Last updated: {status.timestamp ? new Date(status.timestamp).toLocaleString() : 'Never'}
      </div>
    </div>
  );
}
