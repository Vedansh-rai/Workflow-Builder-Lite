
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Network, Play, History as HistoryIcon, Activity } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
        isActive(to) ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg mr-8">
            <div className="p-1 bg-primary rounded text-primary-foreground">
                <Network className="w-5 h-5" />
            </div>
            Workflow Builder
        </Link>
        <div className="flex items-center space-x-6">
          <NavItem to="/" icon={Network} label="Create Workflow" />
          <NavItem to="/run" icon={Play} label="Run Workflow" />
          <NavItem to="/history" icon={HistoryIcon} label="History" />
          <NavItem to="/status" icon={Activity} label="Status" />
        </div>
      </div>
    </nav>
  );
}
