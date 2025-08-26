import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { successSound, errorSound } from "../utils/Sounds";

const BASE_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext({
  user: null,
  loading: true,
  loginWithCredentials: async () => {},
  login: () => {}, // generic login (used by Google too)
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ For email/password login
  const loginWithCredentials = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // use the generic login after success
      login(data.token, data.user);

      successSound.play();
      navigate("/");
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      errorSound.play();
      return { success: false, message: err.message };
    }
  };

  // ✅ Generic login (used for Google or credentials)
  const login = (token, user) => {
    console.log(token)
    localStorage.setItem("token", token);
    console.log(user)
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithCredentials, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
