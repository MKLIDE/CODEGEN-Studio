import React from 'react';
import { FiMenu, FiBell, FiHelpCircle, FiMoon, FiSun } from 'react-icons/fi';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { theme, toggleSidebar, setTheme } = useAppStore();
  const [notifications, setNotifications] = React.useState(2);
  
  return (
    <header className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-gray-800 rounded transition-colors"
          title="Toggle sidebar"
        >
          <FiMenu className="w-5 h-5 text-gray-400" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-300">CodeGen Studio</span>
          <span className="text-xs text-gray-500">v0.1.0</span>
        </div>
      </div>
      
      {/* Center - Breadcrumbs */}
      <div className="hidden md:flex items-center space-x-2 text-sm">
        <span className="text-gray-400">projects</span>
        <span className="text-gray-600">/</span>
        <span className="text-gray-400">my-app</span>
        <span className="text-gray-600">/</span>
        <span className="text-white">src</span>
        <span className="text-gray-600">/</span>
        <span className="text-white">App.tsx</span>
      </div>
      
      {/* Right side */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 hover:bg-gray-800 rounded transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <FiSun className="w-5 h-5 text-gray-400" />
          ) : (
            <FiMoon className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <button
          className="p-1.5 hover:bg-gray-800 rounded transition-colors relative"
          title="Notifications"
        >
          <FiBell className="w-5 h-5 text-gray-400" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>
        
        <button
          className="p-1.5 hover:bg-gray-800 rounded transition-colors"
          title="Help"
        >
          <FiHelpCircle className="w-5 h-5 text-gray-400" />
        </button>
        
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          C
        </div>
      </div>
    </header>
  );
};

export default Header;
