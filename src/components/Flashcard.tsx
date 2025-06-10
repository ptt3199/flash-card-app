import React from 'react';
import { Volume2, BookOpen, Quote, Users, Zap, StickyNote, Sparkles, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { FlashcardData } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { formatWordList } from '../utils';

interface FlashcardProps {
  card: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
  className?: string;
}

export function Flashcard({ card, isFlipped, onFlip, className = '' }: FlashcardProps) {
  const { speak, isPlaying } = useSpeech();

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(card.word, card.audioUrl);
  };

  // Helper function to validate and filter word lists
  const getValidWordList = (words?: string[]): string[] => {
    if (!words || !Array.isArray(words)) return [];
    return words.filter(word => {
      if (typeof word !== 'string') return false;
      const trimmed = word.trim();
      // Check if it's a valid word (only contains letters, spaces, hyphens, apostrophes)
      return trimmed.length > 0 && /^[a-zA-Z\s\-']+$/.test(trimmed) && trimmed.length < 50;
    });
  };

  // Helper function to validate examples
  const getValidExamples = (examples?: string[]): string[] => {
    if (!examples || !Array.isArray(examples)) return [];
    return examples.filter(example => {
      if (typeof example !== 'string') return false;
      const trimmed = example.trim();
      return trimmed.length > 0 && trimmed.length < 200;
    });
  };

  // Process card data
  const validSynonyms = getValidWordList(card.synonyms);
  const validAntonyms = getValidWordList(card.antonyms);
  const validExamples = getValidExamples(card.examples);

  // Compact card for normal view
  const CompactCard = () => (
    <div className={`flashcard ${className}`}>
      <div 
        className={`flashcard-inner ${isFlipped ? 'flipped' : ''} relative w-full h-full cursor-pointer`}
        onClick={onFlip}
      >
        {/* Front of card */}
        <div className="flashcard-front bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center p-4 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 text-yellow-400 opacity-70">
            <Star className="w-4 h-4" />
          </div>
          <div className="absolute top-4 left-4 text-blue-400 opacity-50">
            <Sparkles className="w-3 h-3" />
          </div>
          <div className="absolute bottom-4 right-6 text-purple-400 opacity-40">
            <Sparkles className="w-2 h-2" />
          </div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/30 to-transparent"></div>
          
          <div className="text-center relative z-10">
            <div className="mb-4">
              <div className="inline-block p-4 bg-white rounded-full shadow-md border border-blue-100 mb-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {card.word}
            </h2>
            
            {card.pronunciation && (
              <p className="text-base text-gray-600 mb-4 font-medium">
                {card.pronunciation}
              </p>
            )}
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={handlePlayAudio}
                disabled={isPlaying}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 shadow-md"
                title="Play pronunciation"
              >
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-3 text-xs text-gray-500 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">
            Click or press Space to flip
          </div>
        </div>

        {/* Back of card - Full Content */}
        <div className="flashcard-back bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl shadow-lg border border-gray-200 p-4 overflow-y-auto flex flex-col">
          {/* Decorative elements */}
          <div className="absolute top-2 left-2 text-blue-400 opacity-30">
            <Sparkles className="w-3 h-3" />
          </div>
          <div className="absolute top-3 right-3 text-purple-400 opacity-40">
            <Star className="w-3 h-3" />
          </div>
          
          <div className="space-y-4 relative z-10 flex-1">
            {/* Header */}
            <div className="text-center pb-3 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {card.word}
              </h3>
              {card.partOfSpeech && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mt-2">
                  {card.partOfSpeech}
                </span>
              )}
            </div>

            {/* Meaning - Full */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-blue-700 text-sm">Definition</h4>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">
                {card.meaning}
              </p>
            </div>

            {/* Examples - Full */}
            {validExamples.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Quote className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-green-700 text-sm">Examples</h4>
                </div>
                <div className="space-y-2">
                  {validExamples.map((example, index) => (
                    <div key={index} className="bg-white rounded-md p-3 border border-green-200 shadow-sm">
                      <p className="italic text-sm text-gray-700">• {example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Synonyms */}
            {validSynonyms.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold text-purple-700 text-sm">Synonyms</h4>
                </div>
                <div className="bg-white p-3 rounded-md border border-purple-200 shadow-sm">
                  <p className="text-sm text-gray-700">
                    {formatWordList(validSynonyms)}
                  </p>
                </div>
              </div>
            )}

            {/* Antonyms */}
            {validAntonyms.length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-red-600" />
                  <h4 className="font-semibold text-red-700 text-sm">Antonyms</h4>
                </div>
                <div className="bg-white p-3 rounded-md border border-red-200 shadow-sm">
                  <p className="text-sm text-gray-700">
                    {formatWordList(validAntonyms)}
                  </p>
                </div>
              </div>
            )}

            {/* Personal notes */}
            {card.personalNotes && (
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <StickyNote className="w-4 h-4 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-700 text-sm">Personal Notes</h4>
                </div>
                <div className="bg-white p-3 rounded-md border border-yellow-200 shadow-sm border-l-4 border-l-yellow-400">
                  <div className="text-sm text-gray-700 prose prose-sm">
                    <ReactMarkdown>{card.personalNotes}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm inline-block">
              Click to flip back • Scroll for more content
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return <CompactCard />;
} 