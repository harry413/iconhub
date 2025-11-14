import { useState } from "react";
import { motion } from "framer-motion";
import { hoverSound, clickSound } from "../utils/Sounds";
import {
  FaShareAlt,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaLink,
  FaRegCopy,
} from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";

const ShareButton = ({ icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = `${window.location.origin}/icons/${icon._id}`;
  const shareText = `Check out this ${icon.name} icon from IconHub!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    clickSound.play();
    toast.success("Link copied to clipboard!");
  };


  
  const shareOnSocial = (platform) => {
    clickSound.play();
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(shareText)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          shareUrl
        )}&title=${encodeURIComponent(shareText)}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => {
          clickSound.play();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => hoverSound.play()}
        className="flex items-center rounded-full p-2"
      >
        <FaShareAlt />
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 mb-2 w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50"
        >
          <h4 className="font-medium mb-3">Share this icon</h4>

          <div className="flex space-x-2 mb-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareOnSocial("twitter")}
              title="Share on Twitter"
            >
              <FaTwitter className="text-blue-400" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareOnSocial("facebook")}
              title="Share on Facebook"
            >
              <FaFacebook className="text-blue-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareOnSocial("linkedin")}
              title="Share on LinkedIn"
            >
              <FaLinkedin className="text-blue-700" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly className="flex-1 text-sm" />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              title="Copy link"
            >
              <FaRegCopy />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ShareButton;
