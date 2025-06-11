import { useRouter } from 'next/router';
import { ManagementMode } from '../components/ManagementMode';
import { useFlashcards } from '../contexts/FlashcardContext';
import { Header } from '../components/Header';
import { GetServerSideProps } from 'next';

export default function ManagePage() {
  const router = useRouter();
  const {
    cards,
    addCard,
    updateCard,
    deleteCard,
    isLoading,
  } = useFlashcards();

  if (isLoading && cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <ManagementMode
        cards={cards}
        onAddCard={addCard}
        onUpdateCard={updateCard}
        onDeleteCard={deleteCard}
        onStartStudy={() => router.push('/study')}
        isLoading={isLoading}
      />
    </>
  );
}

// Force server-side rendering to avoid prerendering issues with Clerk
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};