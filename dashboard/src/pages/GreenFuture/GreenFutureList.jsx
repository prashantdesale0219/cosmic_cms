import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getGreenFuture, deleteNewsCard } from '../../services/greenFutureService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';

const GreenFutureList = () => {
  const [greenFuture, setGreenFuture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNewsCard, setSelectedNewsCard] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchGreenFuture();
  }, []);

  const fetchGreenFuture = async () => {
    try {
      setLoading(true);
      const data = await getGreenFuture();
      console.log('Fetched Green Future data:', data);
      
      // Ensure newsCards is always an array
      if (!data.newsCards) {
        console.log('newsCards is undefined, setting to empty array');
        data.newsCards = [];
      }
      
      console.log('News Cards length:', data.newsCards.length);
      setGreenFuture(data);
      setError(null);
    } catch (err) {
      setError('Failed to load Green Future data');
      toast.error('Failed to load Green Future data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (newsCard) => {
    setSelectedNewsCard(newsCard);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNewsCard) return;

    try {
      await deleteNewsCard(selectedNewsCard._id, token);
      toast.success('News card deleted successfully');
      fetchGreenFuture();
    } catch (err) {
      toast.error('Failed to delete news card');
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setSelectedNewsCard(null);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={fetchGreenFuture}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const hasNewsCards = greenFuture && greenFuture.newsCards && greenFuture.newsCards.length > 0;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Green Future Section</h1>
        <Link
          to="/green-future/edit"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <PencilIcon className="h-5 w-5 mr-2" />
          Edit Section
        </Link>
      </div>

      {greenFuture ? (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">{greenFuture.title}</h2>
          <p className="text-gray-600 mb-4">{greenFuture.description}</p>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="font-medium mr-2">CTA:</span>
            <span className="bg-gray-100 px-2 py-1 rounded mr-2">{greenFuture.ctaText}</span>
            <span className="text-primary-600">{greenFuture.ctaLink}</span>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            No Green Future section data found. Please create one by clicking the Edit Section button.
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">News Cards</h2>
        <Link
          to="/green-future/news/new"
          className="bg-accent-500 text-white px-4 py-2 rounded-md hover:bg-accent-600 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add News Card
        </Link>
      </div>

      {!hasNewsCards ? (
        <EmptyState
          title="No news cards found"
          description="Get started by creating a new news card."
          buttonText="Add News Card"
          buttonLink="/green-future/news/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {greenFuture.newsCards.map((newsCard) => (
            <div key={newsCard._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {newsCard.image ? (
                  <img
                    src={newsCard.image}
                    alt={newsCard.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-primary-50 p-1.5 rounded-full shadow-md mr-2">
                    <img src={newsCard.logo} alt="Logo" className="w-5 h-5" />
                  </div>
                  <span className="text-gray-500 text-sm">{newsCard.date}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{newsCard.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{newsCard.excerpt}</p>
                <div className="flex justify-end space-x-2">
                  <Link
                    to={`/green-future/news/edit/${newsCard._id}`}
                    className="text-primary-600 hover:text-primary-800 p-2"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(newsCard)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete News Card"
        message="Are you sure you want to delete this news card? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default GreenFutureList;