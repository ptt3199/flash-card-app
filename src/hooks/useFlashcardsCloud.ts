import { useReducer, useCallback, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import type { AppState, AppAction, FlashcardData } from '../types';
import { supabaseService } from '../services/supabaseService';
import { getStorageItem, setStorageItem } from '../utils';

const initialState: AppState = {
  cards: [],
  currentIndex: 0,
  mode: 'study',
  isFlipped: false,
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CARDS':
      return {
        ...state,
        cards: action.payload,
        currentIndex: Math.min(state.currentIndex, Math.max(0, action.payload.length - 1)),
      };

    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, action.payload],
      };

    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload.id
            ? { ...card, ...action.payload.data, updatedAt: new Date().toISOString() }
            : card
        ),
      };

    case 'DELETE_CARD':
      const newCards = state.cards.filter(card => card.id !== action.payload);
      return {
        ...state,
        cards: newCards,
        currentIndex: Math.min(state.currentIndex, Math.max(0, newCards.length - 1)),
      };

    case 'SET_CURRENT_INDEX':
      return {
        ...state,
        currentIndex: Math.max(0, Math.min(action.payload, state.cards.length - 1)),
        isFlipped: false,
      };

    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
        isFlipped: false,
        error: null,
      };

    case 'FLIP_CARD':
      return {
        ...state,
        isFlipped: !state.isFlipped,
      };

    case 'NEXT_CARD':
      const nextIndex = state.currentIndex < state.cards.length - 1 
        ? state.currentIndex + 1 
        : 0;
      return {
        ...state,
        currentIndex: nextIndex,
        isFlipped: false,
      };

    case 'PREVIOUS_CARD':
      const prevIndex = state.currentIndex > 0 
        ? state.currentIndex - 1 
        : state.cards.length - 1;
      return {
        ...state,
        currentIndex: prevIndex,
        isFlipped: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
}

export function useFlashcardsCloud() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [viewedCardIds, setViewedCardIds] = useState<Set<string>>(new Set());
  const [viewedHistory, setViewedHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Helper function to add to history without duplicates
  const addToHistory = useCallback((cardId: string) => {
    setViewedHistory(prev => {
      // Remove any existing instances of this card
      const filtered = prev.filter(id => id !== cardId);
      // Add to end
      return [...filtered, cardId];
    });
    setHistoryIndex(() => {
      // Find new index after deduplication
      const newHistory = viewedHistory.filter(id => id !== cardId);
      return newHistory.length; // Points to the newly added card
    });
  }, [viewedHistory]);

  const loadFlashcards = useCallback(async () => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const token = await getToken({ template: 'supabase' });
      const cards = await supabaseService.getFlashcards(user.id, token || undefined);
      dispatch({ type: 'SET_CARDS', payload: cards });
      
      // Always start in management mode to let user choose what to do
      dispatch({ type: 'SET_MODE', payload: 'management' });
      
      if (cards.length > 0) {
        // Prepare for study mode but don't start automatically
        const randomIndex = Math.floor(Math.random() * cards.length);
        dispatch({ type: 'SET_CURRENT_INDEX', payload: randomIndex });
      }
    } catch (error) {
      console.error('Failed to load flashcards:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load flashcards' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, getToken]);

  // Load flashcards when user is available
  useEffect(() => {
    if (isLoaded && user) {
      loadFlashcards();
    }
  }, [isLoaded, user, loadFlashcards]);

  // Migrate local data to cloud on first sign-in
  const migrateLocalData = useCallback(async () => {
    if (!user) return;

    const localCards = getStorageItem<FlashcardData[]>('flashcards', []);
    if (localCards.length === 0) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const token = await getToken({ template: 'supabase' });
      await supabaseService.syncLocalData(user.id, localCards, token || undefined);
      
      // Clear local storage after successful migration
      setStorageItem('flashcards', []);
      setStorageItem('flashcards_migrated', true);
      
      // Reload cards from database
      await loadFlashcards();
    } catch (error) {
      console.error('Failed to migrate local data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to migrate local data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, getToken, loadFlashcards]);

  // Check if migration is needed
  useEffect(() => {
    if (isLoaded && user) {
      const isMigrated = getStorageItem('flashcards_migrated', false);
      if (!isMigrated) {
        migrateLocalData();
      }
    }
  }, [isLoaded, user, migrateLocalData]);

  // Helper function to get a random unviewed card
  const getRandomUnviewedCard = useCallback(() => {
    const unviewedCards = state.cards.filter(card => !viewedCardIds.has(card.id));
    
    // If all cards have been viewed, reset and start over
    if (unviewedCards.length === 0) {
      setViewedCardIds(new Set());
      return state.cards[Math.floor(Math.random() * state.cards.length)];
    }
    
    const randomCard = unviewedCards[Math.floor(Math.random() * unviewedCards.length)];
    return randomCard;
  }, [state.cards, viewedCardIds]);

  // Helper function to mark card as viewed and go to it
  const goToRandomCard = useCallback(() => {
    if (state.cards.length === 0) return;
    
    const randomCard = getRandomUnviewedCard();
    const cardIndex = state.cards.findIndex(card => card.id === randomCard.id);
    
    if (cardIndex !== -1) {
      dispatch({ type: 'SET_CURRENT_INDEX', payload: cardIndex });
      setViewedCardIds(prev => new Set([...prev, randomCard.id]));
      
      // Add to history
      addToHistory(randomCard.id);
    }
  }, [state.cards, getRandomUnviewedCard, addToHistory]);

  // Helper function to go back in history (no new history entry)
  const goToPreviousCard = useCallback(() => {
    if (historyIndex <= 0) return;
    
    const previousCardId = viewedHistory[historyIndex - 1];
    const cardIndex = state.cards.findIndex(card => card.id === previousCardId);
    
    if (cardIndex !== -1) {
      dispatch({ type: 'SET_CURRENT_INDEX', payload: cardIndex });
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex, viewedHistory, state.cards]);

  // Helper function to go forward in history (if available)
  const goToNextInHistory = useCallback(() => {
    if (historyIndex >= viewedHistory.length - 1) {
      // No forward history, get random card
      goToRandomCard();
    } else {
      // Go forward in existing history
      const nextCardId = viewedHistory[historyIndex + 1];
      const cardIndex = state.cards.findIndex(card => card.id === nextCardId);
      
      if (cardIndex !== -1) {
        dispatch({ type: 'SET_CURRENT_INDEX', payload: cardIndex });
        setHistoryIndex(prev => prev + 1);
      }
    }
  }, [historyIndex, viewedHistory, state.cards, goToRandomCard]);

  // Actions
  const addCard = useCallback(async (cardData: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const token = await getToken({ template: 'supabase' });
      const newCard = await supabaseService.addFlashcard(user.id, cardData, token || undefined);
      dispatch({ type: 'ADD_CARD', payload: newCard });
    } catch (error) {
      console.error('Failed to add card:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add card' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, getToken]);

  const updateCard = useCallback(async (id: string, updates: Partial<FlashcardData>) => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const token = await getToken({ template: 'supabase' });
      const updatedCard = await supabaseService.updateFlashcard(user.id, id, updates, token || undefined);
      dispatch({ type: 'UPDATE_CARD', payload: { id, data: updatedCard } });
    } catch (error) {
      console.error('Failed to update card:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update card' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, getToken]);

  const deleteCard = useCallback(async (id: string) => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const token = await getToken({ template: 'supabase' });
      await supabaseService.deleteFlashcard(user.id, id, token || undefined);
      dispatch({ type: 'DELETE_CARD', payload: id });
    } catch (error) {
      console.error('Failed to delete card:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete card' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, getToken]);

  const setCurrentIndex = useCallback((index: number) => {
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index });
  }, []);

  const setMode = useCallback((mode: 'study' | 'management') => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const flipCard = useCallback(() => {
    dispatch({ type: 'FLIP_CARD' });
  }, []);

  const nextCard = useCallback(() => {
    goToNextInHistory();
  }, [goToNextInHistory]);

  const previousCard = useCallback(() => {
    goToPreviousCard();
  }, [goToPreviousCard]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Computed values
  const currentCard = state.cards[state.currentIndex] || null;
  const hasCards = state.cards.length > 0;
  const canGoNext = hasCards; // Always can go to random next
  const canGoPrevious = hasCards && historyIndex > 0; // Can go back if there's history

  return {
    // State
    ...state,
    currentCard,
    hasCards,
    canGoNext,
    canGoPrevious,
    
    // User state
    user,
    isLoaded,
    
    // History state
    viewedHistory,
    historyIndex,
    
    // Actions
    addCard,
    updateCard,
    deleteCard,
    setCurrentIndex,
    setMode,
    flipCard,
    nextCard,
    previousCard,
    setLoading,
    setError,
    clearError,
    loadFlashcards,
    migrateLocalData,
  };
} 