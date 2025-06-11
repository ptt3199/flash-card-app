import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';
import Image from 'next/image';

export function AuthButton() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {user.imageUrl && (
            <Image
              src={user.imageUrl}
              alt={user.fullName || 'User'}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium text-gray-700">
            {user.fullName || user.emailAddresses[0]?.emailAddress}
          </span>
        </div>
        <SignOutButton>
          <button className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
        Sign In
      </button>
    </SignInButton>
  );
} 