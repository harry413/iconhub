

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 grid place-items-center">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ background: "linear-gradient(45deg,#0f172a,#1e293b)" }}
        animate={{
          background: [
            "linear-gradient(45deg,#0f172a,#1e293b)",
            "linear-gradient(45deg,#1e293b,#3b82f6)",
            "linear-gradient(45deg,#3b82f6,#0f172a)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Pulsing centered logo */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1, 0.8] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-40 h-40 md:w-56 md:h-56"
      >
        <img
          src="/hilogo.png"
          alt="Hi logo"
          width={224}   // 56 * 4
          height={224}
          priority
        />
      </motion.div>
    </div>
  );
}