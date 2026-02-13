
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import WorkflowBuilder from './components/WorkflowBuilder';
import WorkflowRunner from './components/WorkflowRunner';
import History from './components/History';
import Status from './components/Status';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans antialiased flex">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
             {/* Header could go here if global, but forcing it in Views for now or just generic wrapper */}
             <div className="p-8 max-w-7xl mx-auto w-full">
                <Routes>
                    <Route path="/" element={<WorkflowBuilder />} />
                    <Route path="/run" element={<WorkflowRunner />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/status" element={<Status />} />
                </Routes>
             </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
