// Application constants
export const APP_NAME = 'CodeGen Studio';
export const APP_VERSION = '0.1.0';
export const APP_DESCRIPTION = 'Privacy-first development environment with AI assistance';

// Template constants
export const TEMPLATES = [
  {
    id: 'react-ts',
    name: 'React + TypeScript',
    description: 'Modern React app with TypeScript, Vite, and Tailwind CSS',
    language: 'typescript',
    framework: 'react',
    tags: ['frontend', 'react', 'typescript', 'vite'],
    difficulty: 'beginner' as const,
  },
  {
    id: 'node-express',
    name: 'Node.js + Express',
    description: 'REST API backend with Express.js and MongoDB support',
    language: 'javascript',
    framework: 'node',
    tags: ['backend', 'node', 'express', 'api'],
    difficulty: 'intermediate' as const,
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    description: 'Java Spring Boot REST API with PostgreSQL database',
    language: 'java',
    framework: 'spring',
    tags: ['backend', 'java', 'spring', 'rest'],
    difficulty: 'intermediate' as const,
  },
  {
    id: 'react-native',
    name: 'React Native',
    description: 'Cross-platform mobile app with Expo framework',
    language: 'javascript',
    framework: 'react-native',
    tags: ['mobile', 'react', 'expo', 'cross-platform'],
    difficulty: 'intermediate' as const,
  },
  {
    id: 'vanilla-js',
    name: 'Vanilla JavaScript',
    description: 'Simple HTML/CSS/JavaScript project without frameworks',
    language: 'javascript',
    framework: 'vanilla',
    tags: ['frontend', 'html', 'css', 'javascript'],
    difficulty: 'beginner' as const,
  },
];

// AI model constants
export const AI_MODELS = [
  {
    name: 'codellama-7b-q4',
    filename: 'codellama-7b-q4.gguf',
    size: '4.8GB',
    description: 'CodeLlama 7B for multi-language code completion',
    languages: ['javascript', 'typescript', 'python', 'java', 'rust', 'go', 'cpp'],
  },
  {
    name: 'starcoder2-3b-q4',
    filename: 'starcoder2-3b-q4.gguf',
    size: '2.1GB',
    description: 'StarCoder2 3B for fast code suggestions',
    languages: ['python', 'javascript', 'java', 'go', 'rust'],
  },
  {
    name: 'deepseek-coder-1.3b-q4',
    filename: 'deepseek-coder-1.3b-q4.gguf',
    size: '0.8GB',
    description: 'DeepSeek Coder 1.3B lightweight model',
    languages: ['python', 'javascript', 'java'],
  },
];

// Privacy constants
export const PRIVACY_STATUS = {
  NETWORK_BLOCKED: '🔒 Network blocked',
  LOCAL_AI: '🤖 Local AI processing',
  ENCRYPTED_STORAGE: '📁 Encrypted storage',
  NO_TELEMETRY: '📊 No telemetry',
  MEMORY_PROTECTION: '🛡️ Memory protection',
  AUDIT_LOGGING: '📝 Audit logging',
};

// Path constants
export const PATHS = {
  PROJECTS: './projects',
  DATA: './data',
  LOGS: './logs',
  TEMPLATES: './java-backend/src/main/resources/templates',
  AI_MODELS: './resources/ai-models',
  JVM: './resources/jvm',
};

// Feature flags
export const FEATURES = {
  AI_ENABLED: true,
  JAVA_ENABLED: true,
  TEMPLATES_ENABLED: true,
  PRIVACY_ENABLED: true,
  ENCRYPTION_ENABLED: true,
};

// UI constants
export const UI = {
  THEMES: ['light', 'dark', 'system'] as const,
  EDITOR_FONT_SIZES: [12, 14, 16, 18, 20],
  EDITOR_TAB_SIZES: [2, 4, 8],
  DEFAULT_THEME: 'dark' as const,
  DEFAULT_FONT_SIZE: 14,
  DEFAULT_TAB_SIZE: 2,
};

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SAVE: 'Ctrl+S',
  SAVE_ALL: 'Ctrl+Shift+S',
  NEW_FILE: 'Ctrl+N',
  OPEN_FILE: 'Ctrl+O',
  FIND: 'Ctrl+F',
  REPLACE: 'Ctrl+H',
  AI_SUGGESTION: 'Ctrl+Space',
  RUN_PROJECT: 'F5',
  RUN_TESTS: 'Ctrl+F5',
  TOGGLE_TERMINAL: 'Ctrl+`',
  TOGGLE_SIDEBAR: 'Ctrl+B',
  FORMAT_CODE: 'Shift+Alt+F',
};
