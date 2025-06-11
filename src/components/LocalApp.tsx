import { useNavigate } from 'react-router-dom';
import { useFlashcardsLocal } from '../hooks/useFlashcardsLocal';
import { LocalManagementMode } from './LocalManagementMode';

export function LocalApp() {
  const navigate = useNavigate();
  const { mode, cards } = useFlashcardsLocal();

  console.log('LocalApp: mode =', mode, 'cards.length =', cards.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hidden in study mode */}
      {mode !== 'study' && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Flash Card (Local Mode)
                </h1>
              </div>
              
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Switch to Cloud Mode
              </button>
            </div>
          </div>
        </header>
      )}

      <main>
        {mode === 'study' ? <LocalStudyMode /> : <LocalManagementMode />}
      </main>
    </div>
  );
}

// Local Study Mode component that uses useFlashcardsLocal
function LocalStudyMode() {
  const { 
    cards, 
    currentCard, 
    isFlipped, 
    setMode, 
    flipCard, 
    nextCard, 
    previousCard 
  } = useFlashcardsLocal();

  if (!currentCard || cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No cards to study</h2>
          <button
            onClick={() => setMode('management')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Cards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setMode('management')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Exit Study
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Local Mode Study
            </span>
          </div>

          <button
            onClick={flipCard}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            🔄 Flip
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-4xl h-full flex items-center justify-center">
          <div 
            onClick={flipCard}
            className="mx-auto h-96 w-full max-w-3xl bg-white rounded-lg shadow-lg border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition-shadow"
          >
            {!isFlipped ? (
              // Front side - Word
              <div className="h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{currentCard.word}</h1>
                {currentCard.pronunciation && (
                  <p className="text-lg text-gray-600 mb-2">{currentCard.pronunciation}</p>
                )}
                {currentCard.partOfSpeech && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {currentCard.partOfSpeech}
                  </span>
                )}
                <p className="text-gray-500 mt-8">Click to flip</p>
              </div>
            ) : (
              // Back side - Meaning
              <div className="h-full flex flex-col justify-center">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Meaning</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">{currentCard.meaning}</p>
                </div>
                
                {(currentCard.synonyms || currentCard.antonyms) && (
                  <div className="space-y-3 text-center">
                    {currentCard.synonyms && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Synonyms:</span> {currentCard.synonyms}
                      </p>
                    )}
                    {currentCard.antonyms && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Antonyms:</span> {currentCard.antonyms}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={previousCard}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-500">Space to flip • Arrow keys to navigate</span>
          <button
            onClick={nextCard}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
} 