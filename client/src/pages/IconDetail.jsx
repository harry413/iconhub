import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { clickSound, successSound, errorSound } from '../utils/Sounds';
import { Button } from '../components/ui/button';
import { FiDownload, FiHeart, FiArrowLeft } from 'react-icons/fi';
import ShareButton from '../components/ShareButton';
const BASE_URL = import.meta.env.VITE_API_URL;

const IconDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [icon, setIcon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { theme } = useTheme();


  useEffect(() => {
    const fetchIcon = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/icons/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch icon');
        }

        setIcon(data);
        
    // Check if icon is in favorites (implemented)
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const favResponse = await fetch(`${BASE_URL}/api/users/me`, {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` }
            });
    

            if (favResponse.ok) {
              const userData = await favResponse.json();
    
              if (Array.isArray(userData.favorites)) {
                setIsFavorite(userData.favorites.includes(id));
              } else {
                setIsFavorite(false);
              }
            }
          }
        } catch (favErr) {
          // Non-fatal: if favorite check fails, log and continue
          // (don't surface to UI as it shouldn't block icon display)
          console.error('Failed to check favorites', favErr);
        }
        
        successSound.play();
      } catch (err) {
        errorSound.play();
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIcon();
  }, [id]);

  const handleDownload = (format) => {
    clickSound.play();
    if (!icon) return;
    
    const link = document.createElement('a');
    link.href = format === 'svg' ? icon.svg : icon.tsx;
    link.download = `${icon.name}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFavorite = async () => {
    clickSound.play();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`${BASE_URL}/api/users/favorites/${id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update favorites');
      }

      setIsFavorite(!isFavorite);
      successSound.play();
    } catch (err) {
      errorSound.play();
      setError(err.message || String(err));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-xl text-red-500">{error}</p>
        <Button
          className="mt-4"
          onClick={() => {
            clickSound.play();
            navigate('/icons');
          }}
        >
          Back to Icon Library
        </Button>
      </motion.div>
    );
  }

  if (!icon) {
    return null;
  }

  return (
    <div
      className={`container mx-auto px-4 py-8 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => {
          clickSound.play();
          navigate("/icons");
        }}
      >
        <FiArrowLeft className="mr-2" /> Back to Library
      </Button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-800/50 to-black dark:from-gray-800 dark:to-gray-600 rounded-lg"
            >
              <div
                className="w-full h-64 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: icon.svg , style:"width:200%; height:200%"}}
              />
            </motion.div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{icon.name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm">
                  {icon.category}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {icon.downloads} downloads
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {icon.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <ShareButton icon={icon} className="z-10" />
                <Button
                  onClick={() => handleDownload("svg")}
                  className="flex items-center"
                >
                  <FiDownload className="mr-2" /> Download SVG
                </Button>
                <Button
                  onClick={() => handleDownload("png")}
                  className="flex items-center"
                >
                  <FiDownload className="mr-2" /> Download PNG
                </Button>
                <Button
                  onClick={() => handleDownload("tsx")}
                  className="flex items-center"
                >
                  <FiDownload className="mr-2" /> Download Animated
                </Button>
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  onClick={toggleFavorite}
                  className="flex items-center"
                >
                  <FiHeart className="mr-2" />
                  {isFavorite ? "Favorited" : "Add to Favorites"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IconDetail;