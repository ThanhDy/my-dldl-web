"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Users, 
  Sparkles, 
  LogOut, 
  Home, 
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  Flame,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/login");
    router.refresh();
  };

  const menuItems = [
    {
      name: "Quản Lý Hồn Sư",
      href: "/admin",
      icon: Users,
      pattern: /^\/admin($|\/add|\/edit)/,
    },
    {
      name: "Nguyên Hồn Tâm",
      href: "/admin/nguyen-hon-tam",
      icon: Sparkles,
      pattern: /^\/admin\/nguyen-hon-tam/,
    },
    {
      name: "Hệ Thống Đốt Cốt",
      href: "/admin/dot-cot",
      icon: Flame,
      pattern: /^\/admin\/dot-cot/,
    },
    {
      name: "Hồn Hoàn Hung Thú",
      href: "/admin/hon-hoan-hung-thu",
      icon: Database,
      pattern: /^\/admin\/hon-hoan-hung-thu/,
    },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-black text-slate-200 font-sans overflow-hidden">
      {/* --- MOBILE HEADER --- */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center ring-1 ring-white/20">
            <ShieldCheck className="text-white" size={18} />
          </div>
          <span className="text-lg font-black tracking-tighter text-white">ADMIN</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* --- MOBILE SIDEBAR (DRAWER) --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop Mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="lg:hidden fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm"
            />
            
            {/* Sidebar Content (Mobile Drawer) */}
            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden w-72 bg-slate-950/90 backdrop-blur-2xl border-r border-white/5 flex flex-col shrink-0 fixed z-[60] h-full overflow-hidden"
            >
              <SidebarContent closeSidebar={closeSidebar} pathname={pathname} menuItems={menuItems} handleLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- DESKTOP SIDEBAR (STATIC) --- */}
      <aside className="hidden lg:flex w-72 bg-slate-950/40 backdrop-blur-2xl border-r border-white/5 flex-col shrink-0 relative overflow-hidden h-full">
         <SidebarContent closeSidebar={closeSidebar} pathname={pathname} menuItems={menuItems} handleLogout={handleLogout} />
      </aside>

      {/* --- KHUNG NỘI DUNG THAY ĐỔI (BÊN PHẢI) --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-[#020617] pt-[73px] lg:pt-0">
        {/* Subtle background texture for the main area */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

// Separate component for Sidebar content to avoid duplication
function SidebarContent({ closeSidebar, pathname, menuItems, handleLogout }: any) {
  return (
    <>
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <ShieldCheck className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">ADMIN</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Control Panel</p>
          </div>
        </div>
        <button 
          onClick={closeSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-5 space-y-2 overflow-y-auto relative z-10 custom-scrollbar">
        <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Hệ thống quản trị</p>
        
        {menuItems.map((item: any) => {
          const isActive = item.pattern.test(pathname);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`group relative w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm overflow-hidden ${
                isActive 
                  ? "bg-blue-600/10 text-white" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent border-l-2 border-blue-500"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="flex items-center gap-3.5 relative z-10">
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive ? "bg-blue-500/20 text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                }`}>
                  <Icon size={18} />
                </div>
                <span className="tracking-tight">{item.name}</span>
              </div>
              
              <ChevronRight className={`transition-transform duration-300 relative z-10 opacity-40 ${
                isActive ? "translate-x-0 opacity-100 text-blue-400" : "-translate-x-2 group-hover:translate-x-0 group-hover:opacity-100"
              }`} size={14} />
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-5 space-y-2 border-t border-white/5 relative z-10 bg-slate-950/20">
        <Link
          href="/"
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all text-[13px] font-bold"
        >
          <div className="p-1.5 bg-slate-900 rounded-lg group-hover:bg-slate-800 transition-colors">
            <Home size={16} />
          </div>
          Về Trang Chủ
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-[13px] font-bold group"
        >
          <div className="p-1.5 bg-slate-900 rounded-lg group-hover:bg-red-950/20 transition-colors">
            <LogOut size={16} />
          </div>
          Đăng Xuất
        </button>
      </div>
    </>
  );
}
