import React, { useState } from 'react';
import { FiSend, FiCpu, FiDownload, FiSettings } from 'react-icons/fi';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const AIPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [context, setContext] = useState('javascript');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);

    try {
      const result = await api.getAISuggestion({
        prompt,
        context: 'Generate code based on prompt',
        language: context,
      });

      setResponse(result);
      toast.success('AI suggestion generated!');
    } catch (error) {
      toast.error('Failed to get AI suggestion');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadModel = async () => {
    try {
      const success = await api.loadAIModel('./resources/ai-models/codellama-7b-q4.gguf');
      if (success) {
        toast.success('AI model loaded successfully');
      } else {
        toast.error('Failed to load AI model');
      }
    } catch (error) {
      toast.error('Error loading AI model');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiCpu className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
              <p className="text-sm text-gray-400">Get code suggestions and fixes</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLoadModel}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              <span>Load Model</span>
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <FiSettings className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-300">AI: Ready</span>
          </div>
          <div className="text-sm text-gray-400">
            Model: <span className="text-gray-300">codellama-7b-q4</span>
          </div>
          <div className="text-sm text-gray-400">
            Context: <span className="text-gray-300">{context}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Input Section */}
        <div className="w-1/2 border-r border-gray-800 p-4 flex flex-col">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-300 mb-2">What do you need?</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Language Context</label>
                <select
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what code you want to generate..."
                  className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white resize-none"
                  disabled={loading}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FiSend className="w-4 h-4" />
                  <span>{loading ? 'Generating...' : 'Generate Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrompt('Create a React component that...')}
                  className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Example
                </button>
              </div>
            </form>

            {/* Quick Prompts */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Quick Prompts</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Create a login form',
                  'Write API endpoint',
                  'Fix this bug',
                  'Optimize function',
                  'Add error handling',
                ].map((quickPrompt) => (
                  <button
                    key={quickPrompt}
                    onClick={() => setPrompt(quickPrompt)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    {quickPrompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="w-1/2 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Generated Code</h3>
            <button
              onClick={() => navigator.clipboard.writeText(response)}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
              disabled={!response}
            >
              Copy
            </button>
          </div>

          <div className="flex-1 bg-gray-950 rounded-lg p-4 overflow-auto">
            {response ? (
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {response}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FiCpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a prompt to generate code</p>
                  <p className="text-sm mt-2">AI suggestions will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {response && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div>Characters: {response.length}</div>
                <div>Lines: {response.split('\n').length}</div>
                <div>Generated: Just now</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
