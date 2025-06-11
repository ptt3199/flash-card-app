import { useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';

export default function IndexPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/manage');
    }
  }, [isLoaded, isSignedIn, router]);

  // Render a loading state or nothing while checking auth/redirecting.
  // The AuthGuard will show the landing page if not signed in.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Force server-side rendering to avoid prerendering issues with Clerk
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
}; 