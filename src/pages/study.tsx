import { useRouter } from 'next/router';
import { StudyMode } from '../components/StudyMode';
import { useFlashcards } from '../contexts/FlashcardContext';
import { GetServerSideProps } from 'next';

export default function StudyPage() {
  const router = useRouter();
  const {
    cards,
    currentIndex,
    isFlipped,
    viewedHistory,
    historyIndex,
    flipCard,
    nextCard,
    previousCard,
    hasCards,
  } = useFlashcards();

  if (!hasCards) {
    router.replace('/manage');
    return null;
  }

  return (
    <StudyMode
      cards={cards}
      currentIndex={currentIndex}
      isFlipped={isFlipped}
      viewedHistory={viewedHistory}
      historyIndex={historyIndex}
      onFlip={flipCard}
      onNext={nextCard}
      onPrevious={previousCard}
      onExit={() => router.push('/manage')}
    />
  );
}

// Force server-side rendering to avoid prerendering issues with Clerk
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
