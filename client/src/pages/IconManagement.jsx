import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { clickSound, errorSound, successSound } from '../utils/Sounds';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { FiSearch, FiTrash2, FiDownload, FiEye } from 'react-icons/fi';
import { Badge } from '../components/ui/badge';
const BASE_URL = import.meta.env.VITE_API_URL;

const IconManagement = () => {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/admin/icons`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch icons');
        }

        const data = await response.json();
        setIcons(data);
        successSound.play();
      } catch (err) {
        errorSound.play();
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  const filteredIcons = icons.filter((icon) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      icon.name.toLowerCase().includes(searchLower) ||
      icon.category.toLowerCase().includes(searchLower) ||
      icon.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const deleteIcon = async (iconId) => {
    if (!window.confirm('Are you sure you want to delete this icon?')) return;

    try {
      clickSound.play();
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/admin/icons/${iconId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete icon');
      }

      setIcons(icons.filter((icon) => icon._id !== iconId));
      successSound.play();
    } catch (err) {
      errorSound.play();
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search icons..."
            className="pl-10 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <div className="rounded-md border-b">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIcons.map((icon) => (
                <motion.tr
                  key={icon._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>
                    <div
                      className="w-10 h-10"
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{icon.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{icon.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {icon.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      {icon.tags.length > 3 && (
                        <Badge variant="outline">+{icon.tags.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{icon.downloads}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm">
                      <FiEye className="mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <FiDownload className="mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteIcon(icon._id)}
                    >
                      <FiTrash2 className="mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default IconManagement;