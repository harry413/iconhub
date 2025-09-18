
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
      className="rounded-lg overflow-hidden cursor-pointer  bg-transparent"
    >
      <div className="p-2 flex flex-col items-center">
        <div
          className="w-10 h-10 mb-4 flex items-center justify-center bg-gray-800 dark:bg-gray-500 rounded text-gray-900 dark:text-gray-800"
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
      </div>
    </motion.div>
  );
};

export default IconCard;