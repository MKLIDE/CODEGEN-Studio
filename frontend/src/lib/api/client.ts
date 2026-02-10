import { invoke } from '@tauri-apps/api/tauri';
import { AIRequest, AIResponse, Project, Template, SystemInfo, CodeAnalysis } from '@/types';

class ApiClient {
  // Project methods
  async createProject(name: string, template: string, path: string): Promise<Project> {
    return await invoke('create_new_project', { name, template, path });
  }

  async getProjectStructure(projectPath: string): Promise<string[]> {
    return await invoke('get_project_structure', { projectPath });
  }

  async runProject(projectPath: string): Promise<string> {
    return await invoke('run_project', { projectPath });
  }

  async runTests(projectPath: string): Promise<string> {
    return await invoke('run_tests', { projectPath });
  }

  // AI methods
  async getAISuggestion(request: AIRequest): Promise<string> {
    return await invoke('get_ai_suggestion', { aiRequest: request });
  }

  async checkAIStatus(): Promise<string> {
    return await invoke('check_ai_status');
  }

  async loadAIModel(modelPath: string): Promise<boolean> {
    return await invoke('load_ai_model', { modelPath });
  }

  // System methods
  async getSystemInfo(): Promise<SystemInfo> {
    return await invoke('get_system_info');
  }

  async checkPrivacyStatus(): Promise<string[]> {
    return await invoke('check_privacy_status');
  }

  // File methods
  async saveFile(path: string, content: string): Promise<void> {
    return await invoke('save_file', { path, content });
  }

  async loadFile(path: string): Promise<string> {
    return await invoke('load_file', { path });
  }

  // Template methods
  async listTemplates(): Promise<Template[]> {
    return await invoke('list_templates');
  }

  // Code analysis
  async scanProject(projectPath: string): Promise<CodeAnalysis> {
    return await invoke('scan_project', { projectPath });
  }

  // Utility methods
  async openProjectFolder(path: string): Promise<void> {
    return await invoke('open_project_folder', { path });
  }

  async encryptFile(path: string, key: string): Promise<boolean> {
    return await invoke('encrypt_file', { path, key });
  }

  async decryptFile(path: string, key: string): Promise<boolean> {
    return await invoke('decrypt_file', { path, key });
  }
}
export { ApiClient };
export const api = new ApiClient();
export default api;
