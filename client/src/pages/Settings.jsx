import { useState } from "react";
import { motion } from "framer-motion";
import { clickSound, successSound, errorSound } from "../utils/Sounds";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { FiSave, FiMail, FiLock, FiGlobe, FiAlertCircle } from "react-icons/fi";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    siteTitle: "IconHub",
    siteDescription: "Beautiful icons for your projects",
    siteUrl: "https://iconhub.example.com",
    allowRegistrations: true,
    emailNotifications: true,
    maintenanceMode: false,
    uploadLimit: 5,
    allowedFileTypes: ["svg", "png"],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      clickSound.play();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      successSound.play();
    } catch (err) {
      errorSound.play();
      console.log(err)
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        
        <Button onClick={handleSave} disabled={isLoading}>
          <FiSave className="mr-2 " />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-3"
        >
          <FiAlertCircle className="mt-0.5 flex-shrink-0" />
          <div>{error}</div>
        </motion.div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} >
        <TabsList className=" w-full flex items-start justify-start overflow-x-auto ">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL</Label>
              <div className="flex items-center gap-2">
                <FiGlobe className="text-gray-400" />
                <Input
                  id="siteUrl"
                  name="siteUrl"
                  value={settings.siteUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex items-center justify-between space-x-2 pt-6">
              <div className="space-y-1">
                <Label htmlFor="allowRegistrations">Allow Registrations</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable or disable new user registrations
                </p>
              </div>
              <Switch
                id="allowRegistrations"
                checked={settings.allowRegistrations}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    allowRegistrations: checked,
                  }))
                }
              />
            </div>
          </motion.div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="passwordReset">Password Reset</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure password reset requirements
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin2FA">Admin Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Require 2FA for all admin accounts
              </p>
            </div>
          </motion.div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable system email notifications
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    emailNotifications: checked,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <div className="flex items-center gap-2">
                <FiMail className="text-gray-400" />
                <Input id="smtpHost" placeholder="smtp.example.com" />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Upload Settings */}
        <TabsContent value="uploads" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="uploadLimit">Upload Limit (MB)</Label>
              <Input
                id="uploadLimit"
                name="uploadLimit"
                type="number"
                min="1"
                max="50"
                value={settings.uploadLimit}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Allowed File Types</Label>
              <div className="flex flex-wrap gap-2">
                {settings.allowedFileTypes.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                  >
                    .{type}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Take the site offline for maintenance
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, maintenanceMode: checked }))
                }
              />
            </div>
            {settings.maintenanceMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Input
                  id="maintenanceMessage"
                  placeholder="We'll be back soon!"
                />
              </motion.div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
