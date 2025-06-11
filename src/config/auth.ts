// Clerk configuration
export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
};
 
// Check if Clerk is properly configured
export const isClerkConfigured = () => {
  return !!clerkConfig.publishableKey;
}; 