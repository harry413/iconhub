
import { motion } from 'framer-motion';
import { hoverSound, clickSound} from '../utils/Sounds';


const IconCard = ({ icon, onClick}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      onMouseEnter={() => clickSound.play()}
      onMouseOver={() => hoverSound.play()}
      className=" rounded-lg overflow-hidden cursor-pointer  bg-transparent"
    >
        <div
          className=" w-10 h-10 mb-4 flex items-center justify-center bg-gray-800 dark:bg-gray-500 rounded text-gray-900 dark:text-gray-800"
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
        
    </motion.div>
  );
};

export default IconCard;