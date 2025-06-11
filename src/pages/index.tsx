import { GetServerSideProps } from 'next';

export default function IndexPage() {
  // Let AuthGuard handle all the authentication logic and UI
  // This ensures consistent behavior between local and production
  return null;
}

// Force server-side rendering to avoid prerendering issues with Clerk
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
}; 