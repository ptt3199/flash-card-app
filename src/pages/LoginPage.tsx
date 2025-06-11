import { SignIn, useUser } from '@clerk/clerk-react'
import { Navigate, Link } from 'react-router-dom'

export function LoginPage() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (isSignedIn) {
    return <Navigate to="/" replace />
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