
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import IconCard from '../components/IconCard';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { successSound } from '../utils/Sounds';
const BASE_URL = import.meta.env.VITE_API_URL;
console.log('BASE_URL:', BASE_URL);

const IconLibrary = () => {
  const [icons, setIcons] = useState([]);
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/icons`);
        const data = await response.json();
        setIcons(data);
        setFilteredIcons(data);
        setIsLoading(false);
        successSound.play();
      } catch (error) {
        console.error('Error fetching icons:', error);
        setIsLoading(false);
      }
    };

    fetchIcons();
  }, []);

  useEffect(() => {
    let results = icons;
    
    if (searchTerm) {
      results = results.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (category !== 'all') {
      results = results.filter(icon => icon.category === category);
    }
    
    setFilteredIcons(results);
  }, [searchTerm, category, icons]);

  const categories = ['all', ...new Set(icons.map(icon => icon.category))];

  const handleDownload = (icon) => {
    // Create a temporary link to download the SVG/icon file
    const svgData = icon.svg; // assuming icon.svg contains SVG markup as string
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${icon.name}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    console.log('Downloading:', icon.name);
  };

  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage if available
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const handleFavorite = (icon) => {
    setFavorites(prev => {
      let updated;
      if (prev.some(fav => fav._id === icon._id)) {
        updated = prev.filter(fav => fav._id !== icon._id);
      } else {
        updated = [...prev, icon];
      }
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    // Optionally, update filteredIcons to mark favorites
    setFilteredIcons(prev =>
      prev.map(icon => ({
        ...icon,
        isFavorite: favorites.some(fav => fav._id === icon._id),
      }))
    );
  }, [favorites]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Icon Library
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border border-gray-400 rounded-full focus:outline-none"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredIcons.map(icon => (
            <IconCard
              key={icon._id}
              icon={icon}
              onDownload={handleDownload}
              onFavorite={handleFavorite}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredIcons.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-xl">No icons found matching your criteria</p>
        </motion.div>
      )}
    </div>
  );
};

export default IconLibrary;