import Link from "next/link";
import { FaUser } from "react-icons/fa";
// Sửa dòng dưới đây: Đổi GiBurningRing thành GiMagicPortal
import { GiMagicPortal } from "react-icons/gi";

const features = [
  {
    title: "Hồn Sư",
    icon: <FaUser size={40} />,
    href: "/soul-masters",
    active: true,
    description: "Tra cứu kỹ năng, build hồn hoàn, đội hình.",
  },
  // {
  //   title: "Thần Khí",
  //   icon: <GiBroadsword size={40} />,
  //   href: "/divine-weapons",
  //   active: false,
  //   description: "Thông tin các loại thần khí và hiệu ứng.",
  // },
  {
    title: "Hồn Hoàn Thông Dụng",
    icon: <GiMagicPortal size={40} />,
    href: "/general-rings",
    active: false,
    description: "Các loại hồn hoàn dùng chung cho mọi tướng.",
  },
  // {
  //   title: "Hồn Đạo Khí",
  //   icon: <GiCube size={40} />,
  //   href: "/soul-tools",
  //   active: false,
  //   description: "Cường hóa chỉ số và cơ chế ẩn.",
  // },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
        Đấu La Đại Lục Wiki
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) =>
          feature.active ? (
            <Link key={index} href={feature.href} className="block group">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all h-full cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[sweep_2s_infinite] transition-transform" />

                <div className="text-blue-400 mb-4 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            </Link>
          ) : (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl relative overflow-hidden h-full cursor-not-allowed opacity-70 group"
            >
              <div className="absolute top-2 right-2 bg-red-600 animate-pulse text-[10px] px-2 py-1 rounded text-white font-extrabold uppercase tracking-widest shadow-[0_0_10px_rgba(220,38,38,0.5)] z-10">
                Coming Soon
              </div>

              <div className="text-slate-500 mb-4 grayscale">
                {feature.icon}
              </div>
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
