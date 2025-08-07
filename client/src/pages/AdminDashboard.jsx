import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { clickSound, errorSound } from "../utils/Sounds";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
const BASE_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const {user}  = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.isAdmin || !activeTab) return;

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`${BASE_URL}/api/admin/${activeTab}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
           },
          credentials: "include"
        });
       
        if (!response.ok) {    
          throw new Error("Access denied or failed to fetch data");
        }

        const data = await response.json();
        
        if (activeTab === "users") {
          setUsers(data);
        } else {
          setIcons(data);
        }
      } catch (err) {
        errorSound.play();        
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchData();
    }
  }, [activeTab, user]);

  const toggleAdminStatus = async (userId) => {
    try {
      clickSound.play();
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/toggle-admin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, isAdmin: data.user.isAdmin } : u
        )
      );
    } catch (err) {
      errorSound.play();
      setError(err.message);
    }
  };

  const deleteIcon = async (iconId) => {
    try {
      clickSound.play();
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/admin/icons/${iconId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete icon");
      }

      setIcons(icons.filter((icon) => icon._id !== iconId));
    } catch (err) {
      errorSound.play();
      setError(err.message);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 h-screen `}>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded"
        >
          {error}
        </motion.div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-xs mb-8">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="icons">Icons</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.isAdmin ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Button
                        variant={user.isAdmin ? "destructive" : "default"}
                        onClick={() => toggleAdminStatus(user._id)}
                      >
                        {user.isAdmin ? "Remove Admin" : "Make Admin"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="icons">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {icons.map((icon) => (
                  <TableRow key={icon._id}>
                    <TableCell>{icon.name}</TableCell>
                    <TableCell>{icon.category}</TableCell>
                    <TableCell>
                      {icon.createdBy?.username || "Unknown"}
                    </TableCell>
                    <TableCell>{icon.downloads}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => deleteIcon(icon._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
