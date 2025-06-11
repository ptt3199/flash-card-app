import { ClerkProvider } from '@clerk/clerk-react';
import type { AppProps } from 'next/app';
import '../index.css';
import { AuthGuard } from '../components/AuthGuard';
import { FlashcardProvider } from '../contexts/FlashcardContext';

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY!}>
      <AuthGuard>
        <FlashcardProvider>
          <Component {...pageProps} />
        </FlashcardProvider>
      </AuthGuard>
    </ClerkProvider>
  );
}

export default MyApp; 