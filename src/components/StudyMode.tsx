import { useEffect, useState } from 'react';
import { X, RotateCcw, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Flashcard } from './Flashcard';
import { useKeyboard } from '../hooks/useKeyboard';
import { isTouchDevice } from '../utils';
import type { FlashcardData } from '../types';

interface StudyModeProps {
  flashcards?: FlashcardData[];
}

export function StudyMode({ flashcards = [] }: StudyModeProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [viewedHistory, setViewedHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isTouch = isTouchDevice();

  const currentCard = flashcards[currentIndex];

  // If no cards available, show no cards message (but don't redirect, let StudyPage handle that)
  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No cards to study</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Cards
          </button>
        </div>
      </div>
    );
  }

  // Navigation functions
  const handleFlip = () => setIsFlipped(!isFlipped);
  
  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      addToHistory(currentCard.id);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      addToHistory(currentCard.id);
    }
  };

  const addToHistory = (cardId: string) => {
    setViewedHistory(prev => {
      const newHistory = [...prev];
      if (newHistory[newHistory.length - 1] !== cardId) {
        newHistory.push(cardId);
      }
      return newHistory;
    });
    setHistoryIndex(-1);
  };

  // Keyboard shortcuts
  useKeyboard({
    ' ': handleFlip,
    'ArrowLeft': handlePrevious,
    'ArrowRight': handleNext,
    'Escape': () => navigate('/'),
    'h': () => setShowHistory(!showHistory),
  });

  // Touch gestures
  useEffect(() => {
    if (!isTouch) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          handleNext(); // Swipe left = next
        } else {
          handlePrevious(); // Swipe right = previous
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleNext, handlePrevious, isTouch]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Exit Study</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {currentIndex + 1} of {flashcards.length}
            </span>
            
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline">History (h)</span>
            </button>
            
            <button
              onClick={handleFlip}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="hidden sm:inline">Flip (space)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 min-h-0 relative overflow-hidden">
        <div className="w-full max-w-4xl h-full flex items-center justify-center">
          <Flashcard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            className="mx-auto h-[32rem] w-full max-w-3xl"
          />
        </div>

        {/* History Overlay Panel */}
        {showHistory && viewedHistory.length > 0 && (
          <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Recently Viewed ({viewedHistory.length})
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              {viewedHistory.slice().reverse().map((cardId, index) => {
                const card = flashcards.find(c => c.id === cardId);
                const isCurrentCard = historyIndex === viewedHistory.length - 1 - index;
                
                if (!card) return null;
                
                return (
                  <div
                    key={cardId}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
                      isCurrentCard 
                        ? 'bg-blue-50 border-blue-200 text-blue-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium truncate text-sm">{card.word}</div>
                    <div className="text-xs opacity-75 truncate mt-1">
                      {card.meaning.slice(0, 80)}...
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}