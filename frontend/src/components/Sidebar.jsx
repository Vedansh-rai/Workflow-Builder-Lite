
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/' },
    { name: 'Run Workflow', icon: 'play_circle', path: '/run' }, // Changed from 'Workflows' to be clear it's the runner
    { name: 'History', icon: 'history', path: '/history' },
    { name: 'Status', icon: 'dns', path: '/status' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-icons-round text-lg">auto_fix_high</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">AutoFlow</span>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="material-icons-round text-[20px]">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-icons-round text-[20px]">dark_mode</span>
          <span className="text-sm font-medium">Toggle Theme</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
