import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider }  from 'react-router-dom'
import { LoginPage } from './pages/LoginPage.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { StudyPage } from './pages/StudyPage.tsx'
import { ManagementPage } from './pages/ManagementPage.tsx'
import { LocalApp } from './components/LocalApp.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ),
    children: [
      { index: true, element: <ManagementPage /> },
      { path: 'manage', element: <ManagementPage /> },
      { path: 'study', element: <StudyPage /> },
    ]
  },
  { 
    path: '/login', 
    element: (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <LoginPage />
      </ClerkProvider>
    )
  },
  { 
    path: '/local', 
    element: <LocalApp />
  }, // Local/trial mode
  // { path: '/settings', element: <SettingsPage /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
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
