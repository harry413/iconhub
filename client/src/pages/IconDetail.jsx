import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { clickSound, successSound, errorSound } from '../utils/Sounds';
import { Button } from '../components/ui/button';
import { FiDownload, FiHeart, FiArrowLeft } from 'react-icons/fi';
import ShareButton from '../components/ShareButton';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Fallback to localhost if env variable is not set


const IconDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [icon, setIcon] = useState(null);
  const [relatedIcons, setRelatedIcons] = useState([]);
  const [trendingIcons, setTrendingIcons] = useState([]);
  const [popularIcons, setPopularIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { theme } = useTheme();

  const [copied, setCopied] = useState(false);

  
  const handleCopy = async () => {
    try {
    
      await navigator.clipboard.writeText(icon.svg);
      setCopied(true);
      
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  useEffect(() => {
    const fetchIcon = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/icons/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch icon');
        }
  
        setIcon(data);
        
        try {
          const iconsResponse = await fetch(`${BASE_URL}/api/icons`);
          const allIcons = await iconsResponse.json();
          if (iconsResponse.ok && Array.isArray(allIcons)) {
            const recommended = allIcons
              .filter((item) => item._id !== data._id)
              .map((item) => {
                const tagMatchCount = Array.isArray(item.tags)
                  ? item.tags.filter((tag) => data.tags?.includes(tag)).length
                  : 0;
                const categoryScore = item.category === data.category ? 10 : 0;
                return {
                  item,
                  score: categoryScore + tagMatchCount,
                };
              })
              .filter(({ score }) => score > 0)
              .sort((a, b) => b.score - a.score || b.item.downloads - a.item.downloads)
              .slice(0, 6)
              .map(({ item }) => item);

            setRelatedIcons(recommended);
            const recommendedIds = new Set(recommended.map((item) => item._id));

            const trending = allIcons
              .filter(
                (item) =>
                  item._id !== data._id &&
                  !recommendedIds.has(item._id) &&
                  item.category === data.category
              )
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 6);

            setTrendingIcons(trending);
            const trendingIds = new Set(trending.map((item) => item._id));

            const popular = allIcons
              .filter(
                (item) =>
                  item._id !== data._id &&
                  !recommendedIds.has(item._id) &&
                  !trendingIds.has(item._id)
              )
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 6);

            setPopularIcons(popular);
          }
        } catch (relatedErr) {
          console.error('Failed to fetch recommended icons', relatedErr);
        }

    // Check if icon is in favorites
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const favResponse = await fetch(
              `${BASE_URL}/api/users/favorites/${id}/check`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (favResponse.ok) {
              const favData = await favResponse.json();
              setIsFavorite(favData.isFavorited);
            } else {
              const errorData = await favResponse.json();
              console.warn('Favorite check failed', errorData.message);
            }
          }
        } catch (favErr) {
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

  // const handleDownload = (format) => {
  //   clickSound.play();
  //   if (!icon) return;
    
  //   const link = document.createElement('a');
  //   link.href = format === 'svg' ? icon.svg : icon.tsx;
  //   link.download = `${icon.name}.${format}`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

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

      const rawBody = await response.text();
      let serverError = rawBody;
      try {
        const parsed = JSON.parse(rawBody);
        serverError = parsed.message || JSON.stringify(parsed);
      } catch {}

      console.log('Status:', response.status);
      console.log('Server:', serverError);
      if (!response.ok) {
        throw new Error(serverError || 'Failed to update favorites');
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
        className="text-center min-h-screen flex items-center justify-center flex-col gap-4"
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
      className='container mx-auto px-4 py-8'
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
        className="bg-white/10 dark:bg-gray-800/10 rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-gray-800/50 to-black dark:from-gray-800 dark:to-gray-600 rounded-lg"
            >
              <div
                className="w-full h-64 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: icon.svg }}
              />
              <div>
                
                <motion.button
                  variant={isFavorite ? "default" : "outline"}
                  onClick={toggleFavorite}
                  initial={{ scale: 1 }}
                  whileTap={{ scale: 0.6, duration: 0.2,type: "spring"  }}
                  animate={{  scale: 1, duration: 0.2, ease: "easeInOut", type: "spring"  }}
                  className="flex items-center absolute right-2 top-2 px-2 py-1  text-white text-2xl rounded"
                > 
                  {isFavorite ? <FiHeart className="mr-2" /> : <FiHeart className="mr-2 text-red" />}
                </motion.button>
              </div>
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
                {/* <Button
                  onClick={() => handleDownload("svg")}
                  className="flex items-center"
                >
                  <FiDownload className="mr-2" /> Download SVG
                </Button> */}
                {/* <Button
                  onClick={() => handleDownload("png")}
                  className="flex items-center"
                >
                  <FiDownload className="mr-2" /> Download PNG
                </Button> */}
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    copied ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                {/* <Button
                  onClick={() => handleDownload("tsx")}
                  className="flex items-center"
                >
                  <FiDownload className="mr-2" /> Download Animated
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {relatedIcons.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Recommended Icons</h2>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {relatedIcons.map((related) => (
              <button
                key={related._id}
                type="button"
                onClick={() => {
                  clickSound.play();
                  navigate(`/icons/${related._id}`);
                }}
                className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-900/90 shadow-lg shadow-slate-950/20 ring-1 ring-white/10 transition duration-200 hover:-translate-y-1 hover:bg-slate-800/95 focus:outline-none focus:ring-2 focus:ring-primary/70"
                title={related.name}
              >
                <div className="flex h-full w-full items-center justify-center p-2">
                  <div className="h-14 w-14 text-white" dangerouslySetInnerHTML={{ __html: related.svg }} />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-2 mb-2 hidden rounded-full bg-black/75 px-2 py-1 text-center text-[11px] text-white backdrop-blur-sm group-hover:block">
                  {related.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {trendingIcons.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Trending Icons</h2>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {trendingIcons.map((related) => (
              <button
                key={related._id}
                type="button"
                onClick={() => {
                  clickSound.play();
                  navigate(`/icons/${related._id}`);
                }}
                className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-900/90 shadow-lg shadow-slate-950/20 ring-1 ring-white/10 transition duration-200 hover:-translate-y-1 hover:bg-slate-800/95 focus:outline-none focus:ring-2 focus:ring-primary/70"
                title={related.name}
              >
                <div className="flex h-full w-full items-center justify-center p-2">
                  <div className="h-14 w-14 text-white" dangerouslySetInnerHTML={{ __html: related.svg }} />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-2 mb-2 hidden rounded-full bg-black/75 px-2 py-1 text-center text-[11px] text-white backdrop-blur-sm group-hover:block">
                  {related.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {popularIcons.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Popular Icons</h2>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {popularIcons.map((related) => (
              <button
                key={related._id}
                type="button"
                onClick={() => {
                  clickSound.play();
                  navigate(`/icons/${related._id}`);
                }}
                className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-900/90 shadow-lg shadow-slate-950/20 ring-1 ring-white/10 transition duration-200 hover:-translate-y-1 hover:bg-slate-800/95 focus:outline-none focus:ring-2 focus:ring-primary/70"
                title={related.name}
              >
                <div className="flex h-full w-full items-center justify-center p-2">
                  <div className="h-14 w-14 text-white" dangerouslySetInnerHTML={{ __html: related.svg }} />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-2 mb-2 hidden rounded-full bg-black/75 px-2 py-1 text-center text-[11px] text-white backdrop-blur-sm group-hover:block">
                  {related.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconDetail;