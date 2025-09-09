

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 grid place-items-center justify-items-center z-50">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ background: "linear-gradient(45deg,#0f172a,#1e293b)" }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Spinning text around the logo */}
      <motion.div
        initial={{ scale: -1.0 }}
        animate={{ scale: [0.2, 1.0, 0.4] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-40 h-40 md:w-56 md:h-56 absolute underline text-blue text-2xl md:text-4xl font-bold flex flex-col items-center justify-center bg-gradient-to-r from-[#abbaab] to-[#ffffff] dark:from-slate-900 dark:to-[#1f1c18] rounded-full"
      >
        <img
          src="/hilogo.png"
          alt="Hi logo"
          width={32}   // 56 * 4
          height={32}
          
        />
        HarryIconify
      </motion.div>
    </div>
  );
}