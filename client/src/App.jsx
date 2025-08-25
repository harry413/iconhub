import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import IconLibrary from './pages/IconLibrary';
import IconDetail from './pages/IconDetail';
import Upload from './pages/Upload';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites"
import AdminLayout from './Layout/AdminLayout';
import RequireAuth from './components/RequireAuth';
import Settings from './pages/Settings'
import Analytics from "./pages/Analytics"
import UserManagement from "./pages/UserManagement"
import IconManagement from "./pages/IconManagement"
import UserSetting from "./pages/UserSetting"
import Background from './components/Bg'
import LoadingScreen from "./components/LoadingScreen";

function App() {

  return (
    <ThemeProvider>
      
      <Background />
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#abbaab] to-[#ffffff] dark:from-slate-900 dark:to-[#1f1c18]">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/icons" element={<IconLibrary />} />
            <Route path="/icons/:id" element={<IconDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/settings" element={<UserSetting />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/admin/*"
              element={
                <RequireAuth adminOnly>
                  <AdminLayout />
                </RequireAuth>
              }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="upload" element={<Upload />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="icons" element={<IconManagement />} />
            </Route>
            <Route path="/favorite" element={<Favorites />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;