import { LocalApp } from '../components/LocalApp';
import { useRouter } from 'next/router';

export default function LocalPage() {
  const router = useRouter();

  return (
    <LocalApp onBackToLogin={() => router.push('/')} />
  );
}