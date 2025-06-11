import { useState } from 'react';
import { Plus, Play, Edit2, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { CardForm } from './CardForm';
import type { FlashcardData } from '../types';

interface ManagementModeProps {
  cards: FlashcardData[];
  onAddCard: (card: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateCard: (id: string, data: Partial<FlashcardData>) => void;
  onDeleteCard: (id: string) => void;
  onStartStudy: () => void;
  isLoading?: boolean;
}

export function ManagementMode({
  cards,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onStartStudy,
  isLoading = false,
}: ManagementModeProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddCard = (cardData: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => {
    onAddCard(cardData);
    setShowAddForm(false);
  };

  const handleUpdateCard = (cardData: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCard) {
      onUpdateCard(editingCard.id, cardData);
      setEditingCard(null);
    }
  };

  const handleDeleteCard = (id: string) => {
    onDeleteCard(id);
    setDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Show add form
  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Flashcard</h2>
            <CardForm
              onSubmit={handleAddCard}
              onCancel={() => setShowAddForm(false)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show edit form
  if (editingCard) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Flashcard</h2>
            <CardForm
              onSubmit={handleUpdateCard}
              onCancel={() => setEditingCard(null)}
              initialData={editingCard}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Flashcards</h1>
              <p className="text-gray-600 mt-1">
                {cards.length === 0 
                  ? 'No flashcards yet. Add your first card to get started!'
                  : `${cards.length} card${cards.length === 1 ? '' : 's'} in your collection`
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Card
              </button>
              
              {cards.length > 0 && (
                <button
                  onClick={onStartStudy}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Start Study
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {cards.length === 0 ? (
          // Enhanced Welcome Hero Section
          <div className="relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-100 rounded-full opacity-10"></div>
            </div>

            {/* Main Hero Content */}
            <div className="relative text-center py-16">
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Card
                </button>
                
                <div className="text-gray-400 text-sm">or</div>
                
                            <Link href="https://your-portfolio-website.com" legacyBehavior>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                Learn More About This Project
              </a>
            </Link>
              </div>
            </div>
          </div>
        ) : (
          // Cards grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {card.word}
                    </h3>
                    {card.pronunciation && (
                      <p className="text-sm text-gray-600 mb-2">
                        {card.pronunciation}
                      </p>
                    )}
                    {card.partOfSpeech && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {card.partOfSpeech}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => setEditingCard(card)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit card"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(card.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Definition:</h4>
                    <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
                      {card.meaning}
                    </p>
                  </div>

                  {card.examples && card.examples.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Example:</h4>
                      <p className="text-gray-600 text-sm italic line-clamp-2">
                        &ldquo;{card.examples[0]}&rdquo;
                      </p>
                    </div>
                  )}

                  {card.personalNotes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {card.personalNotes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Added {formatDate(card.createdAt)}
                    {card.updatedAt !== card.createdAt && (
                      <span> • Updated {formatDate(card.updatedAt)}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Flashcard</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this flashcard? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteCard(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 