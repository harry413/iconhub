import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { hoverSound, clickSound, successSound, errorSound } from '../utils/Sounds';
import { FiDownload } from 'react-icons/fi';
import { TiHeart } from "react-icons/ti";
const BASE_URL = import.meta.env.VITE_API_URL;

const IconCard = ({ icon, onFavoriteUpdate }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(icon.isFavorite || false );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFavorite = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth';
      return;
    }

    // Ensure icon._id exists before making the request
    if (!icon || !icon._id) {
      errorSound.play();
      console.error('Favorite error: icon._id is missing');
      return;
    }

    setIsProcessing(true);
    try {
      clickSound.play();
      const token = localStorage.getItem('token');
      const Method = isFavorite ? 'DELETE' : 'POST';

      const response = await fetch(`${BASE_URL}/api/users/favorites/${icon._id}`, {
        method: Method,
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
  const handleDownload = () => {
    if (!icon || !icon.svg || !icon.name) {
      errorSound.play();
      console.error('Download error: icon data is missing');
      return;
    }
    clickSound.play();
    const blob = new Blob([icon.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${icon.name}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    successSound.play();
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
              handleDownload;
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
            <TiHeart className={isFavorite ? 'fill-current' : ''} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default IconCard;