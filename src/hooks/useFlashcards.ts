import { useReducer, useCallback } from 'react';
import type { AppState, AppAction, FlashcardData } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { createFlashcard, updateFlashcard } from '../utils';

const initialState: AppState = {
  cards: [],
  currentIndex: 0,
  mode: 'management',
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
            ? updateFlashcard(card, action.payload.data)
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

export function useFlashcards() {
  const [storedCards, setStoredCards] = useLocalStorage<FlashcardData[]>('flashcards', []);
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    cards: storedCards,
    mode: storedCards.length > 0 ? 'study' : 'management',
  });

  // Sync cards to localStorage whenever they change
  const syncCards = useCallback((cards: FlashcardData[]) => {
    setStoredCards(cards);
    dispatch({ type: 'SET_CARDS', payload: cards });
  }, [setStoredCards]);

  // Actions
  const addCard = useCallback((cardData: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCard = createFlashcard(cardData);
    const newCards = [...state.cards, newCard];
    syncCards(newCards);
  }, [state.cards, syncCards]);

  const updateCard = useCallback((id: string, updates: Partial<FlashcardData>) => {
    const newCards = state.cards.map(card =>
      card.id === id ? updateFlashcard(card, updates) : card
    );
    syncCards(newCards);
  }, [state.cards, syncCards]);

  const deleteCard = useCallback((id: string) => {
    const newCards = state.cards.filter(card => card.id !== id);
    syncCards(newCards);
  }, [state.cards, syncCards]);

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
    dispatch({ type: 'NEXT_CARD' });
  }, []);

  const previousCard = useCallback(() => {
    dispatch({ type: 'PREVIOUS_CARD' });
  }, []);

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
  const canGoNext = hasCards && state.currentIndex < state.cards.length - 1;
  const canGoPrevious = hasCards && state.currentIndex > 0;

  return {
    // State
    ...state,
    currentCard,
    hasCards,
    canGoNext,
    canGoPrevious,
    
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
  };
} 