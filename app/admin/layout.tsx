// app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Thêm useRouter
import { FaUsers, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại để active menu
  const router = useRouter();

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/login"); // Đá về trang login
    router.refresh();
  };
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* --- SIDE NAV CỐ ĐỊNH (BÊN TRÁI) --- */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-black">
            A
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">ADMIN</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            href="/admin"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
              pathname === "/admin" ||
              pathname.startsWith("/admin/edit") ||
              pathname.startsWith("/admin/add")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FaUsers className="text-lg" /> Quản Lý Hồn Sư
          </Link>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
            <FaBoxOpen className="text-lg" /> Vật Phẩm (Demo)
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          {/* NÚT ĐĂNG XUẤT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors text-sm font-bold"
          >
            <FaSignOutAlt /> Đăng Xuất
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors text-sm font-bold"
          >
            <FaSignOutAlt /> Về Trang Chủ
          </Link>
        </div>
      </aside>

      {/* --- KHUNG NỘI DUNG THAY ĐỔI (BÊN PHẢI) --- */}
      {/* children ở đây chính là page.tsx hoặc add/page.tsx */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
