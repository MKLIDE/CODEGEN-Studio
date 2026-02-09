import React from 'react';
import { FiFolder, FiFile, FiSettings, FiTerminal, FiCpu, FiShield } from 'react-icons/fi';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const Sidebar: React.FC = () => {
  const { sidebarOpen, currentProject, toggleSidebar } = useAppStore();
  
  const menuItems: SidebarItem[] = [
    { id: 'explorer', label: 'Explorer', icon: <FiFolder /> },
    { id: 'search', label: 'Search', icon: <FiFile />, badge: 3 },
    { id: 'terminal', label: 'Terminal', icon: <FiTerminal /> },
    { id: 'ai', label: 'AI Assistant', icon: <FiCpu /> },
    { id: 'privacy', label: 'Privacy', icon: <FiShield /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];
  
  if (!sidebarOpen) {
    return (
      <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col">
        <button
          onClick={toggleSidebar}
          className="p-4 hover:bg-gray-800 transition-colors"
        >
          <FiFolder className="w-6 h-6 text-gray-400" />
        </button>
      </div>
    );
  }
  
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">CodeGen Studio</h2>
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            <FiFolder className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {currentProject && (
          <div className="mt-2 text-sm text-gray-400 truncate">
            📁 {currentProject.name}
          </div>
        )}
      </div>
      
      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg",
                "hover:bg-gray-800 transition-colors text-left",
                item.id === 'explorer' && "bg-gray-800"
              )}
            >
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">{item.icon}</span>
                <span className="text-gray-300">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Project Files Section */}
        <div className="mt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Project Files
          </h3>
          <div className="mt-2 space-y-1">
            <div className="px-3 py-1 text-sm text-gray-400 hover:text-white cursor-pointer">
              📄 package.json
            </div>
            <div className="px-3 py-1 text-sm text-gray-400 hover:text-white cursor-pointer">
              📄 index.html
            </div>
            <div className="px-3 py-1 text-sm text-gray-400 hover:text-white cursor-pointer">
              📁 src/
            </div>
            <div className="px-3 py-1 text-sm text-gray-400 hover:text-white cursor-pointer">
              📁 public/
            </div>
          </div>
        </div>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">🔒 Local</div>
          <div className="text-green-400">● Connected</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
