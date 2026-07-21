import { motion } from 'framer-motion';
import { HiOutlineVolumeUp, HiOutlineVolumeOff } from 'react-icons/hi';
import { useSound } from '../context/SoundContext';

const SoundToggle = () => {
  const { soundEnabled, toggleSound } = useSound();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleSound}
      className="fixed bottom-4 right-4 z-[9999] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-slate-950/90 text-white shadow-2xl shadow-slate-950/30 backdrop-blur transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
      title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
    >
      {soundEnabled ? (
        <HiOutlineVolumeUp className="h-6 w-6" />
      ) : (
        <HiOutlineVolumeOff className="h-6 w-6" />
      )}
    </motion.button>
  );
};

export default SoundToggle;
