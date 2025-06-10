import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { AuthButton } from './AuthButton';
import { LocalApp } from './LocalApp';
import { BookOpen, Star, Brain, Zap, ExternalLink, Users, Database, Shield } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [useLocalMode, setUseLocalMode] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user chose local mode, show LocalApp
  if (useLocalMode && !isSignedIn) {
    return <LocalApp onBackToLogin={() => setUseLocalMode(false)} />;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Sign-in Landing Page */}
        <div className="relative">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-100 rounded-full opacity-10"></div>
          </div>

          {/* Main Content */}
          <div className="relative max-w-6xl mx-auto px-4 py-16">
            <div className="text-center">
              {/* Animated icon group */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <BookOpen className="w-20 h-20 text-blue-500 mx-auto" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                Welcome to <span className="text-blue-600">Flash Card</span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Smart language learning made simple. Create flashcards with automatic definitions, 
                pronunciations, and examples to accelerate your vocabulary growth.
              </p>

              {/* Usage Options Cards */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                {/* Local Storage Option */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Try Instantly</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    Start learning right away with local storage. Perfect for quick experimentation 
                    and trying out the features without creating an account.
                  </p>
                  <div className="flex items-center justify-center text-sm text-blue-600 mb-4">
                    <Database className="w-4 h-4 mr-1" />
                    <span>Saved on this device</span>
                  </div>
                  <button 
                    onClick={() => setUseLocalMode(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Without Account
                  </button>
                </div>

                {/* Cloud Storage Option - Enhanced */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Sign In & Sync
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Recommended</span>
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    Create an account to sync across devices, backup your progress, 
                    and never lose your learning journey. Secure cloud storage included.
                  </p>
                  <div className="flex items-center justify-center text-sm text-blue-700 mb-4">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Cloud synchronized</span>
                  </div>
                  <div className="space-y-3">
                    <AuthButton />
                    <p className="text-xs text-gray-500">
                      Your flashcards will be synced across all devices
                    </p>
                  </div>
                </div>
              </div>

              {/* Portfolio Link */}
              <div className="mb-12">
                <a
                  href="https://your-portfolio-website.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  Learn More About This Project
                </a>
              </div>

              {/* Features Grid */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
                <h3 className="text-2xl font-semibold text-gray-800 mb-8">What makes this special?</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Auto-Complete</h4>
                    <p className="text-sm text-gray-600">Smart word suggestions as you type</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">AI-Powered</h4>
                    <p className="text-sm text-gray-600">Definitions and examples from Gemini</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Voice Support</h4>
                    <p className="text-sm text-gray-600">Pronunciation with text-to-speech</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Cross-Device</h4>
                    <p className="text-sm text-gray-600">Sync across all your devices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 