"use client";

export default function AdminPage() {
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
      hi
    </div>
  );
}
