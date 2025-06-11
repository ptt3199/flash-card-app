import { LocalApp } from '../components/LocalApp';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

export default function LocalPage() {
  const router = useRouter();

  return (
    <LocalApp onBackToHome={() => router.push('/')} />
  );
}

// Force server-side rendering to avoid prerendering issues with Clerk
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};