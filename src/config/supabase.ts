import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const hasUrl = !!supabaseUrl;
  const hasKey = !!supabaseAnonKey;
  
  if (!hasUrl || !hasKey) {
    console.warn('Supabase configuration missing:', { 
      hasUrl, 
      hasKey,
      url: supabaseUrl ? '***configured***' : 'missing',
      key: supabaseAnonKey ? '***configured***' : 'missing'
    });
  }
  
  return hasUrl && hasKey;
};

// Database types
export interface Database {
  public: {
    Tables: {
      flashcards: {
        Row: {
          id: string;
          user_id: string;
          word: string;
          meaning: string;
          pronunciation?: string;
          part_of_speech?: string;
          examples?: string[];
          synonyms?: string[];
          antonyms?: string[];
          personal_notes?: string;
          audio_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: never; // Auto-generated UUID
          user_id: string;
          word: string;
          meaning: string;
          pronunciation?: string;
          part_of_speech?: string;
          examples?: string[];
          synonyms?: string[];
          antonyms?: string[];
          personal_notes?: string;
          audio_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          word?: string;
          meaning?: string;
          pronunciation?: string;
          part_of_speech?: string;
          examples?: string[];
          synonyms?: string[];
          antonyms?: string[];
          personal_notes?: string;
          audio_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 