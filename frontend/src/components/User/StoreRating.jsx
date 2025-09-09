import { useState } from 'react';
import apiClient from '../../utils/api';

const StoreRating = ({ storeId, currentRating, onRatingUpdate }) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRatingClick = async (newRating) => {
    setLoading(true);
    setError('');

    try {
      await apiClient.submitRating(storeId, newRating);
      setRating(newRating);
      onRatingUpdate();
    } catch (error) {
      setError(error.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const renderInteractiveStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || rating);
      stars.push(
        <button
          key={i}
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          disabled={loading}
          className={`text-2xl transition-colors ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400 disabled:opacity-50`}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-1 mb-2">
        {renderInteractiveStars()}
      </div>
      
      {rating > 0 && (
        <p className="text-xs text-gray-600">
          Your rating: {rating}/5
        </p>
      )}
      
      {!rating && (
        <p className="text-xs text-gray-500">
          Click to rate
        </p>
      )}
      
      {loading && (
        <p className="text-xs text-blue-600">
          Submitting...
        </p>
      )}
      
      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default StoreRating;