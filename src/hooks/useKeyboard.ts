import { useEffect } from 'react';
import type { KeyboardShortcuts } from '../types';

export function useKeyboard(shortcuts: Partial<KeyboardShortcuts>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when user is typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = event.key;
      const handler = shortcuts[key as keyof KeyboardShortcuts];
      
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
} 