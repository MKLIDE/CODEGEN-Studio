// Application configuration shared between frontend and backend
export interface AppConfig {
  appName: string;
  version: string;
  environment: 'development' | 'production' | 'test';
  
  // AI Configuration
  ai: {
    enabled: boolean;
    modelPath: string;
    contextSize: number;
    threads: number;
    maxTokens: number;
    temperature: number;
  };
  
  // Privacy Configuration
  privacy: {
    networkBlocking: boolean;
    telemetry: boolean;
    autoUpdates: boolean;
    encryptionEnabled: boolean;
  };
  
  // Path Configuration
  paths: {
    templates: string;
    projects: string;
    data: string;
    logs: string;
  };
  
  // UI Configuration
  ui: {
    theme: 'light' | 'dark' | 'system';
    editorFontSize: number;
    editorTabSize: number;
    editorWordWrap: boolean;
  };
}

export const defaultConfig: AppConfig = {
  appName: 'CodeGen Studio',
  version: '0.1.0',
  environment: 'development',
  
  ai: {
    enabled: false,
    modelPath: './resources/ai-models/codellama-7b-q4.gguf',
    contextSize: 4096,
    threads: 4,
    maxTokens: 512,
    temperature: 0.1
  },
  
  privacy: {
    networkBlocking: true,
    telemetry: false,
    autoUpdates: false,
    encryptionEnabled: true
  },
  
  paths: {
    templates: './java-backend/src/main/resources/templates',
    projects: './projects',
    data: './data',
    logs: './logs'
  },
  
  ui: {
    theme: 'dark',
    editorFontSize: 14,
    editorTabSize: 2,
    editorWordWrap: true
  }
};
