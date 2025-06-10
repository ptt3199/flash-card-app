import type { DictionaryResponse, WordData } from '../types';

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// Cache for API responses
const responseCache = new Map<string, WordData>();

export class DictionaryApiService {
  private static instance: DictionaryApiService;

  public static getInstance(): DictionaryApiService {
    if (!DictionaryApiService.instance) {
      DictionaryApiService.instance = new DictionaryApiService();
    }
    return DictionaryApiService.instance;
  }

  async fetchWordData(word: string): Promise<WordData> {
    const normalizedWord = word.toLowerCase().trim();
    
    // Check cache first
    if (responseCache.has(normalizedWord)) {
      return responseCache.get(normalizedWord)!;
    }

    try {
      const response = await fetch(`${DICTIONARY_API_BASE}/${encodeURIComponent(normalizedWord)}`);
      
      if (!response.ok) {
        throw new Error(`Dictionary API error: ${response.status}`);
      }

      const data: DictionaryResponse[] = await response.json();
      const wordData = this.parseResponse(data[0]);
      
      // Cache the response
      responseCache.set(normalizedWord, wordData);
      
      return wordData;
    } catch (error) {
      console.error('Dictionary API fetch error:', error);
      throw new Error('Failed to fetch word definition');
    }
  }

  private parseResponse(response: DictionaryResponse): WordData {
    const firstMeaning = response.meanings[0];
    const firstDefinition = firstMeaning?.definitions[0];
    
    // Extract pronunciation
    const pronunciation = response.phonetics
      .find(p => p.text)?.text || '';
    
    // Extract audio URL
    const audioUrl = response.phonetics
      .find(p => p.audio)?.audio || '';
    
    // Extract examples
    const examples = firstDefinition?.example 
      ? [firstDefinition.example]
      : [];
    
    // Add more examples from other definitions
    response.meanings.forEach(meaning => {
      meaning.definitions.slice(0, 2).forEach(def => {
        if (def.example && !examples.includes(def.example)) {
          examples.push(def.example);
        }
      });
    });
    
    // Extract synonyms and antonyms
    const synonyms: string[] = [];
    const antonyms: string[] = [];
    
    response.meanings.forEach(meaning => {
      meaning.definitions.forEach(def => {
        if (def.synonyms) {
          synonyms.push(...def.synonyms);
        }
        if (def.antonyms) {
          antonyms.push(...def.antonyms);
        }
      });
    });

    return {
      word: response.word,
      meaning: firstDefinition?.definition || '',
      pronunciation: pronunciation,
      partOfSpeech: firstMeaning?.partOfSpeech || '',
      examples: examples.length > 0 ? examples.slice(0, 3) : undefined,
      synonyms: synonyms.length > 0 ? [...new Set(synonyms)].slice(0, 5) : undefined,
      antonyms: antonyms.length > 0 ? [...new Set(antonyms)].slice(0, 5) : undefined,
      audioUrl: audioUrl || undefined,
    };
  }

  // Clear cache if needed
  clearCache(): void {
    responseCache.clear();
  }

  // Get cache size for debugging
  getCacheSize(): number {
    return responseCache.size;
  }
}

// Export singleton instance
export const dictionaryApi = DictionaryApiService.getInstance(); 