import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('main.tsx: Starting React render');
const rootElement = document.getElementById('root');
console.log('main.tsx: Root element found:', rootElement);

try {
  if (!rootElement) {
    throw new Error('Root element not found!');
  }

  const root = ReactDOM.createRoot(rootElement);
  console.log('main.tsx: Root created successfully');

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );

  console.log('main.tsx: Render complete');
} catch (error) {
  console.error('main.tsx: Error during rendering:', error);
  if (rootElement) {
    rootElement.innerHTML = '<div style="color: #ef4444; padding: 20px;"><h1>Error Loading App</h1><p>' + (error instanceof Error ? error.message : String(error)) + '</p></div>';
  }
}

