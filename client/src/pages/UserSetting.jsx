import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { successSound, errorSound } from '../utils/Sounds';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiSave, FiUpload, FiTrash2 } from 'react-icons/fi';
// import AvatarEditor from 'react-avatar-editor';
const BASE_URL = import.meta.env.VITE_API_URL;

const UserSetting = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailNotifications: true,
    soundEffects: true,
  });
  // const [avatar, setAvatar] = useState(null);
  // const [editor, setEditor] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPreferences({
        darkMode: user.preferences?.darkMode || false,
        emailNotifications: user.preferences?.emailNotifications || true,
        soundEffects: user.preferences?.soundEffects || true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePreferenceChange = (name, value) => {
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleAvatarChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setAvatar(e.target.files[0]);
  //   }
  // };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      successSound.play();
    } catch (err) {
      errorSound.play();
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      errorSound.play();
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/users/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      successSound.play();
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      errorSound.play();
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      successSound.play();
    } catch (err) {
      errorSound.play();
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSaveAvatar = async () => {
  //   if (!editor || !avatar) return;

  //   setIsLoading(true);
  //   setError('');

  //   try {
  //     const canvas = editor.getImageScaledToCanvas();
  //     const blob = await new Promise(resolve => canvas.toBlob(resolve));
      
  //     const formData = new FormData();
  //     formData.append('avatar', blob, 'avatar.png');

  //     const token = localStorage.getItem('token');
  //     const response = await fetch('/api/users/avatar', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: formData
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update avatar');
  //     }

  //     const updatedUser = await response.json();
  //     updateUser(updatedUser);
  //     setAvatar(null);
  //     successSound.play();
  //   } catch (err) {
  //     errorSound.play();
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/users/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Handle logout and redirect
    
      navigate('/');
    } catch (err) {
      errorSound.play();
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <motion.form 
            onSubmit={handleSaveProfile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 max-w-2xl"
          >
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <FiMail className="text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              <FiSave className="mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </motion.form>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password" className="mt-6">
          <motion.form 
            onSubmit={handleSavePassword}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 max-w-2xl"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <div className="flex items-center gap-2">
                  <FiLock className="text-gray-400" />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <div className="flex items-center gap-2">
                  <FiLock className="text-gray-400" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength="8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <div className="flex items-center gap-2">
                  <FiLock className="text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="8"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              <FiSave className="mr-2" />
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </motion.form>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="mt-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 max-w-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Dark Mode</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle between light and dark theme
                </p>
              </div>
              <Switch
                checked={preferences.darkMode}
                onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email notifications
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sound Effects</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable sound effects in the app
                </p>
              </div>
              <Switch
                checked={preferences.soundEffects}
                onCheckedChange={(checked) => handlePreferenceChange('soundEffects', checked)}
              />
            </div>

            <Button onClick={handleSavePreferences} disabled={isLoading}>
              <FiSave className="mr-2" />
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </motion.div>
        </TabsContent>

        {/* //Avatar Tab
        <TabsContent value="avatar" className="mt-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 max-w-2xl"
          >
            <div className="flex flex-col items-center gap-4">
              {avatar ? (
                <>
                  <AvatarEditor
                    ref={setEditor}
                    image={avatar}
                    width={200}
                    height={200}
                    border={50}
                    borderRadius={100}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={1.2}
                    rotate={0}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setAvatar(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveAvatar}
                      disabled={isLoading}
                    >
                      <FiUpload className="mr-2" />
                      {isLoading ? 'Uploading...' : 'Save Avatar'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-400">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline">
                      <FiUpload className="mr-2" />
                      Upload New Avatar
                    </Button>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </Label>
                </>
              )}
            </div>
          </motion.div>
        </TabsContent> */}
      </Tabs>

      {/* Danger Zone */}
      <div className="mt-12 pt-8 border-t border-red-200 dark:border-red-900/50">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              <FiTrash2 className="mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSetting;