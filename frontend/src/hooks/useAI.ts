import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { AIRequest } from '@/types';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<string>('');
  
  const generateCode = useCallback(async (request: AIRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getAISuggestion(request);
      setLastResponse(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate code';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getCompletion = useCallback(async (partialCode: string, language: string) => {
    setLoading(true);
    
    try {
      const response = await api.getAISuggestion({
        prompt: `Complete this ${language} code: ${partialCode}`,
        language,
        maxTokens: 100,
      });
      
      return response;
    } catch (err) {
      console.error('Completion failed:', err);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);
  
  const analyzeCode = useCallback(async (code: string, language: string) => {
    setLoading(true);
    
    try {
      const response = await api.getAISuggestion({
        prompt: `Analyze this ${language} code for issues and improvements: ${code}`,
        language,
        maxTokens: 200,
      });
      
      return response;
    } catch (err) {
      console.error('Analysis failed:', err);
      return 'Analysis unavailable';
    } finally {
      setLoading(false);
    }
  }, []);
  
  const checkAIStatus = useCallback(async () => {
    try {
      const status = await api.checkAIStatus();
      return status.includes('Ready');
    } catch {
      return false;
    }
  }, []);
  
  const loadModel = useCallback(async (modelPath: string) => {
    setLoading(true);
    
    try {
      const success = await api.loadAIModel(modelPath);
      return success;
    } catch (err) {
      console.error('Model loading failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    generateCode,
    getCompletion,
    analyzeCode,
    checkAIStatus,
    loadModel,
    loading,
    error,
    lastResponse,
  };
};
