import type { WordData } from '../types';
import { dictionaryApi } from './dictionaryApi';
import { geminiApi } from './geminiApi';

export class WordService {
  private static instance: WordService;

  public static getInstance(): WordService {
    if (!WordService.instance) {
      WordService.instance = new WordService();
    }
    return WordService.instance;
  }

  async fetchWordData(word: string): Promise<WordData> {
    const normalizedWord = word.toLowerCase().trim();
    
    if (!normalizedWord) {
      throw new Error('Word cannot be empty');
    }

    try {
      // Primary: Try Dictionary API first
      // Fetching word data from Dictionary API
      return await dictionaryApi.fetchWordData(normalizedWord);
    } catch (dictionaryError) {
      console.warn('Dictionary API failed, trying Gemini API...', dictionaryError);
      
      try {
        // Fallback: Try Gemini API
        if (geminiApi.isConfigured()) {
          // Fallback: Fetching word data from Gemini API
          return await geminiApi.fetchWordData(normalizedWord);
        } else {
          console.warn('Gemini API not configured, using basic fallback');
          return this.createBasicWordData(normalizedWord);
        }
      } catch (geminiError) {
        console.warn('Gemini API also failed, using basic fallback', geminiError);
        return this.createBasicWordData(normalizedWord);
      }
    }
  }

  private createBasicWordData(word: string): WordData {
    return {
      word: word,
      meaning: 'Definition not available. Please add manually.',
      pronunciation: undefined,
      partOfSpeech: undefined,
      examples: undefined,
      synonyms: undefined,
      antonyms: undefined,
      audioUrl: undefined,
    };
  }

  // Validate if a word looks reasonable
  isValidWord(word: string): boolean {
    const normalizedWord = word.trim();
    
    // Basic validation
    if (normalizedWord.length === 0 || normalizedWord.length > 100) {
      return false;
    }
    
    // Check if it contains only letters, hyphens, and apostrophes
    const wordPattern = /^[a-zA-Z\-']+$/;
    return wordPattern.test(normalizedWord);
  }

  // Get suggestions for similar words (basic implementation)
  getSuggestions(word: string): string[] {
    // This is a basic implementation - in a real app you might use a more sophisticated approach
    const suggestions: string[] = [];
    const normalizedWord = word.toLowerCase().trim();
    
    // Common word endings to try
    const endings = ['ing', 'ed', 'er', 'est', 'ly', 's'];
    const prefixes = ['un', 're', 'pre', 'dis'];
    
    // Try removing common endings
    for (const ending of endings) {
      if (normalizedWord.endsWith(ending)) {
        const base = normalizedWord.slice(0, -ending.length);
        if (base.length > 2) {
          suggestions.push(base);
        }
      }
    }
    
    // Try removing common prefixes
    for (const prefix of prefixes) {
      if (normalizedWord.startsWith(prefix)) {
        const base = normalizedWord.slice(prefix.length);
        if (base.length > 2) {
          suggestions.push(base);
        }
      }
    }
    
    return [...new Set(suggestions)].slice(0, 3);
  }
}

// Export singleton instance
export const wordService = WordService.getInstance(); 