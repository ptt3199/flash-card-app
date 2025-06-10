import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Main app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Stagewise toolbar (development only)
if (process.env.NODE_ENV === 'development') {
  import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
    const stagewiseConfig = {
      plugins: []
    };

    // Create separate container for toolbar
    const toolbarContainer = document.createElement('div');
    toolbarContainer.id = 'stagewise-toolbar';
    document.body.appendChild(toolbarContainer);

    // Render toolbar in separate React root
    const toolbarRoot = createRoot(toolbarContainer);
    toolbarRoot.render(<StagewiseToolbar config={stagewiseConfig} />);
  }).catch(() => {
    // Silently fail if package is not available
  });
}
