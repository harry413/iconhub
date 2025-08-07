import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import {motion} from 'framer-motion';
import { useAuth } from "../context/AuthContext";
import { clickSound, successSound, errorSound } from '../utils/Sounds';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
const BASE_URL = import.meta.env.VITE_API_URL;

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    tags: '',
    svgFile: null,
    pngFile: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'general',
    'social',
    'brands',
    'technology',
    'nature',
    'business',
    'health',
    'education'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });

    if (name === 'svgFile' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsText(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('category', formData.category);
      form.append('tags', formData.tags);
      form.append('svg', formData.svgFile);
      form.append('png', formData.pngFile);

      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/icons`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      successSound.play();
      // Reset form after successful upload
      setFormData({
        name: '',
        category: '',
        tags: '',
        svgFile: null,
        pngFile: null
      });
      setPreview(null);
    } catch (err) {
      errorSound.play();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="text-center py-12 h-screen pt-24">
        <h2 className="text-2xl mb-4">Please login to Upload the icons</h2>
        <Button
          onClick={() => {
            clickSound.play();
            navigate("/auth");
          }}
          className="px-6 py-2 rounded cursor-pointer"
        >
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12 mb-8  rounded-l-md rounded-tr-full outline-black bg-transparent border-2 shadow-md shadow-gray-400">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center bg-gradient-to-tl from-[#1f1e20] to-[#373317] dark:text-gray-200 text-transparent bg-clip-text"
      >
        Upload New Icon
      </motion.h1>

      <div className="max-w-2xl mx-auto">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block mb-2">
                Icon Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Social Media Icon"
                className=""
              />
            </div>

            <div>
              <label htmlFor="category" className="block mb-2">
                Category
              </label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
                className=""
                as="Select"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="tags" className="block mb-2">
              Tags (comma separated)
            </label>
            <Textarea
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., social, media, share"
              className=""
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="svgFile" className="block mb-2">
                SVG File (required)
              </label>
              <Input
                type="file"
                id="svgFile"
                name="svgFile"
                accept=".svg"
                onChange={handleChange}
                required
                className=""
              />
              {preview && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded"
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              )}
            </div>

            <div>
              <label htmlFor="pngFile" className="block mb-2">
                PNG File (required)
              </label>
              <Input
                type="file"
                id="pngFile"
                name="pngFile"
                accept=".png"
                onChange={handleChange}
                required
                className=""
              />
            </div>
          </div>

          <Button
            type="submit"
            className="cursor-pointer"
            disabled={loading}
            onClick={() => clickSound.play()}
          >
            {loading ? "Uploading..." : "Upload Icon"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Upload;