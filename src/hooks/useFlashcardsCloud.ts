import { useState, useCallback, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '../config/supabase';
import type { FlashcardData } from '../types';

export function useFlashcardsCloud() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch flashcards from Supabase
  const fetchFlashcards = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw new Error(`Failed to fetch flashcards: ${fetchError.message}`);
      }

      console.log('Fetched flashcards:', data);
      setFlashcards(data || []);
      setHasFetched(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Fetch error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Add flashcard
  const addFlashcard = useCallback(async (cardData: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('flashcards')
        .insert([{
          ...cardData,
          user_id: user.id
        }])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to add flashcard: ${insertError.message}`);
      }

      setFlashcards(prev => [...prev, data]);
      setHistory(prev => [...prev, `Added: "${cardData.word}"`]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Update flashcard
  const updateFlashcard = useCallback(async (id: string, updates: Partial<FlashcardData>) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Failed to update flashcard: ${updateError.message}`);
      }

      setFlashcards(prev => prev.map(card => card.id === id ? data : card));
      setHistory(prev => [...prev, `Updated: "${data.word}"`]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Delete flashcard
  const deleteFlashcard = useCallback(async (id: string) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const cardToDelete = flashcards.find(card => card.id === id);
      
      const { error: deleteError } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw new Error(`Failed to delete flashcard: ${deleteError.message}`);
      }

      setFlashcards(prev => prev.filter(card => card.id !== id));
      if (cardToDelete) {
        setHistory(prev => [...prev, `Deleted: "${cardToDelete.word}"`]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id, flashcards]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Auto-fetch when user signs in
  useEffect(() => {
    if (isSignedIn && user?.id && !hasFetched) {
      console.log('User signed in, fetching flashcards...');
      fetchFlashcards();
    } else if (!isSignedIn) {
      // User not signed in, reset state
      setFlashcards([]);
      setHasFetched(false);
      setLoading(false);
    }
  }, [isSignedIn, user?.id, hasFetched, fetchFlashcards]);

  return {
    flashcards,
    loading,
    error,
    history,
    user,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    fetchFlashcards,
    clearError,
    clearHistory
  };
} 