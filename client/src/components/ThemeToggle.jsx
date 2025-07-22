
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { TiAdjustBrightness } from "react-icons/ti";
import { AiFillMoon } from "react-icons/ai";
import { clickSound } from '../utils/sounds';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        clickSound.play();
        toggleTheme();
      }}
      className="p-2 rounded-full"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <AiFillMoon className="w-5 h-5" />
      ) : (
        <TiAdjustBrightness className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;