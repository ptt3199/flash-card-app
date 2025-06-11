// import { ClerkProvider } from '@clerk/clerk-react';
// import { StudyMode } from './components/StudyMode';
// import { ManagementMode } from './components/ManagementMode';
// import { AuthButton } from './components/AuthButton';
// import { useFlashcardsCloud } from './hooks/useFlashcardsCloud';
// import { isClerkConfigured } from './config/auth';
// import { isSupabaseConfigured } from './config/supabase';
import { Outlet, useOutletContext } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';
import { Navigation } from './components/Navigation';
import { useFlashcardsCloud } from './hooks/useFlashcardsCloud';
import { isClerkConfigured } from './config/auth';
import { isSupabaseConfigured } from './config/supabase';

// function AppContent() {
//   const {
//     cards,
//     currentIndex,
//     mode,
//     isFlipped,
//     currentCard,
//     hasCards,
//     isLoading,
//     error,
//     user,
//     viewedHistory,
//     historyIndex,
//     addCard,
//     updateCard,
//     deleteCard,
//     setMode,
//     flipCard,
//     nextCard,
//     previousCard,
//     clearError,
//   } = useFlashcardsCloud();

//   // Show configuration warning if services are not configured
//   if (!isClerkConfigured() || !isSupabaseConfigured()) {
//   return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
//           <div className="text-center">
//             <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//             <h1 className="text-xl font-bold text-gray-900 mb-2">
//               Configuration Required
//             </h1>
//             <p className="text-gray-600 mb-6">
//               Please configure your environment variables to use authentication and cloud storage.
//             </p>
            
//             <div className="space-y-3 text-left">
//               {!isClerkConfigured() && (
//                 <div className="flex items-center gap-2 text-sm text-red-600">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                   <span>VITE_CLERK_PUBLISHABLE_KEY is missing</span>
//                 </div>
//               )}
//               {!isSupabaseConfigured() && (
//                 <div className="flex items-center gap-2 text-sm text-red-600">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                   <span>Supabase configuration is missing</span>
//                 </div>
//               )}
//             </div>

//             <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
//               <p className="text-xs text-gray-600 font-mono">
//                 Create .env.local file with:<br/>
//                 VITE_CLERK_PUBLISHABLE_KEY=pk_...<br/>
//                 VITE_SUPABASE_URL=https://...<br/>
//                 VITE_SUPABASE_ANON_KEY=eyJ...
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your flashcards...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header - Hidden in study mode */}
//       {!(mode === 'study' && hasCards && currentCard) && (
//         <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <h1 className="text-xl font-semibold text-gray-900">
//                 Flash Card
//               </h1>
//               {user && (
//                 <span className="ml-4 text-sm text-gray-500">
//                   {hasCards ? `${mode === 'study' ? 'Study' : 'Manage'} Mode` : 'Getting Started'}
//                 </span>
//               )}
//             </div>
            
//             <div className="flex items-center gap-4">
//               {hasCards && (
//                 <nav className="flex gap-2">
//                   <button
//                     onClick={() => setMode('study')}
//                     className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                       mode === 'study'
//                         ? 'bg-blue-600 text-white'
//                         : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
//                     }`}
//                   >
//                     Study
//                   </button>
//                   <button
//                     onClick={() => setMode('management')}
//                     className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                       mode === 'management'
//                         ? 'bg-blue-600 text-white'
//                         : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
//                     }`}
//                   >
//                     Manage
//                   </button>
//                 </nav>
//               )}
//               <AuthButton />
//             </div>
//           </div>
//         </div>
//       </header>
//       )}

//       {/* Error Display */}
//       {error && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
//           <div className="bg-red-50 border border-red-200 rounded-md p-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-800">{error}</p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <button
//                   onClick={clearError}
//                   className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
//                 >
//                   <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       {mode === 'study' && hasCards && currentCard ? (
//         <StudyMode
//           cards={cards}
//           currentIndex={currentIndex}
//           isFlipped={isFlipped}
//           viewedHistory={viewedHistory}
//           historyIndex={historyIndex}
//           onFlip={flipCard}
//           onNext={nextCard}
//           onPrevious={previousCard}
//           onExit={() => setMode('management')}
//         />
//       ) : (
//         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <ManagementMode
//             cards={cards}
//             onAddCard={addCard}
//             onUpdateCard={updateCard}
//             onDeleteCard={deleteCard}
//             onStartStudy={() => setMode('study')}
//             isLoading={isLoading}
//           />
//         </main>
//       )}
//     </div>
//   );
// }

export type FlashcardsContextType = ReturnType<typeof useFlashcardsCloud>;
export const useFlashcardsContext = () => useOutletContext<FlashcardsContextType>();

export default function App() {
  const flashcardsData = useFlashcardsCloud();
  const { flashcards, loading, error, clearError } = flashcardsData;

  // Show configuration warning if services are not configured
  if (!isClerkConfigured() || !isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-8 border border-red-200">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration Required</h1>
            <div className="text-left space-y-4">
              <p className="text-gray-700">
                This application requires both authentication and database services to be configured:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Missing Configuration:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  {!isClerkConfigured() && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      Clerk (Authentication) - Missing VITE_CLERK_PUBLISHABLE_KEY
                    </li>
                  )}
                  {!isSupabaseConfigured() && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      Supabase (Database) - Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Setup Instructions:</h3>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Copy <code className="bg-blue-100 px-1 rounded">.env.example</code> to <code className="bg-blue-100 px-1 rounded">.env</code></li>
                  <li>Fill in your Clerk and Supabase configuration values</li>
                  <li>Restart the development server</li>
                </ol>
              </div>

              <p className="text-sm text-gray-500">
                See the README.md file for detailed setup instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navigation flashcards={flashcards} />
        
        {/* Main loading indicator for initial fetch */}
        {loading && flashcards.length === 0 ? (
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your flashcards...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Error Display */}
            {error && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                    <div className="ml-auto pl-3">
                      <button onClick={clearError} className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Outlet context={flashcardsData} />
          </>
        )}
      </div>
    </AuthGuard>
  );
}
