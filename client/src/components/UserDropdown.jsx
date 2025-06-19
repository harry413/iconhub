import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { clickSound, hoverSound } from '../utils/Sounds';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from './ui/button';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full w-10 h-10 p-0"
          onMouseEnter={() => hoverSound.play()}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          >
            {user.username.charAt(0).toUpperCase()}
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            clickSound.play();
            navigate('/profile');
          }}
        >
          <FiUser className="mr-2" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            clickSound.play();
            navigate('/settings');
          }}
        >
          <FiSettings className="mr-2" /> Settings
        </DropdownMenuItem>
        {user.isAdmin && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              clickSound.play();
              navigate('/admin');
            }}
          >
            <FiSettings className="mr-2" /> Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer text-red-500 focus:text-red-500"
          onClick={() => {
            clickSound.play();
            logout();
          }}
        >
          <FiLogOut className="mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;