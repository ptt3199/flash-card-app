import { useFlashcardsContext } from '../App';
import { ManagementMode } from '../components/ManagementMode';

export function ManagementPage() {
  const { flashcards, addFlashcard, updateFlashcard, deleteFlashcard, loading } = useFlashcardsContext();

  return (
    <ManagementMode flashcards={flashcards} addFlashcard={addFlashcard} updateFlashcard={updateFlashcard} deleteFlashcard={deleteFlashcard} loading={loading} />
  );
}