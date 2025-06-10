// Clerk configuration
export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
};
 
// Check if Clerk is properly configured
export const isClerkConfigured = () => {
  return !!clerkConfig.publishableKey;
}; 