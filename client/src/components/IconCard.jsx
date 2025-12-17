import {useState} from "react"
import { AnimatePresence, motion } from 'framer-motion';
import { hoverSound, clickSound} from '../utils/Sounds';


const IconCard = ({ icon, onClick}) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      onMouseEnter={() => {clickSound.play(), setIsHovered(true)}}
      onMouseLeave={() => { setIsHovered(false)}}
      onMouseOver={() => {hoverSound.play()}}
      className="relative rounded-lg  cursor-pointer  bg-transparent"
    >
        <div
          className=" w-10 h-10 mb-4 flex items-center justify-center bg-gray-800 dark:bg-gray-500 rounded text-gray-900 dark:text-gray-800"
          dangerouslySetInnerHTML={{ __html: icon.svg }}

        />
        <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 px-2 py-1 bg-gray-600 text-white text-xs rounded whitespace-nowrap pointer-events-none"
          >
            {icon.name}
            {/* Optional Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-600" />
          </motion.div>
        )}
      </AnimatePresence>
        
    </motion.div>
  );
};

export default IconCard;