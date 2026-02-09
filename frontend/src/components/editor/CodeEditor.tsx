import React from 'react';
import Editor from '@monaco-editor/react';
import { useAppStore } from '@/stores/app-store';

interface CodeEditorProps {
  path?: string;
  language?: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  path = 'untitled.js',
  language = 'javascript',
  value,
  onChange,
  readOnly = false,
}) => {
  const { theme } = useAppStore();
  
  const detectLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'json': 'json',
      'html': 'html',
      'css': 'css',
      'py': 'python',
      'java': 'java',
      'rs': 'rust',
      'go': 'go',
      'cpp': 'cpp',
      'c': 'c',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml',
      'toml': 'toml',
      'xml': 'xml',
      'sql': 'sql',
    };
    
    return languageMap[ext || ''] || 'plaintext';
  };
  
  const editorLanguage = language === 'auto' ? detectLanguage(path) : language;
  
  return (
    <div className="h-full w-full">
      <div className="h-8 bg-gray-900 border-b border-gray-800 flex items-center px-4 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="ml-4">{path}</div>
      </div>
      
      <Editor
        height="calc(100% - 2rem)"
        language={editorLanguage}
        value={value}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onChange={(newValue) => onChange(newValue || '')}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabSize: 2,
          insertSpaces: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
        }}
        onMount={(editor, monaco) => {
          // Custom editor setup
          editor.focus();
          
          // Add custom shortcuts
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            console.log('Save triggered from editor');
          });
          
          // Add AI suggestion command
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
            console.log('AI suggestion requested');
          });
        }}
      />
    </div>
  );
};

export default CodeEditor;
