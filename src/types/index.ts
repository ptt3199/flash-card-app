// Core flashcard data structure
export interface FlashcardData {
  id: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  partOfSpeech?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  personalNotes?: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// App state management
export interface AppState {
  cards: FlashcardData[];
  currentIndex: number;
  mode: 'study' | 'management';
  isFlipped: boolean;
  isLoading: boolean;
  error: string | null;
}

// Action types for state management
export type AppAction =
  | { type: 'SET_CARDS'; payload: FlashcardData[] }
  | { type: 'ADD_CARD'; payload: FlashcardData }
  | { type: 'UPDATE_CARD'; payload: { id: string; data: Partial<FlashcardData> } }
  | { type: 'DELETE_CARD'; payload: string }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'SET_MODE'; payload: 'study' | 'management' }
  | { type: 'FLIP_CARD' }
  | { type: 'NEXT_CARD' }
  | { type: 'PREVIOUS_CARD' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Dictionary API response types
export interface DictionaryResponse {
  word: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

// Gemini API types
export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// API service interfaces
export interface WordData {
  word: string;
  meaning: string;
  pronunciation?: string;
  partOfSpeech?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  audioUrl?: string;
}

// Keyboard shortcuts
export interface KeyboardShortcuts {
  ' ': () => void; // Space - flip card
  'ArrowLeft': () => void; // Previous card
  'ArrowRight': () => void; // Next card
  'Escape': () => void; // Exit study mode
  'h': () => void; // Show history
}

// Touch gesture types
export interface TouchGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  threshold: number;
}

// Component props
export interface FlashcardProps {
  card: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface StudyModeProps {
  cards: FlashcardData[];
  currentIndex: number;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onExit: () => void;
}

export interface ManagementModeProps {
  cards: FlashcardData[];
  onAddCard: (card: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateCard: (id: string, data: Partial<FlashcardData>) => void;
  onDeleteCard: (id: string) => void;
  onStartStudy: () => void;
}

export interface CardFormProps {
  onSubmit: (card: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<FlashcardData>;
  isLoading?: boolean;
} 