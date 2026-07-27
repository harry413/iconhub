import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import IconCard from "../components/IconCard";
import { motion } from "framer-motion";
import { clickSound, errorSound } from "../utils/Sounds";
import { Button} from "../components/ui/button"
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/users/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
          
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const data = await response.json();
        
        setFavorites(data);
      } catch (err) {
        errorSound.play();
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const handleRemoveFavorite = async (iconId) => {
    try {
      clickSound.play();
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/users/favorites/${iconId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      setFavorites(favorites.filter((icon) => icon._id !== iconId));
    } catch (err) {
      errorSound.play();
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden py-12 bg-[linear-gradient(135deg,_rgba(243,244,246,0.94),_rgba(224,231,255,0.9))]">
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-10 top-14 h-40 w-40 rounded-full bg-sky-200/70 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 24, 0], x: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-indigo-200/80 blur-3xl"
        />

        <motion.div
          animate={{ rotateY: [0, 10, 0, -10, 0], rotateX: [0, -6, 0, 6, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center perspective-[1200px]"
        >
          <div className="absolute h-72 w-72 rounded-[2rem] border border-white/70 bg-white/60 shadow-[0_20px_60px_rgba(99,102,241,0.14)] backdrop-blur-xl transform-gpu rotate-12" />
          <div className="absolute h-72 w-72 rounded-[2rem] border border-sky-100 bg-sky-50/70 shadow-[0_20px_60px_rgba(14,165,233,0.12)] backdrop-blur-xl transform-gpu -rotate-12" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center rounded-[1.75rem] border border-white/70 bg-white/30 px-10 py-8 text-center shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
          <div className="mb-4 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-[10px] font-medium uppercase tracking-[0.35em] text-slate-500">
            sign in required
          </div>
          <h2 className="mb-4 text-2xl font-semibold text-slate-800">Please login to view your favorites</h2>
          <p className="mb-6 max-w-md text-sm text-slate-600">
            Access your saved icons in a beautifully curated space.
          </p>
          <Button
            onClick={() => {
              clickSound.play();
              navigate("/auth");
            }}
            className="px-6 py-2 rounded cursor-pointer bg-slate-900 text-white hover:bg-slate-700"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-20 pb-4 py-8 min-h-screen ">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Icons</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl">You haven't favorited any icons yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favorites.map((icon) => (
            <IconCard
              key={icon._id}
              icon={icon}
              isFavorite={true}
              onFavorite={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
