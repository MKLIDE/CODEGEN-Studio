export interface Project {
  id: string;
  name: string;
  path: string;
  template: string;
  language: string;
  framework?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  language: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
  children?: FileNode[];
}

export interface AIRequest {
  prompt: string;
  context?: string;
  language: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  code: string;
  explanation: string;
  alternatives: string[];
  confidence: number;
}

export interface PrivacyStatus {
  networkBlocked: boolean;
  localProcessing: boolean;
  encryptedStorage: boolean;
  telemetryDisabled: boolean;
  vulnerabilities: string[];
}

export interface SystemInfo {
  os: string;
  arch: string;
  memoryGB: number;
  privacyStatus: string;
  aiLoaded: boolean;
  javaRunning: boolean;
  version: string;
  platform: string;
}

export interface CodeIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  line: number;
  column: number;
  suggestion?: string;
}

export interface CodeAnalysis {
  issues: CodeIssue[];
  suggestions: string[];
  complexity: number;
  securityScore: number;
}
