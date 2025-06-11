import { useFlashcardsContext } from '../App';
import { StudyMode } from '../components/StudyMode';

export function StudyPage() {
  const { flashcards } = useFlashcardsContext();

  console.log('StudyPage: Rendering StudyMode with', flashcards.length, 'cards');
  return <StudyMode flashcards={flashcards} />;
}
