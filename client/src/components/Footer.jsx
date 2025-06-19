import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { hoverSound } from '../utils/sounds';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`mt-auto py-8 bg-transparent ${theme === 'dark' ? "bg-transparent":'bg-gradient-to-r from-[#abbaab] to-[#ffffff]'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-0"
          >
            <h2 className={`text-xl font-bold text-transparent bg-clip-text ${theme === 'dark' ? "bg-gradient-to-r from-[#abbaab] to-[#ffffff]":'bg-gradient-to-r from-[#8e0e00] to-[#1f1c18]'}`}>IconHub</h2>
            <p className="text-sm mt-2">
              A beautiful collection of free icons for your projects
            </p>
          </motion.div>

          <div className="flex space-x-6">
            <motion.a
              whileHover={{ y: -2 }}
              onMouseEnter={() => hoverSound.play()}
              href="https://github.com/harry413"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6" />
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              onMouseEnter={() => hoverSound.play()}
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="w-6 h-6" />
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              onMouseEnter={() => hoverSound.play()}
              href="https://www.linkedin.com/in/sachin-patidar-921578213/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6" />
            </motion.a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 pt-8 border-t text-center text-sm"
        >
          <p>© {new Date().getFullYear()} IconHub. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;