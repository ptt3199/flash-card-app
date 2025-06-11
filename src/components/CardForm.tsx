import React, { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import type { FlashcardData } from '../types';
import { wordService } from '../services/wordService';
import { validateFlashcard, debounce } from '../utils';

interface CardFormProps {
  onSubmit: (card: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  initialData?: Partial<FlashcardData>;
  isLoading?: boolean;
}

export function CardForm({ onSubmit, onCancel, initialData, isLoading = false }: CardFormProps) {
  const [formData, setFormData] = useState({
    word: initialData?.word || '',
    meaning: initialData?.meaning || '',
    pronunciation: initialData?.pronunciation || '',
    partOfSpeech: initialData?.partOfSpeech || '',
    examples: initialData?.examples?.join('\n') || '',
    synonyms: initialData?.synonyms?.join(', ') || '',
    antonyms: initialData?.antonyms?.join(', ') || '',
    personalNotes: initialData?.personalNotes || '',
  });

  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const [autoFetchError, setAutoFetchError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Debounced auto-fetch function
  const debouncedAutoFetch = debounce(async (word: string) => {
    if (!word.trim() || word === initialData?.word) return;
    
    if (!wordService.isValidWord(word)) {
      setAutoFetchError('Please enter a valid English word');
      return;
    }

    setIsAutoFetching(true);
    setAutoFetchError(null);

    try {
      const wordData = await wordService.fetchWordData(word);
      
      // Only update if the word hasn't changed while we were fetching
      setFormData(current => {
        if (current.word.toLowerCase() !== word.toLowerCase()) return current;
        
        return {
          ...current,
          meaning: wordData.meaning || current.meaning,
          pronunciation: wordData.pronunciation || current.pronunciation,
          partOfSpeech: wordData.partOfSpeech || current.partOfSpeech,
          examples: wordData.examples?.join('\n') || current.examples,
          synonyms: wordData.synonyms?.join(', ') || current.synonyms,
          antonyms: wordData.antonyms?.join(', ') || current.antonyms,
        };
      });
    } catch (error) {
      setAutoFetchError(error instanceof Error ? error.message : 'Failed to fetch word data');
    } finally {
      setIsAutoFetching(false);
    }
  }, 1000);

  const handleWordChange = (word: string) => {
    setFormData(prev => ({ ...prev, word }));
    setAutoFetchError(null);
    
    if (word.trim() && !initialData?.word) {
      debouncedAutoFetch(word.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cardData = {
      word: formData.word.trim(),
      meaning: formData.meaning.trim(),
      pronunciation: formData.pronunciation.trim() || undefined,
      partOfSpeech: formData.partOfSpeech.trim() || undefined,
      examples: formData.examples.trim() 
        ? formData.examples.split('\n').map(ex => ex.trim()).filter(Boolean)
        : undefined,
      synonyms: formData.synonyms.trim()
        ? formData.synonyms.split(',').map(syn => syn.trim()).filter(Boolean)
        : undefined,
      antonyms: formData.antonyms.trim()
        ? formData.antonyms.split(',').map(ant => ant.trim()).filter(Boolean)
        : undefined,
      personalNotes: formData.personalNotes.trim() || undefined,
    };

    const errors = validateFlashcard(cardData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    onSubmit(cardData);
  };

  const handleManualFetch = async () => {
    if (!formData.word.trim()) return;
    
    setIsAutoFetching(true);
    setAutoFetchError(null);

    try {
      const wordData = await wordService.fetchWordData(formData.word.trim());
      setFormData(prev => ({
        ...prev,
        meaning: wordData.meaning || prev.meaning,
        pronunciation: wordData.pronunciation || prev.pronunciation,
        partOfSpeech: wordData.partOfSpeech || prev.partOfSpeech,
        examples: wordData.examples?.join('\n') || prev.examples,
        synonyms: wordData.synonyms?.join(', ') || prev.synonyms,
        antonyms: wordData.antonyms?.join(', ') || prev.antonyms,
      }));
    } catch (error) {
      setAutoFetchError(error instanceof Error ? error.message : 'Failed to fetch word data');
    } finally {
      setIsAutoFetching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Please fix the following errors:</h4>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Word Input */}
      <div>
        <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-2">
          Word *
        </label>
        <div className="relative">
          <input
            type="text"
            id="word"
            value={formData.word}
            onChange={(e) => handleWordChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter an English word"
            required
          />
          <button
            type="button"
            onClick={handleManualFetch}
            disabled={isAutoFetching || !formData.word.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            title="Fetch word definition"
          >
            {isAutoFetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {autoFetchError && (
          <p className="mt-1 text-sm text-red-600">{autoFetchError}</p>
        )}
        
        {isAutoFetching && (
          <p className="mt-1 text-sm text-blue-600">Fetching definition...</p>
        )}
      </div>

      {/* Meaning */}
      <div>
        <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-2">
          Meaning *
        </label>
        <textarea
          id="meaning"
          value={formData.meaning}
          onChange={(e) => setFormData(prev => ({ ...prev, meaning: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter the definition"
          required
        />
      </div>

      {/* Pronunciation and Part of Speech */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pronunciation" className="block text-sm font-medium text-gray-700 mb-2">
            Pronunciation (IPA)
          </label>
          <input
            type="text"
            id="pronunciation"
            value={formData.pronunciation}
            onChange={(e) => setFormData(prev => ({ ...prev, pronunciation: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="/ˈwɜːrd/"
          />
        </div>

        <div>
          <label htmlFor="partOfSpeech" className="block text-sm font-medium text-gray-700 mb-2">
            Part of Speech
          </label>
          <select
            id="partOfSpeech"
            value={formData.partOfSpeech}
            onChange={(e) => setFormData(prev => ({ ...prev, partOfSpeech: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select...</option>
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="adjective">Adjective</option>
            <option value="adverb">Adverb</option>
            <option value="preposition">Preposition</option>
            <option value="conjunction">Conjunction</option>
            <option value="interjection">Interjection</option>
          </select>
        </div>
      </div>

      {/* Examples */}
      <div>
        <label htmlFor="examples" className="block text-sm font-medium text-gray-700 mb-2">
          Examples
        </label>
        <textarea
          id="examples"
          value={formData.examples}
          onChange={(e) => setFormData(prev => ({ ...prev, examples: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter examples, one per line"
        />
        <p className="mt-1 text-sm text-gray-500">Enter one example per line</p>
      </div>

      {/* Synonyms and Antonyms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="synonyms" className="block text-sm font-medium text-gray-700 mb-2">
            Synonyms
          </label>
          <input
            type="text"
            id="synonyms"
            value={formData.synonyms}
            onChange={(e) => setFormData(prev => ({ ...prev, synonyms: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="word1, word2, word3"
          />
          <p className="mt-1 text-sm text-gray-500">Separate with commas</p>
        </div>

        <div>
          <label htmlFor="antonyms" className="block text-sm font-medium text-gray-700 mb-2">
            Antonyms
          </label>
          <input
            type="text"
            id="antonyms"
            value={formData.antonyms}
            onChange={(e) => setFormData(prev => ({ ...prev, antonyms: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="word1, word2, word3"
          />
          <p className="mt-1 text-sm text-gray-500">Separate with commas</p>
        </div>
      </div>

      {/* Personal Notes */}
      <div>
        <label htmlFor="personalNotes" className="block text-sm font-medium text-gray-700 mb-2">
          Personal Notes
        </label>
        <textarea
          id="personalNotes"
          value={formData.personalNotes}
          onChange={(e) => setFormData(prev => ({ ...prev, personalNotes: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add your personal notes or memory aids"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || isAutoFetching}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </div>
          ) : (
            initialData ? 'Update Card' : 'Add Card'
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
} 