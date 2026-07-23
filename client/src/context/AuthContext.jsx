import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { successSound, errorSound } from "../utils/Sounds";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext({
  user: null,
  loading: true,
  loginWithCredentials: async () => {},
  login: () => {}, // generic login (used by Google too)
  logout: () => {},
});

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    id: user.id || user._id,
    isAdmin: Boolean(user.isAdmin),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? normalizeUser(JSON.parse(savedUser)) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const persistUser = (nextUser) => {
    const normalizedUser = normalizeUser(nextUser);

    if (normalizedUser) {
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Restore the session from local storage on refresh.
  // Use the saved user immediately, then validate the token only if needed.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = normalizeUser(JSON.parse(savedUser));
        setUser(parsedUser);
      } catch {
        persistUser(null);
      }
    }

    if (!token) {
      setLoading(false);
      return;
    }

    if (!savedUser) {
      const checkAuth = async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const userData = await response.json();
            const normalizedUser = normalizeUser(userData);
            setUser(normalizedUser);
            persistUser(normalizedUser);
          }
        } catch (err) {
          console.error("Auth check failed:", err);
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
      return;
    }

    setLoading(false);
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
    localStorage.setItem("token", token);
    const normalizedUser = normalizeUser(user);
    setUser(normalizedUser);
    persistUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    persistUser(null);
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
