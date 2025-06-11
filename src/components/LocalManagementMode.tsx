import { useState } from 'react';
import { Plus, Play, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { CardForm } from './CardForm';
import type { FlashcardData } from '../types';
import { useNavigate } from 'react-router-dom';
import { useFlashcardsLocal } from '../hooks/useFlashcardsLocal';

export function LocalManagementMode() {
  const navigate = useNavigate();
  const { 
    cards, 
    addCard, 
    updateCard, 
    deleteCard, 
    isLoading, 
    setMode 
  } = useFlashcardsLocal();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddCard = (cardData: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => {
    addCard(cardData);
    setShowAddForm(false);
  };

  const handleUpdateCard = (cardData: Omit<FlashcardData, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCard) {
      updateCard(editingCard.id, cardData);
      setEditingCard(null);
    }
  };

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
    setDeleteConfirm(null);
  };

  const handleStartStudy = () => {
    console.log('LocalManagementMode: Start Study clicked, cards.length =', cards.length);
    if (cards.length === 0) {
      alert('Please add some flashcards first!');
      return;
    }
    console.log('LocalManagementMode: Calling setMode(study)');
    setMode('study');
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
              <h1 className="text-3xl font-bold text-gray-800">
                Flashcards 
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Local Mode
                </span>
              </h1>
              <p className="text-gray-600 mt-1">
                {cards.length === 0 
                  ? 'No flashcards yet. Add your first card to get started!'
                  : `${cards.length} card${cards.length === 1 ? '' : 's'} in your collection (stored locally)`
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
                  onClick={handleStartStudy}
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
          // Enhanced Welcome Hero Section for Local Mode
          <div className="relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-100 rounded-full opacity-20"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-100 rounded-full opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-100 rounded-full opacity-10"></div>
            </div>

            {/* Main Hero Content */}
            <div className="relative text-center py-16">
              {/* Local Mode Info */}
              <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">You're in Local Mode</h3>
                    <p className="text-gray-600 mb-3">
                      Your flashcards are saved locally on this device. Sign in to sync across devices and never lose your progress.
                    </p>
                    <button
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Switch to Cloud Mode
                    </button>
                  </div>
                </div>
              </div>

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
                
                <a
                  href="https://your-portfolio-website.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  Learn More About This Project
                </a>
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
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCard(card)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(card.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-gray-600 text-sm mb-4">
                  {card.meaning}
                </div>

                {(card.synonyms || card.antonyms) && (
                  <div className="space-y-2 text-sm">
                    {card.synonyms && (
                      <p className="text-gray-600">
                        <span className="font-medium">Synonyms:</span> {card.synonyms}
                      </p>
                    )}
                    {card.antonyms && (
                      <p className="text-gray-600">
                        <span className="font-medium">Antonyms:</span> {card.antonyms}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  Last updated: {formatDate(card.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Card</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this flashcard? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCard(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 