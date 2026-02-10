import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import CodeEditor from './components/editor/CodeEditor';
import AIPanel from './components/panels/AIPanel';
import { useAppStore } from './stores/app-store';

const App: React.FC = () => {
  const { theme, sidebarOpen } = useAppStore();
  const [code, setCode] = React.useState('// Welcome to CodeGen Studio\n// Start coding here...\n\nfunction hello() {\n  console.log("Hello, world!");\n}');

  React.useEffect(() => {
    console.log('App mounted - Theme:', theme, 'Sidebar:', sidebarOpen);
    console.log('Document root element:', document.getElementById('root'));
  }, []);

  return (
    <div className={`h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="h-full flex flex-col bg-gray-950 text-gray-100">
        <Header />

        <div className="flex-1 flex overflow-hidden">
          <Sidebar />

          <main className="flex-1 overflow-hidden flex">
            {/* Code Editor */}
            <div className={`${sidebarOpen ? 'w-2/3' : 'w-3/4'} border-r border-gray-800`}>
              <CodeEditor
                path="src/App.js"
                language="javascript"
                value={code}
                onChange={setCode}
              />
            </div>

            {/* AI Panel */}
            <div className={`${sidebarOpen ? 'w-1/3' : 'w-1/4'}`}>
              <AIPanel />
            </div>
          </main>
        </div>

        {/* Status Bar */}
        <footer className="h-8 bg-gray-900 border-t border-gray-800 px-4 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">Connected</span>
            </div>
            <div className="text-gray-500">Ln 1, Col 1</div>
            <div className="text-gray-500">Spaces: 2</div>
            <div className="text-gray-500">UTF-8</div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-gray-500">🔒 Privacy Active</div>
            <div className="text-gray-500">🤖 AI: Ready</div>
            <div className="text-gray-500">100%</div>
          </div>
        </footer>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'bg-gray-800 text-white',
          duration: 4000,
        }}
      />
    </div>
  );
};

export default App;
