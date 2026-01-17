"use client";

import { useState } from "react";
import { FaSave, FaImage, FaBone, FaArrowUp, FaDna } from "react-icons/fa";

const getDefaultSkillType = (order: number) => {
  switch (order) {
    case 2:
      return "Bị động";
    case 3:
      return "Công thường";
    default:
      return "Chủ động"; // Skill 1, 4...
  }
};

const createEmptySkill = (
  order: number,
  branch: number,
  heroId: string = "",
) => ({
  id: heroId ? `${heroId}-s${order}-${branch}` : "",
  _tempOrder: order,
  _tempBranch: branch,

  name: "",
  type: getDefaultSkillType(order),
  soulRingType: "",
  description: "",
  yearEffects: { y1k: "", y10k: "", y25k: "", y50k: "", y100k: "" },
  note: [],
  iconUrl: "",
});

// TẠO SẴN 8 SKILL CỐ ĐỊNH
const INITIAL_SKILLS = [
  createEmptySkill(1, 1),
  createEmptySkill(2, 1),
  createEmptySkill(3, 1),
  createEmptySkill(4, 1),
  createEmptySkill(1, 2),
  createEmptySkill(2, 2),
  createEmptySkill(3, 2),
  createEmptySkill(4, 2),
];

// --- 1. LOGIC HỒN CỐT ---
const SOUL_BONE_POSITIONS = [
  "Đầu",
  "Thân",
  "Tay Trái",
  "Tay Phải",
  "Chân Trái",
  "Chân Phải",
];

const createEmptySoulBone = (position: string) => ({
  position: position,
  name: "",
  standard: {
    base: "", // Hiệu quả cơ bản
    star4: "", // Hiệu quả 4 sao
    star6: "", // Hiệu quả 6 sao
  },
  // Thêm sẵn cấu trúc rỗng
  mutation: {
    name: "",
    star1Red: "",
    star4Red: "",
    star5Red: "",
    star6Red: "",
  },
  upgrade: { name: "", star2: "", star3: "", star5: "" },

  // Biến tạm để điều khiển UI (none | mutation | upgrade)
  _extraType: "none",
});

// Tự động tạo 6 hồn cốt rỗng
const INITIAL_SOUL_BONES = SOUL_BONE_POSITIONS.map((pos) =>
  createEmptySoulBone(pos),
);

const INITIAL_HERO = {
  id: "",
  name: "",
  title: "",
  rarity: "SP",
  type: "Cường Công",
  image: "",
  builds: [{ title: "PvE" }, { title: "PvP" }],
  skillDetails: INITIAL_SKILLS,
  soulBones: INITIAL_SOUL_BONES,
};

export default function AddHeroPage() {
  const [formData, setFormData] = useState<any>(INITIAL_HERO);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- XỬ LÝ LOGIC ---
  const handleNameBlur = () => {
    if (!formData.name) return;

    // Tự động sinh ID ngầm
    const slug =
      formData.id ||
      formData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    setFormData((prev: any) => {
      const updatedSkills = prev.skillDetails.map((skill: any) => ({
        ...skill,
        id: `${slug}-s${skill._tempOrder}-${skill._tempBranch}`,
        iconUrl: `/images/${slug}/hh${skill._tempOrder}-${skill._tempBranch}.webp`,
      }));

      return {
        ...prev,
        id: slug, // ID vẫn được lưu vào state nhưng không hiển thị input
        image: `/images/${slug}/avt.webp`,
        skillDetails: updatedSkills,
      };
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const updateBuild = (index: number, value: string) => {
    const newBuilds = [...formData.builds];
    // Đảm bảo cấu trúc mảng không bị lỗi
    if (!newBuilds[index]) newBuilds[index] = { title: "" };

    newBuilds[index].title = value;
    setFormData({ ...formData, builds: newBuilds });
  };

  const updateSkill = (index: number, field: string, value: any) => {
    const newSkills = [...formData.skillDetails];
    newSkills[index][field] = value;
    setFormData({ ...formData, skillDetails: newSkills });
  };

  const updateSkillYear = (index: number, yearKey: string, value: string) => {
    const newSkills = [...formData.skillDetails];
    newSkills[index].yearEffects[yearKey] = value;
    setFormData({ ...formData, skillDetails: newSkills });
  };

  const updateSkillNote = (index: number, textValue: string) => {
    const newSkills = [...formData.skillDetails];
    newSkills[index].note = textValue
      .split("\n")
      .filter((line) => line.trim() !== "");
    setFormData({ ...formData, skillDetails: newSkills });
  };

  // --- 2. CÁC HÀM XỬ LÝ HỒN CỐT MỚI ---

  // Update thông tin chung (Tên, UI Type)
  const updateSoulBone = (index: number, field: string, value: any) => {
    const newBones = [...formData.soulBones];
    newBones[index][field] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

  const updateSoulBoneStandard = (
    index: number,
    key: string,
    value: string,
  ) => {
    const newBones = [...formData.soulBones];
    newBones[index].standard[key] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

  // Update Suy Biến
  const updateSoulBoneMutation = (
    index: number,
    key: string,
    value: string,
  ) => {
    const newBones = [...formData.soulBones];
    newBones[index].mutation[key] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

  // Update Nâng Cấp
  const updateSoulBoneUpgrade = (index: number, key: string, value: string) => {
    const newBones = [...formData.soulBones];
    newBones[index].upgrade[key] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/add-hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("✅ Thêm tướng thành công!");
    } catch (err: any) {
      setMessage(`❌ Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8 pb-32 font-sans selection:bg-yellow-500/30">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-slate-950/95 backdrop-blur z-20 py-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              NHẬP LIỆU HỒN SƯ
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Hệ thống tự động đồng bộ ID và hình ảnh
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-green-900/20 transition transform active:scale-95"
          >
            <FaSave /> {loading ? "Đang xử lý..." : "Lưu Dữ Liệu"}
          </button>
        </header>

        {message && (
          <div
            className={`p-4 mb-8 rounded-lg font-bold border ${
              message.includes("Lỗi")
                ? "bg-red-950/30 border-red-500/50 text-red-400"
                : "bg-green-950/30 border-green-500/50 text-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- CỘT TRÁI: THÔNG TIN CƠ BẢN (Đã sửa UI) --- */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sticky top-28 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-yellow-500">
                  <FaImage size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-100">
                  Thông Tin Cơ Bản
                </h2>
              </div>

              {/* Tên Tướng */}
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase mb-2">
                  Tên Hồn Sư <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleNameBlur}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-lg font-bold text-yellow-400 placeholder-slate-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
                  placeholder="Nhập tên (VD: Đường Tam)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Độ Hiếm */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Phẩm Chất
                  </label>
                  <select
                    name="rarity"
                    value={formData.rarity}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-bold text-white outline-none focus:border-blue-500"
                  >
                    <option value="SP">SP</option>
                    <option value="SSR">SSR</option>
                    <option value="SR">SR</option>
                  </select>
                </div>
                {/* Hệ */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Hệ
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
                  >
                    <option value="Cường Công">Cường Công</option>
                    <option value="Mẫn Công">Mẫn Công</option>
                    <option value="Khống Chế">Khống Chế</option>
                    <option value="Phụ Trợ">Phụ Trợ</option>
                    <option value="Phòng Ngự">Phòng Ngự</option>
                  </select>
                </div>
              </div>

              {/* Danh hiệu */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Danh hiệu
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
                  placeholder="VD: Thiên Thủ Tu La"
                />
              </div>

              {/* --- MỚI THÊM: CẤU HÌNH BUILD --- */}
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 space-y-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Gợi ý Build Kỹ Năng
                </p>

                {/* Build PVE */}
                <div>
                  <label className="text-[10px] font-bold text-blue-400 mb-1 block">
                    PVE
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.builds[0]?.title || ""}
                      onChange={(e) => updateBuild(0, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm font-mono text-white focus:border-blue-500 outline-none"
                      placeholder="VD: PvE - 1112"
                    />
                    {/* Nút gợi ý nhanh */}
                    <div className="absolute right-1 top-1 flex gap-1">
                      {["1111", "1212", "2222"].map((code) => (
                        <button
                          type="button"
                          key={code}
                          onClick={() => updateBuild(0, `PvE - ${code}`)}
                          className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 hover:text-white border border-slate-700"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Build PVP */}
                <div>
                  <label className="text-[10px] font-bold text-red-400 mb-1 block">
                    PVP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.builds[1]?.title || ""}
                      onChange={(e) => updateBuild(1, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm font-mono text-white focus:border-red-500 outline-none"
                      placeholder="VD: PvP - 2212"
                    />
                    <div className="absolute right-1 top-1 flex gap-1">
                      {["2222", "2121", "1111"].map((code) => (
                        <button
                          type="button"
                          key={code}
                          onClick={() => updateBuild(1, `PvP - ${code}`)}
                          className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 hover:text-white border border-slate-700"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hiển thị đường dẫn ảnh (Read-only để user biết cần upload ảnh vào đâu) */}
              {formData.id && (
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[10px] text-slate-500 font-mono break-all">
                  <p className="mb-1 text-blue-500 font-bold uppercase">
                    Thư mục ảnh:
                  </p>
                  public/images/{formData.id}/
                </div>
              )}
            </div>
          </div>

          {/* --- CỘT PHẢI: DANH SÁCH 8 KỸ NĂNG CỐ ĐỊNH --- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
              <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span>
              <h2 className="text-xl font-bold text-slate-200">
                Chi Tiết Kỹ Năng
              </h2>
            </div>

            {formData.skillDetails.map((skill: any, idx: number) => {
              const isBranch1 = skill._tempBranch === 1;
              const borderColor = isBranch1
                ? "border-blue-500/20"
                : "border-purple-500/20";
              const themeColor = isBranch1
                ? "text-blue-400"
                : "text-purple-400";
              const bgHeader = isBranch1
                ? "bg-gradient-to-r from-blue-900/20 to-transparent"
                : "bg-gradient-to-r from-purple-900/20 to-transparent";

              return (
                <div
                  key={idx}
                  className={`bg-slate-900 rounded-xl border ${borderColor} overflow-hidden shadow-lg transition-all hover:border-opacity-50`}
                >
                  {/* Header Skill */}
                  <div
                    className={`${bgHeader} px-6 py-3 flex justify-between items-center border-b border-slate-800/50`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-black uppercase tracking-wider ${themeColor}`}
                      >
                        Skill {skill._tempOrder}
                      </span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 uppercase">
                        {isBranch1 ? "Nhánh 1" : "Nhánh 2"}
                      </span>
                    </div>
                    {/* Đã xóa nút Xóa */}
                  </div>

                  <div className="p-6 grid gap-5">
                    {/* Dòng 1: Tên & Loại */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Tên Kỹ Năng
                        </label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) =>
                            updateSkill(idx, "name", e.target.value)
                          }
                          className={`w-full bg-transparent border-b border-slate-700 focus:border-current py-1.5 text-base font-bold outline-none transition ${themeColor}`}
                          placeholder="Nhập tên..."
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Loại Kỹ Năng
                        </label>
                        <input
                          type="text"
                          value={skill.soulRingType}
                          onChange={(e) =>
                            updateSkill(idx, "soulRingType", e.target.value)
                          }
                          placeholder="VD: Khống chế, Tăng Ích,..."
                          className="w-full bg-transparent border-b border-slate-700 focus:border-slate-400 py-1.5 text-sm text-slate-300 outline-none transition placeholder-slate-600"
                        />
                      </div>
                    </div>

                    {/* Mô tả */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Mô tả chi tiết
                      </label>
                      <textarea
                        value={skill.description}
                        onChange={(e) =>
                          updateSkill(idx, "description", e.target.value)
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 h-20 focus:border-slate-500 outline-none"
                      />
                    </div>

                    {/* Hiệu quả theo năm */}
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">
                        Hiệu quả theo năm
                      </p>
                      <div className="grid gap-2">
                        {["y1k", "y10k", "y25k", "y50k", "y100k"].map((key) => (
                          <div key={key} className="flex gap-3 items-center">
                            <span
                              className={`w-14 text-[10px] font-bold uppercase text-right ${
                                key === "y100k"
                                  ? "text-red-500"
                                  : "text-slate-500"
                              }`}
                            >
                              {key.replace("y", "")}
                            </span>
                            <input
                              type="text"
                              value={skill.yearEffects[key]}
                              onChange={(e) =>
                                updateSkillYear(idx, key, e.target.value)
                              }
                              className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs focus:border-blue-500 outline-none placeholder-slate-700"
                              placeholder="Nội dung..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Ghi chú bổ sung (Mỗi dòng 1 ý)
                      </label>
                      <textarea
                        placeholder="[Tên Hiệu ứng 1]: 'mô tả giải thích hiệu ứng,...'\n [Tên Hiệu ứng 2]: '...'"
                        defaultValue={
                          Array.isArray(skill.note) ? skill.note.join("\n") : ""
                        }
                        onBlur={(e) => updateSkillNote(idx, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono h-20 focus:border-slate-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                  <FaBone className="text-slate-500" /> Hồn Cốt (6 Vị Trí)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.soulBones.map((bone: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg hover:border-slate-600 transition"
                  >
                    {/* Header: Vị trí & Chọn loại mở rộng */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded text-xs font-black uppercase tracking-wider border border-blue-500/20">
                        {bone.position}
                      </span>

                      {/* Dropdown chọn loại mở rộng */}
                      <select
                        value={bone._extraType}
                        onChange={(e) =>
                          updateSoulBone(idx, "_extraType", e.target.value)
                        }
                        className={`text-[10px] font-bold uppercase py-1 px-2 rounded border outline-none cursor-pointer transition ${
                          bone._extraType === "mutation"
                            ? "bg-red-900/30 text-red-400 border-red-500/30"
                            : bone._extraType === "upgrade"
                              ? "bg-yellow-900/30 text-yellow-400 border-yellow-500/30"
                              : "bg-slate-800 text-slate-500 border-slate-700"
                        }`}
                      >
                        <option value="none">Mở rộng: Không</option>
                        <option value="mutation">Suy Biến</option>
                        <option value="upgrade">Nâng Cấp</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      {/* Tên Hồn Cốt */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Tên Hồn Cốt
                        </label>
                        <input
                          type="text"
                          value={bone.name}
                          onChange={(e) =>
                            updateSoulBone(idx, "name", e.target.value)
                          }
                          placeholder="Nhập tên (Nếu có)..."
                          className="w-full bg-slate-950 border-b border-slate-700 focus:border-blue-500 py-1.5 text-sm font-bold text-slate-200 outline-none transition"
                        />
                      </div>

                      {/* Hiệu quả Cơ bản */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Hiệu quả cơ bản
                        </label>
                        <textarea
                          value={bone.standard.base}
                          onChange={(e) =>
                            updateSoulBoneStandard(idx, "base", e.target.value)
                          }
                          className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-xs text-slate-300 h-16 outline-none focus:border-slate-500"
                          placeholder="Mô tả..."
                        />
                      </div>

                      {/* Hiệu quả 4 sao & 6 sao */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-yellow-600 uppercase mb-1">
                            4 Sao
                          </label>
                          <textarea
                            value={bone.standard.star4}
                            placeholder="mô tả dòng 4s"
                            onChange={(e) =>
                              updateSoulBoneStandard(
                                idx,
                                "star4",
                                e.target.value,
                              )
                            }
                            className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-[10px] text-slate-300 h-16 outline-none focus:border-yellow-600/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-red-600 uppercase mb-1">
                            6 Sao
                          </label>
                          <textarea
                            value={bone.standard.star6}
                            placeholder="mô tả dòng 6s"
                            onChange={(e) =>
                              updateSoulBoneStandard(
                                idx,
                                "star6",
                                e.target.value,
                              )
                            }
                            className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-[10px] text-slate-300 h-16 outline-none focus:border-red-600/50"
                          />
                        </div>
                      </div>

                      {/* --- KHUNG SUY BIẾN (Chỉ hiện khi chọn) --- */}
                      {bone._extraType === "mutation" && (
                        <div className="mt-4 pt-4 border-t border-red-900/30 bg-red-950/10 -mx-5 px-5 pb-2">
                          <div className="flex items-center gap-2 mb-2">
                            <FaDna className="text-red-500 text-xs" />
                            <span className="text-xs font-bold text-red-400 uppercase">
                              Hiệu quả Suy Biến
                            </span>
                          </div>
                          <input
                            type="text"
                            value={bone.mutation.name}
                            onChange={(e) =>
                              updateSoulBoneMutation(
                                idx,
                                "name",
                                e.target.value,
                              )
                            }
                            placeholder="Tên Hồn Cốt Suy Biến..."
                            className="w-full bg-red-950/30 border border-red-900/50 rounded px-2 py-1.5 text-xs text-red-200 mb-2 font-bold placeholder-red-800"
                          />

                          <div className="grid gap-2">
                            {[
                              "star1Red",
                              "star4Red",
                              "star5Red",
                              "star6Red",
                            ].map((key) => (
                              <input
                                key={key}
                                type="text"
                                value={bone.mutation[key]}
                                onChange={(e) =>
                                  updateSoulBoneMutation(
                                    idx,
                                    key,
                                    e.target.value,
                                  )
                                }
                                placeholder={`${key
                                  .replace("star", "")
                                  .replace("Red", " Sao Đỏ")}...`}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-[10px] text-slate-300 outline-none focus:border-red-500"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* --- KHUNG NÂNG CẤP (Chỉ hiện khi chọn) --- */}
                      {bone._extraType === "upgrade" && (
                        <div className="mt-4 pt-4 border-t border-yellow-900/30 bg-yellow-950/10 -mx-5 px-5 pb-2">
                          <div className="flex items-center gap-2 mb-2">
                            <FaArrowUp className="text-yellow-500 text-xs" />
                            <span className="text-xs font-bold text-yellow-400 uppercase">
                              Hiệu quả Nâng Cấp
                            </span>
                          </div>
                          <input
                            type="text"
                            value={bone.upgrade.name}
                            onChange={(e) =>
                              updateSoulBoneUpgrade(idx, "name", e.target.value)
                            }
                            placeholder="Tên sau Nâng Cấp..."
                            className="w-full bg-yellow-950/30 border border-yellow-900/50 rounded px-2 py-1.5 text-xs text-yellow-200 mb-2 font-bold placeholder-yellow-800"
                          />

                          <div className="grid gap-2">
                            {["star2", "star3", "star5"].map((key) => (
                              <input
                                key={key}
                                type="text"
                                value={bone.upgrade[key]}
                                onChange={(e) =>
                                  updateSoulBoneUpgrade(
                                    idx,
                                    key,
                                    e.target.value,
                                  )
                                }
                                placeholder={`${key.replace(
                                  "star",
                                  "",
                                )} Sao...`}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-[10px] text-slate-300 outline-none focus:border-yellow-500"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
