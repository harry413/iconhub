// components/CircularOrbit.tsx
"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Star, Cloud, Leaf, Sparkles } from "lucide-react";
import React from "react";

const orbitConfigs = [
  { radius: 100, duration: 20, icons: [Sun, Moon] },
  { radius: 180, duration: 30, icons: [Star, Cloud, Leaf] },
  { radius: 250, duration: 40, icons: [Sparkles, Star, Moon, Leaf] },
];

const CircularOrbit = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-black dark:text-white overflow-hidden mask-b-from-20% mask-b-to-90%">
      {/* Circles with rotating icons */}
      {orbitConfigs.map((orbit, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full border border-dotted border-gray-600"
          style={{
            width: orbit.radius * 2,
            height: orbit.radius * 2,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{
            repeat: Infinity,
            duration: orbit.duration,
            ease: "linear",
          }}
        >
          {/* Place icons evenly around the circle */}
          {orbit.icons.map((Icon, iconIdx) => {
            const angle = (iconIdx / orbit.icons.length) * 2 * Math.PI;
            const x = orbit.radius * Math.cos(angle);
            const y = orbit.radius * Math.sin(angle);

            return (
              <motion.div
                key={iconIdx}
                className="absolute"
                style={{
                  left: orbit.radius + x - 12,
                  top: orbit.radius + y - 12,
                }}
                animate={{ rotate: [0, -360] }} // counter-rotation so icons stay upright
                transition={{
                  repeat: Infinity,
                  duration: orbit.duration,
                  ease: "linear",
                }}
              >
                <Icon className="w-6 h-6 text-black dark:text-white drop-shadow-md" />
              </motion.div>
            );
          })}
        </motion.div>
      ))}

      {/* Center Text */}
      <div className="relative z-30 text-center mt-10">
        <h1 className="text-5xl font-bold">Animated Icons</h1>
        <p className="text-black dark:text-gray-200 mt-4 max-w-lg">
          Go through our bunddle of animated SVG icons To make your application more intractive.
        </p>
      </div>
    </div>
  );
};

export default CircularOrbit;
