// src/lib/mock-tauri.ts
// This makes your app work in browser without Tauri

declare global {
  interface Window {
    __TAURI__?: {
      invoke: (command: string, args?: any) => Promise<any>;
    };
  }
}

const mockResponses = {
  get_ai_suggestion: (args: any) => {
    const { prompt, language } = args?.request || {};
    return \`// AI Generated Code for: \${prompt}
// Language: \${language}

function solution() {
  console.log("Hello from CodeGen Studio!");
  // Your code here
  return "result";
}\`;
  },
  
  get_system_info: () => ({
    os: navigator.platform,
    arch: 'x64',
    memory_gb: 16,
    privacy_status: '🔒 Browser Mode',
    ai_loaded: true,
    java_running: false,
    version: '0.1.0',
    platform: 'web'
  }),
  
  create_new_project: (args: any) => \`./projects/\${args?.name || 'new-project'}\`,
  
  list_templates: () => [
    { id: 'react-ts', name: 'React + TypeScript', description: 'Frontend app', tags: ['frontend'], difficulty: 'beginner' },
    { id: 'node-express', name: 'Node.js Express', description: 'Backend API', tags: ['backend'], difficulty: 'intermediate' }
  ]
};

// Create mock Tauri API
const mockTauri = {
  invoke: async (command: string, args?: any): Promise<any> => {
    console.log(\`[Mock Tauri] \${command}\`, args);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (mockResponses[command as keyof typeof mockResponses]) {
      return mockResponses[command as keyof typeof mockResponses](args);
    }
    
    console.warn(\`[Mock Tauri] Unknown command: \${command}\`);
    return null;
  }
};

// Inject into window if Tauri isn't available
if (!window.__TAURI__) {
  window.__TAURI__ = { invoke: mockTauri.invoke };
  console.log('✅ Mock Tauri API injected for browser development');
}

export default mockTauri;
