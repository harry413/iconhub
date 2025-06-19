import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import IconCard from "../components/IconCard";
import { motion } from "framer-motion";
import { clickSound, errorSound } from "../utils/Sounds";
import { Button} from "../components/ui/button"

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/users/favorites", {
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
      const response = await fetch(`/api/users/favorites/${iconId}`, {
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
      <div className="text-center py-12 h-screen pt-24">
        <h2 className="text-2xl mb-4">Please login to view your favorites</h2>
        <Button
          onClick={() => {
            clickSound.play();
            navigate("/auth");
          }}
          className="px-6 py-2 rounded cursor-pointer"
        >
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
