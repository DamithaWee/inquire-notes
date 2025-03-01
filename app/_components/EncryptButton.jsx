import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, LockIcon } from "lucide-react";
import Link from "next/link";


const TARGET_TEXT = "Encrypt data";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

const CHARS = "!@#$%^&*():{};|,.<>/?";

const EncryptButton = ({
    targetText
}) => {
  const intervalRef = useRef(null);

  const [text, setText] = useState(targetText);

  const scramble = () => {
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = targetText.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];

          return randomChar;
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= targetText.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);

    setText(targetText);
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.025,
      }}
      whileTap={{
        scale: 0.975,
      }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className="group relative overflow-hidden rounded-full border-[1px] border-neutral-500 bg-neutral-100 px-4 py-2 font-mono font-bold uppercase text-black transition-colors hover:text-primaryLight dark:border-neutral-600 dark:bg-zinc-900 dark:text-white dark:hover:text-primaryDark "
    >
      <Link href="/dashboard">
        <div className="relative z-10 flex items-center gap-2">
          <span>{text}</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
        <motion.span
          initial={{
            y: "100%",
          }}
          animate={{
            y: "-100%",
          }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1,
            ease: "linear",
          }}
          className="duration-300 absolute inset-0 z-0 scale-125 bg-gradient-to-t from-indigo-400/0 from-40% via-primaryLight dark:via-primaryDark to-indigo-400/0 to-60% opacity-0 transition-opacity group-hover:opacity-90"
        />
      </Link>
    </motion.button>
  );
};

export default EncryptButton;
