import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Project } from '@/types';
import { toast } from 'react-hot-toast';

export const useProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createProject = useCallback(async (
    name: string,
    template: string,
    path: string
  ): Promise<Project | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const project = await api.createProject(name, template, path);
      toast.success(`Project "${name}" created successfully`);
      return project;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      toast.error(`Failed to create project: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getProjectStructure = useCallback(async (projectPath: string) => {
    setLoading(true);
    
    try {
      const structure = await api.getProjectStructure(projectPath);
      return structure;
    } catch (err) {
      console.error('Failed to get project structure:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  const runProject = useCallback(async (projectPath: string) => {
    setLoading(true);
    
    try {
      const result = await api.runProject(projectPath);
      toast.success('Project started successfully');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run project';
      toast.error(`Failed to run project: ${errorMessage}`);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);
  
  const runTests = useCallback(async (projectPath: string) => {
    setLoading(true);
    
    try {
      const result = await api.runTests(projectPath);
      toast.success('Tests completed');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run tests';
      toast.error(`Failed to run tests: ${errorMessage}`);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);
  
  const scanProject = useCallback(async (projectPath: string) => {
    setLoading(true);
    
    try {
      const analysis = await api.scanProject(projectPath);
      return analysis;
    } catch (err) {
      console.error('Failed to scan project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const openInExplorer = useCallback(async (path: string) => {
    try {
      await api.openProjectFolder(path);
    } catch (err) {
      console.error('Failed to open folder:', err);
    }
  }, []);
  
  return {
    createProject,
    getProjectStructure,
    runProject,
    runTests,
    scanProject,
    openInExplorer,
    loading,
    error,
  };
};
