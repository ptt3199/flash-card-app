import type { GeminiResponse, WordData } from '../types';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export class GeminiApiService {
  private static instance: GeminiApiService;
  private apiKey: string | null = null;

  public static getInstance(): GeminiApiService {
    if (!GeminiApiService.instance) {
      GeminiApiService.instance = new GeminiApiService();
    }
    return GeminiApiService.instance;
  }

  private constructor() {
    // Get API key from environment variables
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
  }

  async fetchWordData(word: string): Promise<WordData> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Define the English word "${word}" and provide:
1. Definition (clear and concise)
2. Pronunciation in IPA format
3. Part of speech
4. 2-3 example sentences
5. Synonyms (up to 5)
6. Antonyms (up to 5)

Format the response as JSON with this structure:
{
  "word": "${word}",
  "meaning": "definition here",
  "pronunciation": "IPA pronunciation",
  "partOfSpeech": "noun/verb/adjective etc",
  "examples": ["example 1", "example 2"],
  "synonyms": ["synonym1", "synonym2"],
  "antonyms": ["antonym1", "antonym2"]
}`;

    try {
      const response = await fetch(`${GEMINI_API_BASE}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const text = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!text) {
        throw new Error('No response from Gemini API');
      }

      return this.parseResponse(text, word);
    } catch (error) {
      console.error('Gemini API fetch error:', error);
      throw new Error('Failed to fetch word definition from AI');
    }
  }

  private parseResponse(responseText: string, word: string): WordData {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          word: parsed.word || word,
          meaning: parsed.meaning || parsed.definition || '',
          pronunciation: parsed.pronunciation || undefined,
          partOfSpeech: parsed.partOfSpeech || undefined,
          examples: parsed.examples || undefined,
          synonyms: parsed.synonyms || undefined,
          antonyms: parsed.antonyms || undefined,
        };
      }
      
      // Fallback: create basic word data from text
      return this.parseTextResponse(responseText, word);
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return this.parseTextResponse(responseText, word);
    }
  }

  private parseTextResponse(responseText: string, word: string): WordData {
    // Extract definition from text (fallback parsing)
    const lines = responseText.split('\n').filter(line => line.trim());
    let meaning = '';
    
    for (const line of lines) {
      if (line.toLowerCase().includes('definition') || 
          line.toLowerCase().includes('meaning') ||
          line.match(/^\d+\./)) {
        meaning = line.replace(/^\d+\.?\s*/, '').replace(/definition:?/i, '').trim();
        break;
      }
    }

    return {
      word,
      meaning: meaning || 'Definition not available',
      pronunciation: undefined,
      partOfSpeech: undefined,
      examples: undefined,
      synonyms: undefined,
      antonyms: undefined,
    };
  }

  // Check if API key is configured
  isConfigured(): boolean {
    return this.apiKey !== null;
  }
}

// Export singleton instance
export const geminiApi = GeminiApiService.getInstance(); 