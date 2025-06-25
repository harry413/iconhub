import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { hoverSound, clickSound, successSound, errorSound } from '../utils/sounds';
import { FiDownload, FiHeart } from 'react-icons/fi';

const IconCard = ({ icon, onFavoriteUpdate }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(icon.isFavorite || false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFavorite = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth';
      return;
    }

    setIsProcessing(true);
    try {
      clickSound.play();
      const token = localStorage.getItem('token');
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`/api/users/favorites/${icon._id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
      }

      // Toggle the favorite status
      setIsFavorite(!isFavorite);
      successSound.play();
      
      // Notify parent component of the change
      if (onFavoriteUpdate) {
        onFavoriteUpdate(icon._id, !isFavorite);
      }
    } catch (err) {
      errorSound.play();
      console.error('Favorite error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => hoverSound.play()}
      className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800"
    >
      <div className="p-4 flex flex-col items-center">
        <div
          className="w-16 h-16 mb-4 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
        <h3 className="text-lg font-medium text-center mb-2">{icon.name}</h3>
        <div className="flex space-x-2 mt-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              clickSound.play();
              // Handle download
            }}
            className="p-2 rounded-full bg-blue-500 text-white"
          >
            <FiDownload />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleFavorite}
            disabled={isProcessing}
            className={`p-2 rounded-full ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiHeart className={isFavorite ? 'fill-current' : ''} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default IconCard;