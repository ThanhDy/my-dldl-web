"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaDiscord, FaYoutube, FaCoffee } from "react-icons/fa";
import { MessageCircle, X } from "lucide-react";
import DonateModal from "./DonateModal";
import { useState } from "react";

const socialLinks = [
  {
    id: "discord",
    icon: <FaDiscord size={20} />,
    color: "bg-[#5865F2]",
    hoverColor: "hover:shadow-[0_0_20px_#5865F2]",
    href: "https://discord.gg/w6HgGajhmQ",
    label: "Discord",
  },
  {
    id: "donate",
    icon: <FaCoffee size={20} />,
    color: "bg-[#FF813F]",
    hoverColor: "hover:shadow-[0_0_20px_#FF813F]",
    href: "#",
    label: "Mời Cafe",
    action: "modal",
  },
];

export default function SocialFloating() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="fixed bottom-24 right-8 z-[100] flex flex-col gap-4 items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <AnimatePresence>
        {isOpen && socialLinks.map((link, index) => {
          const isModal = (link as any).action === "modal";

          const commonProps = {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 10 },
            transition: { duration: 0.15 },
            onMouseEnter: () => setHovered(link.id),
            onMouseLeave: () => setHovered(null),
            className: `
              relative group flex items-center justify-center w-12 h-12 rounded-full text-white 
              ${link.color} shadow-lg transition-all duration-300
              ${link.hoverColor} hover:scale-110 active:scale-95
              border border-white/20 backdrop-blur-sm
            `
          };

          const content = (
            <>
              {link.icon}
              
              {/* Label Tooltip */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={hovered === link.id ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute right-full mr-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap border border-white/10 pointer-events-none"
              >
                {link.label}
              </motion.span>
            </>
          );

          if (isModal) {
            return (
              <motion.button
                key={link.id}
                {...commonProps as any}
                onClick={() => setIsDonateModalOpen(true)}
              >
                {content}
              </motion.button>
            );
          }

          return (
            <motion.a
              key={link.id}
              {...commonProps as any}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </motion.a>
          );
        })}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full text-white bg-slate-800 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 backdrop-blur-sm z-10"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <DonateModal 
        isOpen={isDonateModalOpen} 
        onClose={() => setIsDonateModalOpen(false)} 
      />
    </div>
  );
}
