import type { FlashcardData } from '../types';

// Generate unique ID for flashcards
export const generateId = (): string => crypto.randomUUID();

// Get current timestamp
export const getCurrentTimestamp = (): string => new Date().toISOString();

// Create a new flashcard with metadata
export const createFlashcard = (
  data: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>
): FlashcardData => ({
  ...data,
  id: generateId(),
  createdAt: getCurrentTimestamp(),
  updatedAt: getCurrentTimestamp(),
});

// Update flashcard with new timestamp
export const updateFlashcard = (
  card: FlashcardData,
  updates: Partial<FlashcardData>
): FlashcardData => ({
  ...card,
  ...updates,
  updatedAt: getCurrentTimestamp(),
});

// Debounce function for API calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for performance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Check if touch device
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Format text for display
export const formatExamples = (examples?: string[]): string => {
  if (!examples || examples.length === 0) return '';
  return examples.map(example => `• ${example}`).join('\n');
};

export const formatWordList = (words?: string[]): string => {
  if (!words || words.length === 0) return '';
  return words.join(', ');
};

// Validate flashcard data
export const validateFlashcard = (data: Partial<FlashcardData>): string[] => {
  const errors: string[] = [];
  
  if (!data.word || data.word.trim() === '') {
    errors.push('Word is required');
  }
  
  if (!data.meaning || data.meaning.trim() === '') {
    errors.push('Meaning is required');
  }
  
  if (data.word && data.word.length > 100) {
    errors.push('Word is too long (max 100 characters)');
  }
  
  if (data.meaning && data.meaning.length > 500) {
    errors.push('Meaning is too long (max 500 characters)');
  }
  
  return errors;
};

// Local storage helpers
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

// Check storage usage
export const getStorageUsage = (): { used: number; total: number; percentage: number } => {
  let used = 0;
  const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
  
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
  } catch (error) {
    console.error('Error calculating storage usage:', error);
  }
  
  return {
    used,
    total,
    percentage: Math.round((used / total) * 100),
  };
}; 