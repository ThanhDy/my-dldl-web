import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCopy, FaCheck } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [copiedBank, setCopiedBank] = useState(false);

  const bankAccount = "456799799"; // Replace with real account

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[1001] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative pointer-events-auto overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FF813F]/20 to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-50 bg-white/5 p-2 rounded-full hover:bg-white/10"
              >
                <FaTimes size={20} />
              </button>

              {/* Header */}
              <div className="text-center mb-8 relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2 font-outfit flex items-center justify-center gap-3">
                  <span className="text-4xl">☕</span> Mời Mình Ly Cafe
                </h2>
                <p className="text-slate-400">
                  Cảm ơn bạn đã ủng hộ dự án! Sự đóng góp của bạn giúp mình duy trì server và phát triển thêm tính năng mới.
                </p>
              </div>

              {/* QR Codes Grid */}
              <div className="flex justify-center relative z-10">
                
                {/* Bank Transfer */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col items-center w-full max-w-sm">
                  <h3 className="text-xl font-bold text-white mb-4">Chuyển Khoản Ngân Hàng</h3>
                  <div className="w-48 h-48 bg-white rounded-lg p-2 flex items-center justify-center mb-4">
                    <img src="/images/qr_bank.jpg" alt="Bank QR" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-full space-y-2">
                    <p className="text-slate-300 text-sm flex justify-between">
                      <span>Ngân hàng:</span> <span className="font-bold text-white">VIB</span>
                    </p>
                    <p className="text-slate-300 text-sm flex justify-between">
                      <span>Tên:</span> <span className="font-bold text-white">TRAN THANH DUY</span>
                    </p>
                    <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg mt-2 border border-white/5">
                      <span className="font-mono text-white font-bold">{bankAccount}</span>
                      <button 
                        onClick={() => handleCopy(bankAccount)}
                        className="text-[#FF813F] hover:text-white transition-colors p-1"
                        title="Copy số tài khoản"
                      >
                        {copiedBank ? <FaCheck size={16} className="text-green-500" /> : <FaCopy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Note */}
              <div className="mt-8 text-center text-sm text-slate-500">
                <p>Nội dung chuyển khoản (Tùy chọn): <span className="text-slate-300 font-medium">TenBan + DLDL</span></p>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
