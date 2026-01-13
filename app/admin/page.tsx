"use client";

import { useState, useEffect } from "react";
// Import data gốc để hiển thị ban đầu
import initialData from "@/data/soulMasters.json";

export default function AdminPage() {
  const [jsonContent, setJsonContent] = useState("");
  const [status, setStatus] = useState("");

  // Load dữ liệu hiện tại vào khung soạn thảo
  useEffect(() => {
    setJsonContent(JSON.stringify(initialData, null, 2));
  }, []);

  const handleSave = async () => {
    setStatus("Đang lưu...");
    try {
      // 1. Kiểm tra xem JSON có hợp lệ không trước khi gửi
      const parsedData = JSON.parse(jsonContent);

      // 2. Gửi lên API chúng ta vừa tạo ở Bước 1
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Lỗi mạng");

      setStatus("✅ Đã lưu vào ổ cứng! Hãy kiểm tra Git.");
    } catch (error: any) {
      setStatus(`❌ Lỗi: ${error.message}`);
    }
  };

  // Chỉ hiển thị Admin khi chạy dưới Localhost (Optional UI check)
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Trang này chỉ dành cho Admin chạy Local!
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-slate-900 text-white">
      <h1 className="text-2xl font-bold mb-4 text-yellow-400">
        Admin Quản Lý Hồn Sư (Local)
      </h1>

      <div className="mb-4 bg-blue-900/30 p-4 rounded border border-blue-500/50 text-sm">
        <p>
          💡 <strong>Hướng dẫn:</strong>
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Sửa trực tiếp dữ liệu bên dưới.</li>
          <li>
            Bấm <strong>Lưu Dữ Liệu</strong>.
          </li>
          <li>
            Mở VS Code, bạn sẽ thấy file <code>data/soulMasters.json</code> đã
            thay đổi.
          </li>
          <li>Commit và Push lên GitHub để cập nhật web.</li>
        </ul>
      </div>

      <textarea
        value={jsonContent}
        onChange={(e) => setJsonContent(e.target.value)}
        className="w-full h-[600px] bg-slate-800 text-slate-200 font-mono text-sm p-4 rounded border border-slate-700 focus:border-yellow-500 focus:outline-none"
        spellCheck={false}
      />

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded transition-colors"
        >
          Lưu Dữ Liệu
        </button>

        {status && (
          <span
            className={`font-bold ${
              status.includes("Lỗi") ? "text-red-400" : "text-green-400"
            }`}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
