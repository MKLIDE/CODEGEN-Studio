import { create } from 'zustand';
import { Project, Template, FileNode, PrivacyStatus, SystemInfo } from '@/types';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Projects
  projects: Project[];
  currentProject: Project | null;
  projectFiles: FileNode[];
  
  // Templates
  templates: Template[];
  
  // AI
  aiEnabled: boolean;
  aiModelLoaded: boolean;
  
  // Privacy
  privacyStatus: PrivacyStatus | null;
  
  // System
  systemInfo: SystemInfo | null;
  
  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setProjectFiles: (files: FileNode[]) => void;
  setTemplates: (templates: Template[]) => void;
  setAiEnabled: (enabled: boolean) => void;
  setAiModelLoaded: (loaded: boolean) => void;
  setPrivacyStatus: (status: PrivacyStatus) => void;
  setSystemInfo: (info: SystemInfo) => void;
  
  // Computed
  isProjectOpen: () => boolean
  getFileCount: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  sidebarOpen: true,
  theme: 'dark',
  projects: [],
  currentProject: null,
  projectFiles: [],
  templates: [],
  aiEnabled: false,
  aiModelLoaded: false,
  privacyStatus: null,
  systemInfo: null,
  
  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setProjectFiles: (files) => set({ projectFiles: files }),
  setTemplates: (templates) => set({ templates }),
  setAiEnabled: (enabled) => set({ aiEnabled: enabled }),
  setAiModelLoaded: (loaded) => set({ aiModelLoaded: loaded }),
  setPrivacyStatus: (status) => set({ privacyStatus: status }),
  setSystemInfo: (info) => set({ systemInfo: info }),
  
  // Computed
  isProjectOpen: () => get().currentProject !== null,
  getFileCount: () => {
    const files = get().projectFiles;
    let count = 0;
    
    const countFiles = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'file') {
          count++;
        }
        if (node.children) {
          countFiles(node.children);
        }
      });
    };
    
    countFiles(files);
    return count;
  },
}));
