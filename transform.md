# Transform Your App to React Router: Complete Implementation Guide

This guide provides the exact code changes needed to transform a single-page React app into a multi-page application using React Router. Follow these steps in order.

## 🚀 Step 1: Install Dependencies

```bash
npm install react-router-dom
npm install -D @types/react-router-dom  # If using TypeScript
```

## 📁 Step 2: Create Page Structure

First, create the pages directory structure:

```bash
mkdir src/pages
```

### Create LoginPage.tsx

```tsx
// src/pages/LoginPage.tsx
import { SignIn, useUser } from '@clerk/clerk-react';
import { Navigate, Link } from 'react-router-dom';

export function LoginPage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FlashCard App</h1>
          <p className="text-gray-600">Sign in to sync your flashcards across devices</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SignIn 
            routing="hash"
            signUpUrl="/login"
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Or try without signing in</p>
          <Link 
            to="/local" 
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Use Local Mode
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Create ManagementPage.tsx

```tsx
// src/pages/ManagementPage.tsx
import { useEffect } from 'react';
import { ManagementMode } from '../components/ManagementMode';
import { useFlashcardsCloud } from '../hooks/useFlashcardsCloud';

export function ManagementPage() {
  const { fetchFlashcards, loading, error } = useFlashcardsCloud();

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading flashcards: {error}</p>
          <button 
            onClick={() => fetchFlashcards()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <ManagementMode />;
}
```

### Create StudyPage.tsx

```tsx
// src/pages/StudyPage.tsx
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { StudyMode } from '../components/StudyMode';
import { useFlashcardsCloud } from '../hooks/useFlashcardsCloud';

export function StudyPage() {
  const { flashcards, fetchFlashcards, loading, error } = useFlashcardsCloud();

  useEffect(() => {
    if (flashcards.length === 0) {
      fetchFlashcards();
    }
  }, [flashcards.length, fetchFlashcards]);

  // Redirect to management if no cards
  if (!loading && flashcards.length === 0) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing study session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading flashcards: {error}</p>
          <button 
            onClick={() => fetchFlashcards()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <StudyMode />;
}
```

## 🔧 Step 3: Create AuthGuard Component

```tsx
// src/components/AuthGuard.tsx
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

## 🏗️ Step 4: Transform main.tsx

Replace your existing `main.tsx` with:

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import { ManagementPage } from './pages/ManagementPage.tsx';
import { StudyPage } from './pages/StudyPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { LocalApp } from './components/LocalApp.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ),
    children: [
      { index: true, element: <ManagementPage /> },
      { path: "manage", element: <ManagementPage /> },
      { path: "study", element: <StudyPage /> },
    ],
  },
  {
    path: "/login",
    element: (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <LoginPage />
      </ClerkProvider>
    ),
  },
  {
    path: "/local",
    element: <LocalApp />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

## 🔄 Step 5: Transform App.tsx

Replace your existing `App.tsx` with:

```tsx
// src/App.tsx
import { Outlet } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';

export default function App() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </AuthGuard>
  );
}
```

## 🧹 Step 6: Update useFlashcardsCloud Hook

Remove the mode state and related functions:

```tsx
// src/hooks/useFlashcardsCloud.ts
import { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Flashcard } from '../types/flashcard';
import { supabase } from '../config/supabase';

export function useFlashcardsCloud() {
  const { user, isSignedIn } = useUser();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Flashcard[]>([]);

  // Remove these lines:
  // const [mode, setMode] = useState<'study' | 'management'>('management');

  const fetchFlashcards = useCallback(async () => {
    if (!isSignedIn || !user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlashcards(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flashcards');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, user]);

  // ... rest of your existing functions ...

  return {
    flashcards,
    loading,
    error,
    recentlyViewed,
    fetchFlashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    addToHistory,
    // Remove: mode, setMode
  };
}
```

## 🧭 Step 7: Update Navigation in Components

### Update ManagementMode.tsx

Replace mode switching with navigation:

```tsx
// In src/components/ManagementMode.tsx
import { useNavigate } from 'react-router-dom';

export function ManagementMode() {
  const navigate = useNavigate();
  const { flashcards } = useFlashcardsCloud();

  const handleStartStudy = () => {
    if (flashcards.length === 0) {
      alert('Please add some flashcards first!');
      return;
    }
    navigate('/study');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Your existing JSX */}
      <button
        onClick={handleStartStudy}
        disabled={flashcards.length === 0}
        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg"
      >
        Start Study Session ({flashcards.length} cards)
      </button>
      {/* Rest of your component */}
    </div>
  );
}
```

### Update StudyMode.tsx

Add navigation back to management:

```tsx
// In src/components/StudyMode.tsx
import { useNavigate } from 'react-router-dom';

export function StudyMode() {
  const navigate = useNavigate();

  const handleBackToManagement = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={handleBackToManagement}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Management
        </button>
      </div>
      {/* Your existing StudyMode JSX */}
    </div>
  );
}
```

## 🎯 Step 8: Add Navigation Header (Optional)

Create a reusable navigation component:

```tsx
// src/components/Navigation.tsx
import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <Link
              to="/"
              className={`font-medium ${
                location.pathname === '/' || location.pathname === '/manage'
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Manage Cards
            </Link>
            <Link
              to="/study"
              className={`font-medium ${
                location.pathname === '/study'
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Study Mode
            </Link>
          </div>
          <UserButton afterSignOutUrl="/login" />
        </div>
      </div>
    </nav>
  );
}
```

Then add it to your App.tsx:

```tsx
// src/App.tsx
import { Outlet } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';
import { Navigation } from './components/Navigation';

export default function App() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Outlet />
      </div>
    </AuthGuard>
  );
}
```

## ✅ Verification Steps

1. **Test URL Navigation**: Visit `/`, `/study`, `/login`, `/local` directly
2. **Test Browser History**: Use back/forward buttons
3. **Test Authentication Flow**: Sign out and ensure redirect to `/login`
4. **Test Local Mode**: Ensure `/local` works without authentication
5. **Test Deep Linking**: Share URLs with friends

## 🚀 Next Steps: Adding New Pages

### Adding a Settings Page

1. Create `src/pages/SettingsPage.tsx`
2. Add route in `main.tsx`: `{ path: "settings", element: <SettingsPage /> }`
3. Add navigation link in `Navigation.tsx`

```tsx
// Example SettingsPage.tsx
export function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      {/* Your settings form here */}
    </div>
  );
}
```

Your app is now successfully transformed to use React Router! 🎉 