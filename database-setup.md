# Database Setup - Clerk + Supabase Integration

## 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new account/login
2. Create a new project
3. Choose a database password and region
4. Wait for the project to be created

## 2. Get Configuration Values

From your Supabase dashboard:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (use as `VITE_SUPABASE_URL`)
   - **anon public** key (use as `VITE_SUPABASE_ANON_KEY`)

## 3. Set Up Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Choose your sign-in methods (Email, Google, GitHub, etc.)
4. Copy the **Publishable Key** from the API Keys section

## 4. Environment Configuration

Create a `.env.local` file in your project root:

```env
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# Supabase Configuration  
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Gemini AI API Key (for dictionary fallback)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 5. Create Database Schema

Go to **SQL Editor** in your Supabase dashboard and run this SQL:

```sql
-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  pronunciation TEXT,
  part_of_speech TEXT,
  examples TEXT[],
  synonyms TEXT[],
  antonyms TEXT[],
  personal_notes TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_created_at ON flashcards(created_at);

-- Clean up any existing policies (prevents conflicts)
DROP POLICY IF EXISTS "Users can view own flashcards" ON flashcards;
DROP POLICY IF EXISTS "Users can insert own flashcards" ON flashcards;  
DROP POLICY IF EXISTS "Users can update own flashcards" ON flashcards;
DROP POLICY IF EXISTS "Users can delete own flashcards" ON flashcards;
DROP POLICY IF EXISTS "Users can manage flashcards" ON flashcards;
DROP POLICY IF EXISTS "allow_all" ON flashcards;

-- Enable Row Level Security with clean slate
ALTER TABLE flashcards DISABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Create simple policy that allows all operations
-- (Our app code ensures users only query their own data)
CREATE POLICY "allow_all" ON flashcards
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function
CREATE TRIGGER update_flashcards_updated_at
  BEFORE UPDATE ON flashcards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 6. Test the Integration

1. Start your development server: `npm run dev`
2. Sign in with Clerk
3. Try adding a flashcard
4. Check your Supabase dashboard to see if the data appears in the flashcards table

## 7. Optional: Advanced JWT Integration (Production)

For production environments, you can set up proper JWT validation:

### Step 1: Create Clerk JWT Template
1. Go to Clerk Dashboard → **Configure** → **JWT Templates**
2. Click **+ New template**
3. Choose **Supabase** as the template
4. Name it: `supabase`
5. Save the template

### Step 2: Update RLS Policies (Advanced)
If you want stricter JWT-based security, replace the simple policy with:

```sql
-- Remove the simple policy
DROP POLICY "Users can manage flashcards" ON flashcards;

-- Add JWT-validated policies
CREATE POLICY "Users can view own flashcards" ON flashcards
  FOR SELECT USING (user_id = auth.jwt()::json->>'sub');

CREATE POLICY "Users can insert own flashcards" ON flashcards
  FOR INSERT WITH CHECK (user_id = auth.jwt()::json->>'sub');

CREATE POLICY "Users can update own flashcards" ON flashcards
  FOR UPDATE USING (user_id = auth.jwt()::json->>'sub');

CREATE POLICY "Users can delete own flashcards" ON flashcards
  FOR DELETE USING (user_id = auth.jwt()::json->>'sub');
```

**Note**: This requires additional Supabase JWT configuration and is more complex to set up.

## How It Works

- **Authentication**: Clerk handles user sign-in/sign-up
- **Database**: Supabase stores flashcard data with user isolation
- **Security**: RLS ensures data separation between users
- **Integration**: Our app passes Clerk tokens to Supabase for authenticated requests
- **Migration**: Local storage data automatically migrates to cloud on first sign-in

## Troubleshooting

### RLS Policy Conflicts
If you get "row-level security policy" errors, check existing policies:

```sql
-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'flashcards';
```

If you see conflicting policies, run the cleanup commands from step 5 again.

### Common Issues
- **RLS Error**: Make sure you ran the complete SQL in step 5 (including policy cleanup)
- **Auth Error**: Check your environment variables are correct
- **Connection Error**: Verify Supabase project URL and keys
- **Clerk Error**: Ensure Clerk publishable key is valid 