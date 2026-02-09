// Re-export all shared types
export * from '../config/app-config';
export * from '../schemas/project-schema';

// Common utility types
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

// Platform types
export type Platform = 'windows' | 'macos' | 'linux';

// File system types
export interface FileInfo {
  path: string;
  name: string;
  size: number;
  isDirectory: boolean;
  modified: Date;
  created: Date;
}

export interface DirectoryTree {
  path: string;
  name: string;
  children: Array<FileInfo | DirectoryTree>;
}

// Privacy status types
export interface PrivacyStatus {
  networkBlocked: boolean;
  localProcessing: boolean;
  encryptedStorage: boolean;
  telemetryDisabled: boolean;
  vulnerabilities: string[];
  lastChecked: Date;
}

// System info types
export interface SystemInfo {
  platform: Platform;
  os: string;
  arch: string;
  cpuCores: number;
  totalMemory: number;
  freeMemory: number;
  rustVersion: string;
  nodeVersion: string;
  javaVersion?: string;
}

// AI model types
export interface AIModel {
  name: string;
  path: string;
  size: number;
  format: string;
  loaded: boolean;
  contextSize: number;
  parameters: number;
}
