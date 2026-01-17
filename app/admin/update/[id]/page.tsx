"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Hook để lấy ID từ URL
import { FaSave, FaImage, FaBone } from "react-icons/fa";

// --- 1. CÁC HÀM KHỞI TẠO MẪU (Giống hệt trang Add) ---
const getDefaultSkillType = (order: number) => {
  switch (order) {
    case 2:
      return "Bị động";
    case 3:
      return "Công thường";
    default:
      return "Chủ động";
  }
};

const createEmptySkill = (
  order: number,
  branch: number,
  heroId: string = ""
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
  standard: { base: "", star4: "", star6: "" },
  mutation: {
    name: "",
    star1Red: "",
    star4Red: "",
    star5Red: "",
    star6Red: "",
  },
  upgrade: { name: "", star2: "", star3: "", star5: "" },
  _extraType: "none",
});
const INITIAL_SOUL_BONES = SOUL_BONE_POSITIONS.map((pos) =>
  createEmptySoulBone(pos)
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

export default function EditHeroPage() {
  const params = useParams(); // Lấy ID từ URL
  const router = useRouter();
  const [formData, setFormData] = useState<any>(INITIAL_HERO); // Chưa có dữ liệu thì null
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- 2. LOGIC LOAD DỮ LIỆU & HÒA TRỘN (QUAN TRỌNG NHẤT) ---
  // --- 2. LOGIC LOAD DỮ LIỆU TỪ API & HÒA TRỘN ---
  useEffect(() => {
    const fetchHeroData = async () => {
      // Reset lỗi trước khi gọi
      setMessage("");

      try {
        const heroId = params.id as string;
        if (!heroId) return;

        // Gọi API lấy dữ liệu chi tiết
        const res = await fetch(`/api/heroes/${heroId}`);

        if (!res.ok) {
          // Nếu API trả về lỗi (404), hiển thị thông báo rõ ràng
          setMessage(
            `❌ Không tìm thấy dữ liệu cho ID: "${heroId}". Hãy kiểm tra lại thư mục data/heroes/`
          );
          return;
        }

        const foundHero = await res.json();

        // --- MERGE DATA (Quan trọng: Giữ lại cấu trúc 8 skill / 6 cốt) ---
        // A. Merge Skills
        const mergedSkills = INITIAL_SKILLS.map((emptySkill, index) => {
          // Tìm skill tương ứng trong data tải về (nếu có)
          // Lưu ý: Logic này giả định thứ tự lưu trong JSON khớp với thứ tự hiển thị
          // Nếu muốn chính xác tuyệt đối, nên tìm theo ID hoặc branch/order
          const existingSkill =
            foundHero.skillDetails && foundHero.skillDetails[index];

          if (existingSkill) {
            return {
              ...emptySkill, // Lấy khung chuẩn
              ...existingSkill, // Ghi đè dữ liệu
              // Đảm bảo yearEffects không bị thiếu key
              yearEffects: {
                ...emptySkill.yearEffects,
                ...(existingSkill.yearEffects || {}),
              },
            };
          }
          return emptySkill;
        });

        // B. Merge Bones
        const mergedBones = INITIAL_SOUL_BONES.map((emptyBone) => {
          const existingBone = foundHero.soulBones?.find(
            (b: any) => b.position === emptyBone.position
          );

          if (existingBone) {
            let extraType = "none";
            if (existingBone.mutation) extraType = "mutation";
            if (existingBone.upgrade) extraType = "upgrade";

            return {
              ...emptyBone,
              ...existingBone,
              _extraType: extraType,
              standard: {
                ...emptyBone.standard,
                ...(existingBone.standard || {}),
              },
              mutation: {
                ...emptyBone.mutation,
                ...(existingBone.mutation || {}),
              },
              upgrade: {
                ...emptyBone.upgrade,
                ...(existingBone.upgrade || {}),
              },
            };
          }
          return emptyBone;
        });

        // C. Merge Builds
        const mergedBuilds = [
          { title: foundHero.builds?.[0]?.title || "" },
          { title: foundHero.builds?.[1]?.title || "" },
        ];

        // Cập nhật State
        setFormData({
          ...foundHero,
          skillDetails: mergedSkills,
          soulBones: mergedBones,
          builds: mergedBuilds,
        });
      } catch (error) {
        console.error("Fetch Error:", error);
        setMessage("❌ Lỗi kết nối đến Server API!");
      }
    };

    fetchHeroData();
  }, [params.id]);

  // --- 3. CÁC HÀM XỬ LÝ FORM (Copy y hệt trang Add) ---
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Lưu ý: Trang Edit KHÔNG cần hàm handleNameBlur tự sinh ID, vì ID là cố định

  const updateBuild = (index: number, value: string) => {
    const newBuilds = [...formData.builds];
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

  // Hàm xử lý Hồn Cốt
  const updateSoulBone = (index: number, field: string, value: any) => {
    const newBones = [...formData.soulBones];
    newBones[index][field] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

  const updateSoulBoneStandard = (
    index: number,
    key: string,
    value: string
  ) => {
    const newBones = [...formData.soulBones];
    newBones[index].standard[key] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

  const updateSoulBoneMutation = (
    index: number,
    key: string,
    value: string
  ) => {
    const newBones = [...formData.soulBones];
    newBones[index].mutation[key] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

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
      // Gọi API PUT thay vì POST
      const res = await fetch("/api/admin/update-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("✅ Cập nhật thành công! Kiểm tra file JSON.");
    } catch (err: any) {
      setMessage(`❌ Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!formData)
    return <div className="p-10 text-white">Đang tải dữ liệu...</div>;
  if (process.env.NODE_ENV === "production") return null;

  // --- 4. GIAO DIỆN (Copy y hệt trang Add, chỉ sửa Tiêu đề và ID Readonly) ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8 pb-32 font-sans selection:bg-yellow-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-slate-950/95 backdrop-blur z-20 py-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
              CHỈNH SỬA: {formData.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">ID: {formData.id}</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-blue-900/20 transition transform active:scale-95"
          >
            <FaSave /> {loading ? "Lưu Thay Đổi" : "Cập Nhật"}
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
          {/* CỘT TRÁI */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sticky top-28 shadow-2xl space-y-6">
              {/* ... (Copy UI từ trang Add sang, chỉ khác input ID disabled) ... */}

              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-yellow-500">
                  <FaImage size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-100">
                  Thông Tin Cơ Bản
                </h2>
              </div>

              {/* ID (Read-only) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  ID
                </label>
                <input
                  type="text"
                  value={formData.id}
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Tên */}
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase mb-2">
                  Tên Hồn Sư
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-lg font-bold text-yellow-400 outline-none focus:border-yellow-500"
                />
              </div>

              {/* Các trường Rarity, Type, Title... (Copy y hệt trang Add) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Độ Hiếm
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
                />
              </div>

              {/* Build PVE/PVP (Copy y hệt) */}
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 space-y-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Gợi ý Build
                </p>
                <div>
                  <label className="text-[10px] font-bold text-blue-400 mb-1 block">
                    PVE
                  </label>
                  <input
                    type="text"
                    value={formData.builds[0]?.title || ""}
                    onChange={(e) => updateBuild(0, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm font-mono text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-red-400 mb-1 block">
                    PVP
                  </label>
                  <input
                    type="text"
                    value={formData.builds[1]?.title || ""}
                    onChange={(e) => updateBuild(1, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm font-mono text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Copy toàn bộ phần Render Skills và SoulBones từ trang Add sang đây */}
          <div className="lg:col-span-8 space-y-8">
            {/* COPY Y NGUYÊN PHẦN SKILL VÀ SOULBONE TỪ TRANG ADD SANG */}
            {/* (Vì code quá dài nên mình không paste lại, bạn chỉ cần copy đoạn <div className="lg:col-span-8">...</div> từ trang Add sang là chạy ngay lập tức) */}

            {/* VÍ DỤ PHẦN SKILL MAP */}
            <div className="space-y-6">
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
                    <div
                      className={`${bgHeader} px-6 py-3 flex justify-between items-center border-b border-slate-800/50`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-black uppercase tracking-wider ${themeColor}`}
                        >
                          Skill {skill._tempOrder}
                        </span>
                        <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold text-slate-300">
                          {skill.type}
                        </span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 uppercase">
                          {isBranch1 ? "Nhánh 1" : "Nhánh 2"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 grid gap-5">
                      <div>
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
                          placeholder="Nhập tên kỹ năng..."
                        />
                      </div>

                      {/* 2. Định vị / Tag (Full dòng) */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Định vị (Tag)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={skill.soulRingType}
                            onChange={(e) =>
                              updateSkill(idx, "soulRingType", e.target.value)
                            }
                            className="flex-1 bg-transparent border-b border-slate-700 focus:border-slate-400 py-1.5 text-sm text-slate-300 outline-none transition"
                            placeholder="VD: Khống chế, Hộ thuẫn..."
                          />
                          {/* Thêm một vài gợi ý nhanh nếu muốn (Optional) */}
                          <div className="flex gap-1">
                            {["Sát thương", "Khống chế", "Hộ thuẫn"].map(
                              (tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() =>
                                    updateSkill(idx, "soulRingType", tag)
                                  }
                                  className="text-[9px] bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-400 hover:text-white whitespace-nowrap"
                                >
                                  {tag}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Mô tả
                        </label>
                        <textarea
                          value={skill.description}
                          onChange={(e) =>
                            updateSkill(idx, "description", e.target.value)
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 h-20 focus:border-slate-500 outline-none"
                        />
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                        <div className="grid gap-2">
                          {["y1k", "y10k", "y25k", "y50k", "y100k"].map(
                            (key) => (
                              <div
                                key={key}
                                className="flex gap-3 items-center"
                              >
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
                                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs focus:border-blue-500 outline-none"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <textarea
                          defaultValue={
                            Array.isArray(skill.note)
                              ? skill.note.join("\n")
                              : ""
                          }
                          onBlur={(e) => updateSkillNote(idx, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono h-20 focus:border-slate-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VÍ DỤ PHẦN SOUL BONE (Copy từ trang Add sang) */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                  <FaBone className="text-slate-500" /> Hồn Cốt
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.soulBones.map((bone: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg relative group hover:border-slate-600 transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded text-xs font-black uppercase tracking-wider border border-blue-500/20">
                        {bone.position}
                      </span>
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
                        <option value="mutation">Có Suy Biến</option>
                        <option value="upgrade">Có Nâng Cấp</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={bone.name}
                        onChange={(e) =>
                          updateSoulBone(idx, "name", e.target.value)
                        }
                        placeholder="Nhập tên..."
                        className="w-full bg-transparent border-b border-slate-700 focus:border-blue-500 py-1.5 text-sm font-bold text-slate-200 outline-none transition"
                      />
                      <input
                        type="text"
                        value={bone.standard.base}
                        onChange={(e) =>
                          updateSoulBoneStandard(idx, "base", e.target.value)
                        }
                        placeholder="Hiệu quả cơ bản..."
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-slate-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={bone.standard.star4}
                          onChange={(e) =>
                            updateSoulBoneStandard(idx, "star4", e.target.value)
                          }
                          placeholder="4 Sao..."
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-yellow-500 outline-none focus:border-yellow-600"
                        />
                        <input
                          type="text"
                          value={bone.standard.star6}
                          onChange={(e) =>
                            updateSoulBoneStandard(idx, "star6", e.target.value)
                          }
                          placeholder="6 Sao..."
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-red-500 outline-none focus:border-red-600"
                        />
                      </div>
                      {bone._extraType === "mutation" && (
                        <div className="mt-4 pt-4 border-t border-red-900/30 bg-red-950/10 -mx-5 px-5 pb-2">
                          <input
                            type="text"
                            value={bone.mutation.name}
                            onChange={(e) =>
                              updateSoulBoneMutation(
                                idx,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Tên Hồn Cốt Suy Biến..."
                            className="w-full bg-red-950/30 border border-red-900/50 rounded px-2 py-1.5 text-xs text-red-200 mb-2 font-bold"
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
                                    e.target.value
                                  )
                                }
                                placeholder={`${key}...`}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-[10px] text-slate-300 outline-none focus:border-red-500"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {bone._extraType === "upgrade" && (
                        <div className="mt-4 pt-4 border-t border-yellow-900/30 bg-yellow-950/10 -mx-5 px-5 pb-2">
                          <input
                            type="text"
                            value={bone.upgrade.name}
                            onChange={(e) =>
                              updateSoulBoneUpgrade(idx, "name", e.target.value)
                            }
                            placeholder="Tên sau Nâng Cấp..."
                            className="w-full bg-yellow-950/30 border border-yellow-900/50 rounded px-2 py-1.5 text-xs text-yellow-200 mb-2 font-bold"
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
                                    e.target.value
                                  )
                                }
                                placeholder={`${key}...`}
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
