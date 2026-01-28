"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaLock, FaArrowRight } from "react-icons/fa";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin"); // Chuyển hướng vào Admin
        router.refresh(); // Làm mới để cập nhật trạng thái cookie
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FaLock />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest">
            Admin Access
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Vui lòng nhập mật mã để truy cập hệ thống
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors text-center tracking-widest font-bold"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-bold bg-red-950/30 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "Đang kiểm tra..." : "Đăng Nhập"} <FaArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
}
