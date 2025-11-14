import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { hoverSound, clickSound } from '../utils/Sounds';
import { Button } from "../components/ui/button"
import ThemeToggle from './ThemeToggle';
import UserDropdown from './UserDropdown';
import { Menu, X } from 'react-feather';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Icon Library', path: '/icons' },
    { name: 'Favorite', path:'/favorite'}
  ];

  const { logout } = useAuth();
  return (
    <div className="relative mb-10">
    <nav
      className={`py-4 px-6 fixed top-0 right-0 left-0 z-50 ${
        theme === "dark" ? "bg-transparent bg-black/30 backdrop-blur-md shadow-lg" : "bg-transparent bg-white/30 backdrop-blur-md shadow-lg"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className={`text-xl font-bold flex items-center `}
          onMouseEnter={() => hoverSound.play()}
          onClick={() => clickSound.play()}
        >
          <img src="/hilogo.png" alt="logo" className=" h-10 w-8 text-center mr-4"/>
          <span
            className={`hidden md:flex mr-2 text-2xl font-extrabold  text-transparent bg-clip-text ${
              theme === "dark"
                ? "bg-gradient-to-r from-[#abbaab] to-[#ffffff]"
                : "bg-gradient-to-r from-[#8e0e00] to-[#1f1c18]"
            }`}
          >
            HarryIconify
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className=" text-[#2f4f4f] dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
              onMouseEnter={() => hoverSound.play()}
              onClick={() => clickSound.play()}
            >
              {link.name}
            </Link>
          ))}

          {/* Conditional rendering based on auth status */}
          {user ? (
            <div className="flex items-center gap-4">
              <UserDropdown />
              <ThemeToggle />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/auth"
                className="text-[#2f4f4f] dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
                onMouseEnter={() => hoverSound.play()}
                onClick={() => clickSound.play()}
              >
                Login
              </Link>
              <ThemeToggle />
            </div>
          )}
        </div>

        <Button
          className="md:hidden p-2"
          onClick={() => {
            clickSound.play();
            setIsOpen(!isOpen);
          }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-4 py-2 text-[#2f4f4f] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  onClick={() => {
                    clickSound.play();
                    setIsOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile auth links */}
              <div className="px-4 py-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      onClick={() => {
                        clickSound.play();
                        setIsOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="block py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        onClick={() => {
                          clickSound.play();
                          setIsOpen(false);
                        }}
                      >
                        Admin
                      </Link>
                    )}
                    <Button
                      className="w-full text-left py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      onClick={() => {
                        clickSound.play();
                        setIsOpen(false);
                        logout();
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="text-[#2f4f4f] dark:text-gray-200 block py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    onClick={() => {
                      clickSound.play();
                      setIsOpen(false);
                    }}
                  >
                    Login
                  </Link>
                )}
              </div>

              <div className="px-4 py-2">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </div>
  );
};

export default Navbar;