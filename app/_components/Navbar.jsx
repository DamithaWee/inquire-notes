import React from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export const Navbar = ({ isMobile }) => {
  const navbarItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className={twMerge("flex gap-5", isMobile && "flex-col")}>
      {navbarItems.map(({ label, href }, index) => (
        <motion.a
          key={index}
          href={href}
          whileHover={{ scale: 1.1, y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={twMerge(
            "text-gray-100 hover:text-gray-300 transition duration-300",
            isMobile && "text-lg"
          )}
        >
          {label}
        </motion.a>
      ))}
    </div>
  );
};
