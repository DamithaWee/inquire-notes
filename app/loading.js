"use client";

import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

export default function Loading({classes = ''}) {
  return (
    <AnimatePresence>
      <div
        className={twMerge(
          "flex items-center justify-center h-screen bg-white dark:bg-bgDark",
          classes
        )}
      >
        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{
            opacity: 1,
            rotate: 360,
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          transition={{
            rotate: {
              duration: 2.0,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 1.0,
            },
            default: { duration: 0.6, ease: "easeInOut" },
          }}
          className="relative w-24 h-24"
        >
          {/* Halo Effect with light & dark mode colors */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-500 dark:to-purple-500 rounded-full blur-xl z-10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />

          {/* Particle Effects with light & dark mode colors */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gray-700 dark:bg-white rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: `calc(-50% + ${Math.cos((i * 60 * Math.PI) / 180) * 50}px)`,
                  y: `calc(-50% + ${Math.sin((i * 60 * Math.PI) / 180) * 50}px)`,
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
