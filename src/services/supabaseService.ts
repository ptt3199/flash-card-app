import { supabase } from '../config/supabase';
import type { FlashcardData } from '../types';
import { getCurrentTimestamp } from '../utils';

export class SupabaseService {
  private static instance: SupabaseService;

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Set the auth token for the current session
  private getAuthenticatedClient(token?: string) {
    if (token) {
      // Create a new client instance with the JWT token
      return supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
    }
    return Promise.resolve();
  }

  // Get all flashcards for current user
  async getFlashcards(userId: string, sessionToken?: string): Promise<FlashcardData[]> {
    try {
      if (sessionToken) {
        await this.getAuthenticatedClient(sessionToken);
      }

      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(this.transformFromDatabase);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      throw new Error('Failed to fetch flashcards');
    }
  }

  // Add new flashcard
  async addFlashcard(userId: string, cardData: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>, sessionToken?: string): Promise<FlashcardData> {
    try {
      if (sessionToken) {
        await this.getAuthenticatedClient(sessionToken);
      }

      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          user_id: userId,
          word: cardData.word,
          meaning: cardData.meaning,
          pronunciation: cardData.pronunciation || null,
          part_of_speech: cardData.partOfSpeech || null,
          examples: cardData.examples || null,
          synonyms: cardData.synonyms || null,
          antonyms: cardData.antonyms || null,
          personal_notes: cardData.personalNotes || null,
          audio_url: cardData.audioUrl || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      return this.transformFromDatabase(data);
    } catch (error) {
      console.error('Error adding flashcard:', error);
      throw new Error('Failed to add flashcard');
    }
  }

  // Update flashcard
  async updateFlashcard(userId: string, cardId: string, updates: Partial<FlashcardData>, sessionToken?: string): Promise<FlashcardData> {
    try {
      if (sessionToken) {
        await this.getAuthenticatedClient(sessionToken);
      }

      const dbUpdates = {
        word: updates.word,
        meaning: updates.meaning,
        pronunciation: updates.pronunciation || null,
        part_of_speech: updates.partOfSpeech || null,
        examples: updates.examples || null,
        synonyms: updates.synonyms || null,
        antonyms: updates.antonyms || null,
        personal_notes: updates.personalNotes || null,
        audio_url: updates.audioUrl || null,
        updated_at: getCurrentTimestamp(),
      };

      // Remove undefined values
      Object.keys(dbUpdates).forEach(key => {
        if (dbUpdates[key as keyof typeof dbUpdates] === undefined) {
          delete dbUpdates[key as keyof typeof dbUpdates];
        }
      });

      const { data, error } = await supabase
        .from('flashcards')
        .update(dbUpdates)
        .eq('id', cardId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return this.transformFromDatabase(data);
    } catch (error) {
      console.error('Error updating flashcard:', error);
      throw new Error('Failed to update flashcard');
    }
  }

  // Delete flashcard
  async deleteFlashcard(userId: string, cardId: string, sessionToken?: string): Promise<void> {
    try {
      if (sessionToken) {
        await this.getAuthenticatedClient(sessionToken);
      }

      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', cardId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      throw new Error('Failed to delete flashcard');
    }
  }

  // Transform database row to FlashcardData
  private transformFromDatabase(dbRow: any): FlashcardData {
    return {
      id: dbRow.id,
      word: dbRow.word,
      meaning: dbRow.meaning,
      pronunciation: dbRow.pronunciation,
      partOfSpeech: dbRow.part_of_speech,
      examples: dbRow.examples,
      synonyms: dbRow.synonyms,
      antonyms: dbRow.antonyms,
      personalNotes: dbRow.personal_notes,
      audioUrl: dbRow.audio_url,
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at,
    };
  }

  // Sync local storage data to Supabase (migration helper)
  async syncLocalData(userId: string, localCards: FlashcardData[], sessionToken?: string): Promise<void> {
    try {
      if (sessionToken) {
        await this.getAuthenticatedClient(sessionToken);
      }

      for (const card of localCards) {
        await this.addFlashcard(userId, {
          word: card.word,
          meaning: card.meaning,
          pronunciation: card.pronunciation,
          partOfSpeech: card.partOfSpeech,
          examples: card.examples,
          synonyms: card.synonyms,
          antonyms: card.antonyms,
          personalNotes: card.personalNotes,
          audioUrl: card.audioUrl,
        }, sessionToken);
      }
    } catch (error) {
      console.error('Error syncing local data:', error);
      throw new Error('Failed to sync local data');
    }
  }
}

// Export singleton instance
export const supabaseService = SupabaseService.getInstance(); 