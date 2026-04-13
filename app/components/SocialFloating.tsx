"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaDiscord, FaYoutube } from "react-icons/fa";
import { useState } from "react";

const socialLinks = [
  {
    id: "discord",
    icon: <FaDiscord size={24} />,
    color: "bg-[#5865F2]",
    hoverColor: "hover:shadow-[0_0_20px_#5865F2]",
    href: "https://discord.gg/ffKXutbE",
    label: "Discord",
  },
  {
    id: "youtube",
    icon: <FaYoutube size={24} />,
    color: "bg-[#FF0000]",
    hoverColor: "hover:shadow-[0_0_20px_#FF0000]",
    href: "https://www.youtube.com/@VoMinhTan", // Placeholder youtube link
    label: "Youtube",
  },
];

export default function SocialFloating() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="fixed bottom-24 right-8 z-[100] flex flex-col gap-4">
      <AnimatePresence>
        {socialLinks.map((link, index) => (
          <motion.a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            onMouseEnter={() => setHovered(link.id)}
            onMouseLeave={() => setHovered(null)}
            className={`
              relative group flex items-center justify-center w-14 h-14 rounded-full text-white 
              ${link.color} shadow-lg transition-all duration-300
              ${link.hoverColor} hover:scale-110 active:scale-95
              border border-white/20 backdrop-blur-sm
            `}
          >
            {link.icon}
            
            {/* Label Tooltip */}
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={hovered === link.id ? { opacity: 1, x: -10 } : { opacity: 0, x: 10 }}
              className="absolute right-full mr-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap border border-white/10 pointer-events-none"
            >
              {link.label}
            </motion.span>

            {/* Pulsing effect */}
            <div className="absolute inset-0 rounded-full animate-ping bg-white/10 pointer-events-none group-hover:opacity-0" />
          </motion.a>
        ))}
      </AnimatePresence>
    </div>
  );
}
