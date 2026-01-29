"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaBone,
  FaArrowUp,
  FaDna,
  FaStar,
} from "react-icons/fa";

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
  createEmptySoulBone(pos),
);

// Cấu trúc nâng sao Ám : 4, 5 vàng và 1-5 đỏ (6-10)
const AM_KHI_STAR_CONFIG = [
  { star: 4, isRedStar: false, description: "" },
  { star: 5, isRedStar: false, description: "" },
  { star: 6, isRedStar: true, description: "" },
  { star: 7, isRedStar: true, description: "" },
  { star: 8, isRedStar: true, description: "" },
  { star: 9, isRedStar: true, description: "" },
  { star: 10, isRedStar: true, description: "" },
];

const INITIAL_HERO = {
  id: "",
  name: "",
  title: "",
  rarity: "SP",
  type: "Cường Công",
  image: "",
  builds: [{ title: "PvE - 1111" }, { title: "PvP - 2222" }],
  skillDetails: INITIAL_SKILLS,
  soulBones: INITIAL_SOUL_BONES,
  starUpgrades: AM_KHI_STAR_CONFIG,
};

export default function AddHeroPage() {
  const [formData, setFormData] = useState<any>(INITIAL_HERO);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasBranch2, setHasBranch2] = useState(true);
  const isAmKhi = formData.type === "Ám Khí";

  useEffect(() => {
    if (formData.rarity === "SP+") {
      setHasBranch2(false);
    } else {
      setHasBranch2(true);
    }
  }, [formData.rarity]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleNameBlur = () => {
    if (!formData.name) return;
    const slug = formData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setFormData((prev: any) => ({
      ...prev,
      id: slug,
      image: `/images/${slug}/avt.webp`,
      skillDetails: prev.skillDetails.map((s: any) => ({
        ...s,
        id: `${slug}-s${s._tempOrder}-${s._tempBranch}`,
        iconUrl: `/images/${slug}/hh${s._tempOrder}-${s._tempBranch}.webp`,
      })),
    }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const updateBuild = (index: number, value: string) => {
    const newBuilds = [...formData.builds];
    if (!newBuilds[index]) newBuilds[index] = { title: "" };
    newBuilds[index].title = value;
    setFormData({ ...formData, builds: newBuilds });
  };

  const updateStarUpgrade = (index: number, value: string) => {
    const newStars = [...formData.starUpgrades];
    newStars[index].description = value;
    setFormData({ ...formData, starUpgrades: newStars });
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

  // --- HÀM XỬ LÝ HỒN CỐT ---
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

  const updateSoulBoneMutation = (
    index: number,
    key: string,
    value: string,
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
      const cleanData = { ...formData };

      // --- LOGIC QUAN TRỌNG: CẮT BỎ NHÁNH 2 NẾU TẮT ---
      if (!hasBranch2) {
        cleanData.skillDetails = cleanData.skillDetails.slice(0, 4);
      }

      // Đảm bảo ID được sinh ra nếu chưa có
      cleanData.skillDetails = cleanData.skillDetails.map((skill: any) => {
        if (!skill.id && cleanData.id) {
          return {
            ...skill,
            id: `${cleanData.id}-s${skill._tempOrder}-${skill._tempBranch}`,
            iconUrl:
              skill.iconUrl ||
              `/images/${cleanData.id}/hh${skill._tempOrder}-${skill._tempBranch}.webp`,
          };
        }
        return skill;
      });

      const res = await fetch("/api/soul-masters", {
        // Đổi đường dẫn về API chính
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json(); // Lấy message lỗi từ server nếu có

      if (!res.ok) throw new Error(result.message || "Lỗi lưu dữ liệu");
      setMessage("✅ Thêm tướng thành công!");
    } catch (err: any) {
      setMessage(`❌ Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-950 text-slate-200 p-6 md:p-8 pb-32 font-sans selection:bg-yellow-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-slate-950/95 backdrop-blur z-20 py-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-slate-400 hover:text-white transition"
            >
              <FaArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase">
                Nhập Liệu Hồn Sư
              </h1>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg transition active:scale-95"
          >
            <FaSave /> {loading ? "Đang xử lý..." : "Lưu Dữ Liệu"}
          </button>
        </header>

        {message && (
          <div
            className={`p-4 mb-8 rounded-lg font-bold border ${message.includes("Lỗi") ? "bg-red-950/30 border-red-500/50 text-red-400" : "bg-green-950/30 border-green-500/50 text-green-400"}`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sticky top-28 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <FaImage className="text-yellow-500" />
                <h2 className="text-lg font-bold text-slate-100">
                  Thông Tin Cơ Bản
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase mb-2">
                  Tên Hồn Sư
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleNameBlur}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-lg font-bold text-yellow-400 outline-none focus:border-yellow-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Danh Hiệu
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-blue-500 transition"
                  placeholder="VD: Thiên Thủ Tu La"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Phẩm Chất
                  </label>
                  <select
                    name="rarity"
                    value={formData.rarity}
                    onChange={handleChange}
                    className={`w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-bold outline-none ${formData.rarity === "SSR+" ? "text-red-500" : "text-white"}`}
                  >
                    <option value="SP">SP</option>
                    <option value="SP+">SP+</option>
                    <option value="SSR+">SSR+</option>
                    <option value="SSR">SSR</option>
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 outline-none"
                  >
                    <option value="Cường Công">Cường Công</option>
                    <option value="Mẫn Công">Mẫn Công</option>
                    <option value="Khống Chế">Khống Chế</option>
                    <option value="Phụ Trợ">Phụ Trợ</option>
                    <option value="Phòng Ngự">Phòng Ngự</option>
                    <option value="Ám Khí">Ám Khí</option>
                  </select>
                </div>
              </div>

              {!isAmKhi && (
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 space-y-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Build Kỹ Năng
                  </p>
                  <input
                    type="text"
                    value={formData.builds[0]?.title}
                    onChange={(e) => updateBuild(0, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white outline-none"
                    placeholder="PvE"
                  />
                  <input
                    type="text"
                    value={formData.builds[1]?.title}
                    onChange={(e) => updateBuild(1, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white outline-none"
                    placeholder="PvP"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {isAmKhi ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                  <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                  <h2 className="text-xl font-bold text-slate-200 uppercase">
                    Mốc Sức Mạnh Nâng Sao
                  </h2>
                </div>
                <div className="grid gap-4">
                  {formData.starUpgrades.map((up: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex gap-4"
                    >
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center font-bold shrink-0 ${up.isRedStar ? "border-red-500 text-red-500 bg-red-950/20" : "border-yellow-500 text-yellow-500 bg-yellow-950/20"}`}
                      >
                        <span className="text-lg leading-none">
                          {up.star > 5 ? up.star - 5 : up.star}
                        </span>
                        <FaStar size={10} />
                      </div>
                      <textarea
                        value={up.description}
                        onChange={(e) => updateStarUpgrade(idx, e.target.value)}
                        placeholder="Mô tả..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded p-3 text-sm h-24 outline-none focus:border-orange-500 transition resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h2 className="text-xl font-bold text-slate-200 uppercase">
                    Chi Tiết Kỹ Năng
                  </h2>

                  {/* NÚT TOGGLE NHÁNH 2 (MỚI) */}
                  <label className="flex items-center gap-3 cursor-pointer bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg hover:border-blue-500 transition">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Nhánh 2
                    </span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasBranch2}
                        onChange={(e) => setHasBranch2(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                  </label>
                </div>
                {formData.skillDetails.map((skill: any, idx: number) => {
                  if (!hasBranch2 && idx >= 4) return null;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4"
                    >
                      <div className="flex justify-between">
                        <span className="text-blue-400 font-bold uppercase">
                          Skill {skill._tempOrder} (Nhánh {skill._tempBranch})
                        </span>
                      </div>
                      <div className="flex gap-4 items-end">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) =>
                            updateSkill(idx, "name", e.target.value)
                          }
                          placeholder="Tên kỹ năng..."
                          className="flex-1 bg-transparent border-b border-slate-700 py-1 font-bold outline-none"
                        />
                        <input
                          type="text"
                          value={skill.soulRingType}
                          onChange={(e) =>
                            updateSkill(idx, "soulRingType", e.target.value)
                          }
                          placeholder="Loại (VD: Khống chế)"
                          className="w-1/3 bg-transparent border-b border-slate-700 py-1 text-sm text-slate-400 outline-none"
                        />
                      </div>
                      <textarea
                        value={skill.description}
                        onChange={(e) =>
                          updateSkill(idx, "description", e.target.value)
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm h-20 outline-none"
                        placeholder="Mô tả..."
                      />
                      <div className="grid gap-2">
                        {Object.keys(skill.yearEffects).map((y) => (
                          <div
                            key={y}
                            className="flex items-center gap-3 text-xs"
                          >
                            <span className="w-12 text-slate-500 text-right">
                              {y.replace("y", "")}
                            </span>
                            <input
                              value={skill.yearEffects[y]}
                              onChange={(e) =>
                                updateSkillYear(idx, y, e.target.value)
                              }
                              className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                  <FaBone /> Hồn Cốt (6 Vị Trí)
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.soulBones.map((bone: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {bone.position}
                      </span>
                      <select
                        value={bone._extraType}
                        onChange={(e) =>
                          updateSoulBone(idx, "_extraType", e.target.value)
                        }
                        className="text-[10px] bg-slate-800 text-slate-400 rounded px-1 outline-none"
                      >
                        <option value="none">Mở rộng: Không</option>
                        <option value="mutation">Suy Biến</option>
                        <option value="upgrade">Nâng Cấp</option>
                      </select>
                    </div>

                    <input
                      value={bone.name}
                      onChange={(e) =>
                        updateSoulBone(idx, "name", e.target.value)
                      }
                      placeholder="Tên cốt..."
                      className="w-full bg-transparent border-b border-slate-700 text-sm font-bold outline-none"
                    />

                    <textarea
                      value={bone.standard.base}
                      onChange={(e) =>
                        updateSoulBoneStandard(idx, "base", e.target.value)
                      }
                      placeholder="Cơ bản..."
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-[10px] h-14 outline-none"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={bone.standard.star4}
                        onChange={(e) =>
                          updateSoulBoneStandard(idx, "star4", e.target.value)
                        }
                        placeholder="4 Sao Vàng..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-[10px] outline-none"
                      />
                      <input
                        value={bone.standard.star6}
                        onChange={(e) =>
                          updateSoulBoneStandard(idx, "star6", e.target.value)
                        }
                        placeholder="6 Sao Vàng..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-[10px] outline-none"
                      />
                    </div>

                    {/* SUY BIẾN */}
                    {bone._extraType === "mutation" && (
                      <div className="mt-2 pt-2 border-t border-red-900/30 space-y-2 bg-red-950/10 p-2 rounded">
                        <input
                          value={bone.mutation.name}
                          onChange={(e) =>
                            updateSoulBoneMutation(idx, "name", e.target.value)
                          }
                          placeholder="Tên Suy Biến..."
                          className="w-full bg-slate-950 border border-red-900/50 rounded p-1.5 text-[10px] text-red-200 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={bone.mutation.star1Red}
                            onChange={(e) =>
                              updateSoulBoneMutation(
                                idx,
                                "star1Red",
                                e.target.value,
                              )
                            }
                            placeholder="1 Sao Đỏ..."
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] outline-none"
                          />
                          <input
                            value={bone.mutation.star4Red}
                            onChange={(e) =>
                              updateSoulBoneMutation(
                                idx,
                                "star4Red",
                                e.target.value,
                              )
                            }
                            placeholder="4 Sao Đỏ..."
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] outline-none"
                          />
                          <input
                            value={bone.mutation.star5Red}
                            onChange={(e) =>
                              updateSoulBoneMutation(
                                idx,
                                "star5Red",
                                e.target.value,
                              )
                            }
                            placeholder="5 Sao Đỏ..."
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] outline-none"
                          />
                          <input
                            value={bone.mutation.star6Red}
                            onChange={(e) =>
                              updateSoulBoneMutation(
                                idx,
                                "star6Red",
                                e.target.value,
                              )
                            }
                            placeholder="6 Sao Đỏ..."
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* NÂNG CẤP */}
                    {bone._extraType === "upgrade" && (
                      <div className="mt-2 pt-2 border-t border-yellow-900/30 space-y-2 bg-yellow-950/10 p-2 rounded">
                        <input
                          value={bone.upgrade.name}
                          onChange={(e) =>
                            updateSoulBoneUpgrade(idx, "name", e.target.value)
                          }
                          placeholder="Tên Nâng Cấp..."
                          className="w-full bg-slate-950 border border-yellow-900/50 rounded p-1.5 text-[10px] text-yellow-200 outline-none"
                        />
                        <div className="grid grid-cols-3 gap-1">
                          <input
                            value={bone.upgrade.star2}
                            onChange={(e) =>
                              updateSoulBoneUpgrade(
                                idx,
                                "star2",
                                e.target.value,
                              )
                            }
                            placeholder="2 Sao..."
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] outline-none"
                          />
                          <input
                            value={bone.upgrade.star3}
                            onChange={(e) =>
                              updateSoulBoneUpgrade(
                                idx,
                                "star3",
                                e.target.value,
                              )
                            }
                            placeholder="3 Sao..."
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] outline-none"
                          />
                          <input
                            value={bone.upgrade.star5}
                            onChange={(e) =>
                              updateSoulBoneUpgrade(
                                idx,
                                "star5",
                                e.target.value,
                              )
                            }
                            placeholder="5 Sao..."
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[9px] outline-none"
                          />
                        </div>
                      </div>
                    )}
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
