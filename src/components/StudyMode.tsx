import { useEffect, useState } from 'react';
import { X, RotateCcw, History } from 'lucide-react';
import { Flashcard } from './Flashcard';
import { useKeyboard } from '../hooks/useKeyboard';
import { isTouchDevice } from '../utils';
import type { FlashcardData } from '../types';

interface StudyModeProps {
  cards: FlashcardData[];
  currentIndex: number;
  isFlipped: boolean;
  viewedHistory: string[];
  historyIndex: number;
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onExit: () => void;
}

export function StudyMode({
  cards,
  currentIndex,
  isFlipped,
  viewedHistory,
  historyIndex,
  onFlip,
  onNext,
  onPrevious,
  onExit,
}: StudyModeProps) {
  const currentCard = cards[currentIndex];
  const isTouch = isTouchDevice();
  const [showHistory, setShowHistory] = useState(false);

  // Keyboard shortcuts
  useKeyboard({
    ' ': onFlip,
    'ArrowLeft': onPrevious,
    'ArrowRight': onNext,
    'Escape': onExit,
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
          onNext(); // Swipe left = next
        } else {
          onPrevious(); // Swipe right = previous
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onNext, onPrevious, isTouch]);

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No cards to study</h2>
          <button
            onClick={onExit}
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
            onClick={onExit}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Exit Study</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {currentIndex + 1} of {cards.length}
            </span>
            
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
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
              onClick={onFlip}
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
            onFlip={onFlip}
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
                const card = cards.find(c => c.id === cardId);
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
            onClick={onPrevious}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cards.length <= 1}
          >
            <span className="hidden sm:inline">Previous word (←)</span>
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isTouch ? (
              <span>Swipe to navigate • Tap to flip</span>
            ) : (
              <span>← previous • → random next • Space to flip • Esc to exit</span>
            )}
          </div>

          <button
            onClick={onNext}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cards.length <= 1}
          >
            <span className="hidden sm:inline">Random Next (→)</span>
          </button>
        </div>
      </div>
    </div>
  );
} 