import { motion } from "framer-motion";
import { useTheme } from '../context/ThemeContext';

export default function LoadingScreen() {
  const { theme } = useTheme(); 
  return (
    <div className="fixed inset-0 grid place-items-center justify-items-center z-50">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ background: "linear-gradient(45deg,#8e9eab,#eef2f3)" }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, x: -100}}
        animate={{ opacity:1 , x: 0,  rotate: 360  }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        approach: { type: "spring", stiffness: 300, damping: 10},
        }}
        className="w-40 h-40 md:w-56 md:h-56 flex flex-col items-center justify-center"
      >
        <img
          src="/hilogo.png"
          alt="Hi logo"
          width={64}   // 56 * 4
          height={64}
          
        />
        <motion.span
            initial={{  opacity: 0, x: 100}}
            animate={{  opacity:[0, 0.5, 0.8, 1], x: 0 }}
            transition={{
              duration: 0.5,
              delay: 1.0,
              ease: [0, 0.71, 0.2, 1.01],
              approach: { type: "spring", stiffness: 300, damping: 10},
            }}
            className={`mr-2 text-md md:text-3xl font-extrabold text-transparent bg-clip-text ${
              theme === "dark"
                ? "bg-gradient-to-r from-[#8e0e00] to-[#1f1c18]"
                : "bg-gradient-to-r from-[#8e0e00] to-[#1f1c18]"
            }`}
          >
            HarryIconify
          </motion.span>
      </motion.div>
    </div>
  );
}