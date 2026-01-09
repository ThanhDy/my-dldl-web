// app/page.tsx
import Link from "next/link";
import { FaUser } from "react-icons/fa";
// Sửa dòng dưới đây: Đổi GiBurningRing thành GiMagicPortal
import { GiBroadsword, GiMagicPortal, GiCube } from "react-icons/gi";

const features = [
  {
    title: "Hồn Sư",
    icon: <FaUser size={40} />, // Hoặc dùng <GiHoodedFigure size={40} /> nếu muốn ngầu hơn
    href: "/soul-masters",
    active: true,
    description: "Tra cứu kỹ năng, build hồn hoàn, đội hình.",
  },
  {
    title: "Thần Khí",
    icon: <GiBroadsword size={40} />, // Icon Kiếm to
    href: "/divine-weapons",
    active: false,
    description: "Thông tin các loại thần khí và hiệu ứng.",
  },
  {
    title: "Hồn Hoàn Thông Dụng",
    icon: <GiMagicPortal size={40} />, // Đã sửa tên icon ở đây
    href: "/general-rings",
    active: false,
    description: "Các loại hồn hoàn dùng chung cho mọi tướng.",
  },
  {
    title: "Hồn Đạo Khí",
    icon: <GiCube size={40} />, // Icon Khối lập phương
    href: "/soul-tools",
    active: false,
    description: "Cường hóa chỉ số và cơ chế ẩn.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-400">
        Đấu La Đại Lục Wiki
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) =>
          feature.active ? (
            // Active Feature: Dùng Link để chuyển trang
            <Link key={index} href={feature.href} className="block group">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all h-full cursor-pointer">
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            </Link>
          ) : (
            // Inactive Feature: Div thường + Opacity
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl relative overflow-hidden h-full cursor-not-allowed opacity-70"
            >
              <div className="absolute top-2 right-2 bg-yellow-600 text-xs px-2 py-1 rounded text-white font-bold">
                Coming Soon
              </div>
              <div className="text-slate-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-slate-500">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
