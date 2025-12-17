import { motion } from "framer-motion";
import {
  FaReact,
  FaJs,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGithub,
} from "react-icons/fa";
import { SiTailwindcss, SiMongodb } from "react-icons/si";

const icons = [
  FaReact,
  FaJs,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGithub,
  SiTailwindcss,
  SiMongodb,
  FaReact,
  FaJs,
  FaNodeJs,
  FaHtml5,
];

export default function FloatingIcons() {
  return (
    <div className="relative w-full h-[300px] bg-gradient-to-br from-black via-gray-900 to-black rounded-lg  mask-l-from-50% mask-r-from-50% ">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-white/80"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 90}%`,
            fontSize: `${Math.random() * 20 + 24}px`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon />
        </motion.div>
      ))}
    </div>
  );
}
