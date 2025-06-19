import { motion } from 'framer-motion';
import { hoverSound, clickSound } from '../utils/sounds';
import { useTheme } from '../context/ThemeContext';
import { FiDownload, FiHeart, FiShare } from 'react-icons/fi';
import ShareButton from "./ShareButton" 

const IconCard = ({ icon, onDownload, onFavorite }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 5.3 }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => hoverSound.play()}
      className={`rounded-lg overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gradient-to-r from-gray-400 to-slate-200' : 'bg-white'
      }`}
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
              onDownload(icon);
            }}
            className="p-2 rounded-full bg-blue-500 text-white"
          >
            <FiDownload />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              clickSound.play();
              onFavorite(icon);
            }}
            className="p-2 rounded-full bg-pink-500 text-white"
          >
            <FiHeart />
          </motion.button>
          <ShareButton icon={<FiShare/>}/>
        </div>
      </div>
    </motion.div>
  );
};

export default IconCard;