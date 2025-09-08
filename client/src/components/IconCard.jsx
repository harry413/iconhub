
import { motion } from 'framer-motion';
import { hoverSound, clickSound} from '../utils/Sounds';
import { FiDownload } from 'react-icons/fi';
import { TiHeart } from "react-icons/ti";

const IconCard = ({ icon, onFavorite, onClick, onDownload }) => {

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      onMouseEnter={() => hoverSound.play()}
      className="rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-gray-800/50 to-black dark:from-gray-800 dark:to-gray-600"
    >
      <div className="p-4 flex flex-col items-center">
        <div
          className="w-16 h-16 mb-4 flex items-center justify-center "
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
        <h3 className="text-xsm font-medium text-center mb-2 text-white">{icon.name}</h3>
        <div className="flex space-x-2 mt-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              clickSound.play();
              onDownload;
            }}
            className="p-2 rounded-full bg-blue-500 text-white"
          >
            <FiDownload />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onFavorite}
            className={`p-2 rounded-full` }
          >
            <TiHeart  />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default IconCard;