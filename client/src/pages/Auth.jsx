import { useState, } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { clickSound, successSound, errorSound } from "../utils/Sounds";
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FiGithub } from 'react-icons/fi';

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { theme } = useTheme()



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isLogin ? '/api/users/login' : '/api/users/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      successSound.play();
      navigate('/');
    } catch (err) {
      errorSound.play();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-end py-12 md:pr-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md p-16 rounded-l-2xl md:rounded-l-full shadow-2xl border-2  border-black mask-radial-[100%_100%] mask-radial-from-85% mask-radial-at-left  ${
          theme === "dark"
            ? "bg-gray-500 bg-transparent outline"
            : "bg-gradient-to-r from-[#abbaab] to-[#ffffff]"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className=""
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 text-sm">
                Username
              </label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className=""
                placeholder="Username must be 3-20 characters long and can only contain letters, numbers, and underscores"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className=""
              placeholder="Please enter a valid email address"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm">
              Password
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className=""
              placeholder="Password must be at least 6 characters long"
            />
          </div>

          <Button
            type="submit"
            className="cursor-pointer"
            disabled={loading}
            onClick={() => clickSound.play()}
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block"
                style={{ fontSize: "1.2rem" }}
              >
                ⏳
              </motion.span>
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            type="button"
            className=" cursor-pointer"
            onClick={() => {
              clickSound.play();
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Button>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <FcGoogle className="h-5 w-5" />
              <span>Google</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 cursor-pointer"
              disabled
            >
              <FiGithub className="h-5 w-5" />
              <span>GitHub</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;