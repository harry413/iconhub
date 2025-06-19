import {useState} from "react"
import { motion} from "framer-motion";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { clickSound, hoverSound } from "../utils/Sounds";
import {
  FiHome,
  FiUsers,
  FiImage,
  FiSettings,
  FiPieChart,
  FiLogOut,FiMenu, FiX 
} from "react-icons/fi";;
import { useTheme } from "@emotion/react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const {theme} = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
          <p>You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  // Admin navigation items
  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <FiHome /> },
    { path: "/admin/users", label: "Users", icon: <FiUsers /> },
    { path: "/admin/icons", label: "Icons", icon: <FiImage /> },
    { path: "/admin/analytics", label: "Analytics", icon: <FiPieChart /> },
    { path: "/admin/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <div
      className="flex h-screen"
    >
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`hidden md:flex flex-col w-64 border-r border-gray-200 shadow-lg`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className={` text-transparent bg-clip-text ${theme === 'dark' ? "bg-gradient-to-r from-[#abbaab] to-[#ffffff]" : 'bg-gradient-to-r from-[#8e0e00] to-[#1f1c18]'}`}>IconHub</span>
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={() => hoverSound.play()}
                onClick={() => clickSound.play()}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Admin
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                clickSound.play();
                logout();
              }}
              onMouseEnter={() => hoverSound.play()}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              title="Logout"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile sidebar (drawer) */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className={`md:hidden p-2 fixed top-20 right-8 z-50 rounded-md shadow`}
        >
          <FiMenu className="w-6 h-6" />
        </button>

        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`fixed inset-0 z-40 md:hidden bg-white dark:bg-gray-800 w-64 shadow-lg`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="flex items-center px-4 py-3  rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 absolute bottom-0 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiLogOut />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin header */}
        <header className={` shadow-sm z-10`}>
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold">
              {navItems.find((item) => item.path === location.pathname)
                ?.label || "Admin"}
            </h2>
            <div className="flex items-center space-x-4">
              {/* Notifications, etc. */}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
