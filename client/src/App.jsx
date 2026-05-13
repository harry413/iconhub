import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

//context
import { ThemeProvider } from './context/ThemeContext';
  
//components
import LoadingScreen from './components/LoadingScreen';
import RequireAuth from './components/RequireAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

//pages
const Home = lazy(() => import('./pages/Home'));
const IconLibrary = lazy(() => import('./pages/IconLibrary'));
const IconDetail = lazy(() => import('./pages/IconDetail'));
const Upload = lazy(() => import('./pages/Upload'));
const Auth = lazy(() => import('./pages/Auth'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const IconManagement = lazy(() => import('./pages/IconManagement'));
const UserSetting = lazy(() => import('./pages/UserSetting'));
const Career = lazy(() => import('./pages/Career'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Docs = lazy(() => import('./pages/Docs'));
const AdminLayout = lazy(() => import('./Layout/AdminLayout'));


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider> 
         {loading && <LoadingScreen />}
      {!loading && (
        <div className="min-h-screen relative flex flex-col bg-gradient-to-r from-[#abbaab] to-[#ffffff] dark:from-slate-900 dark:to-[#1f1c18]">
          <Navbar />
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/icons" element={<IconLibrary />} />
              <Route path="/icons/:id" element={<IconDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/settings" element={<UserSetting />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/career" element={<Career />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/docs" element={<Docs />} />
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
        </Suspense>
        <Footer />
      </div>
        )}
    </ThemeProvider>
  );
}

export default App;