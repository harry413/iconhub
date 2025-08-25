import { useState, } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { clickSound, successSound, errorSound } from "../utils/Sounds";
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
const BASE_URL = import.meta.env.VITE_API_URL;

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      const url = isLogin ? `${BASE_URL}/api/users/login` : `${BASE_URL}/api/users/register`;
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

  const handleGoogleSuccess = async (data) => {
    try {
      const { token, user } = data;
      login(token, user);
      successSound.play();
      navigate('/');
    } catch (err) {
      errorSound.play();
      console.log(err);
      setError('Failed to authenticate with Google');
    }
  };

  const handleGoogleFailure = (error) => {
    errorSound.play();
    console.log(error)
    setError(error.message || 'Google login failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-evenly py-12 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`z-50 w-full max-w-md p-8 md:px-24 md:py-28 md:rounded-full shadow-2xl md:border-2   ${
          theme === "dark"
          ? " bg-transparent outline md:border-white shadow-white"
          : "bg-transparent md:border-black shadow-black"
          }`}
          >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600"
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

        <div className="space-y-4">
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
          />
        </div>
      </motion.div>
    </div>
  );
};


export default Auth;