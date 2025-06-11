import { createContext, useContext, ReactNode } from 'react';
import { useFlashcardsCloud } from '../hooks/useFlashcardsCloud';

// The return type of our hook
type FlashcardContextType = ReturnType<typeof useFlashcardsCloud>;

// Create the context with an undefined initial value
const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

interface FlashcardProviderProps {
  children: ReactNode;
}

export function FlashcardProvider({ children }: FlashcardProviderProps) {
  const flashcardData = useFlashcardsCloud();

  return (
    <FlashcardContext.Provider value={flashcardData}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards(): FlashcardContextType {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
} 