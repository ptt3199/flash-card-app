import { useReducer, useCallback, useEffect, useState } from 'react';
import type { AppState, AppAction, FlashcardData } from '../types';
import { getStorageItem, setStorageItem } from '../utils';

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

export function useFlashcardsLocal() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [viewedCardIds, setViewedCardIds] = useState<Set<string>>(new Set());
  const [viewedHistory, setViewedHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Helper function to add to history without duplicates
  const addToHistory = useCallback((cardId: string) => {
    setViewedHistory(prev => {
      const filtered = prev.filter(id => id !== cardId);
      return [...filtered, cardId];
    });
    setHistoryIndex(() => {
      const newHistory = viewedHistory.filter(id => id !== cardId);
      return newHistory.length;
    });
  }, [viewedHistory]);

  // Load flashcards from localStorage on mount
  useEffect(() => {
    loadFlashcards();
  }, []);

  // Save to localStorage whenever cards change
  useEffect(() => {
    if (state.cards.length >= 0) { // Save even empty array
      setStorageItem('flashcards', state.cards);
    }
  }, [state.cards]);

  const loadFlashcards = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const cards = getStorageItem<FlashcardData[]>('flashcards', []);
      dispatch({ type: 'SET_CARDS', payload: cards });
      dispatch({ type: 'SET_MODE', payload: 'management' });
      
      if (cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        dispatch({ type: 'SET_CURRENT_INDEX', payload: randomIndex });
      }
    } catch (error) {
      console.error('Failed to load flashcards:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load flashcards from local storage' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Helper function to generate ID for local cards
  const generateId = () => `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Helper function to get a random unviewed card
  const getRandomUnviewedCard = useCallback(() => {
    const unviewedCards = state.cards.filter(card => !viewedCardIds.has(card.id));
    
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
      addToHistory(randomCard.id);
    }
  }, [state.cards, getRandomUnviewedCard, addToHistory]);

  // Helper function to go back in history
  const goToPreviousCard = useCallback(() => {
    if (historyIndex <= 0) return;
    
    const previousCardId = viewedHistory[historyIndex - 1];
    const cardIndex = state.cards.findIndex(card => card.id === previousCardId);
    
    if (cardIndex !== -1) {
      dispatch({ type: 'SET_CURRENT_INDEX', payload: cardIndex });
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex, viewedHistory, state.cards]);

  // Helper function to go forward in history
  const goToNextInHistory = useCallback(() => {
    if (historyIndex >= viewedHistory.length - 1) {
      goToRandomCard();
    } else {
      const nextCardId = viewedHistory[historyIndex + 1];
      const cardIndex = state.cards.findIndex(card => card.id === nextCardId);
      
      if (cardIndex !== -1) {
        dispatch({ type: 'SET_CURRENT_INDEX', payload: cardIndex });
        setHistoryIndex(prev => prev + 1);
      }
    }
  }, [historyIndex, viewedHistory, state.cards, goToRandomCard]);

  // Actions
  const addCard = useCallback((cardData: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newCard: FlashcardData = {
      ...cardData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    dispatch({ type: 'ADD_CARD', payload: newCard });
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<FlashcardData>) => {
    dispatch({ type: 'UPDATE_CARD', payload: { id, data: updates } });
  }, []);

  const deleteCard = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CARD', payload: id });
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

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Computed values
  const currentCard = state.cards[state.currentIndex] || null;
  const hasCards = state.cards.length > 0;

  return {
    // State
    cards: state.cards,
    currentIndex: state.currentIndex,
    mode: state.mode,
    isFlipped: state.isFlipped,
    currentCard,
    hasCards,
    isLoading: state.isLoading,
    error: state.error,
    user: null, // No user in local mode
    viewedHistory,
    historyIndex,

    // Actions
    addCard,
    updateCard,
    deleteCard,
    setMode,
    flipCard,
    nextCard,
    previousCard,
    clearError,
  };
} 