"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  FaSave, FaImage, FaBone, FaPlus, FaTrash, 
  FaInfoCircle, FaBolt, FaArrowUp, FaDna, FaStar 
} from "react-icons/fa";

// --- CÁC HÀM KHỞI TẠO MẪU (GIỮ NGUYÊN GỐC) ---
const getDefaultSkillType = (order: number) => {
  switch (order) {
    case 2: return "Bị động";
    case 3: return "Công thường";
    default: return "Chủ động";
  }
};

const createEmptySkill = (order: number, branch: number, heroId: string = "") => ({
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
  createEmptySkill(1, 1), createEmptySkill(2, 1), createEmptySkill(3, 1), createEmptySkill(4, 1),
  createEmptySkill(1, 2), createEmptySkill(2, 2), createEmptySkill(3, 2), createEmptySkill(4, 2),
];

const SOUL_BONE_POSITIONS = ["Đầu", "Thân", "Tay Trái", "Tay Phải", "Chân Trái", "Chân Phải"];

const createEmptySoulBone = (position: string) => ({
  position,
  name: "",
  standard: { base: "", star4: "", star6: "" },
  mutation: { name: "", star1Red: "", star4Red: "", star5Red: "", star6Red: "" },
  upgrade: { name: "", star2: "", star3: "", star5: "" },
  _extraType: "none",
});

const INITIAL_SOUL_BONES = SOUL_BONE_POSITIONS.map((pos) => createEmptySoulBone(pos));

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
  nvvCardSystem: { cards: [] },
};

export default function EditHeroPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<any>(INITIAL_HERO);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ---LOGIC LOAD DỮ LIỆU & MERGE ---
  useEffect(() => {
    const fetchHeroData = async () => {
      setMessage("");
      try {
        const heroId = params.id as string;
        if (!heroId) return;
        const res = await fetch(`/api/heroes/${heroId}`);
        if (!res.ok) return setMessage(`❌ Không tìm thấy dữ liệu cho ID: "${heroId}"`);
        
        const foundHero = await res.json();

        // A. Merge Skills 
        const mergedSkills = INITIAL_SKILLS.map((emptySkill, index) => {
          const existingSkill = foundHero.skillDetails?.[index];
          return existingSkill ? { 
            ...emptySkill, 
            ...existingSkill, 
            yearEffects: { ...emptySkill.yearEffects, ...(existingSkill.yearEffects || {}) } 
          } : emptySkill;
        });

        // B. Merge Bones 
        const mergedBones = INITIAL_SOUL_BONES.map((emptyBone) => {
          const existingBone = foundHero.soulBones?.find((b: any) => b.position === emptyBone.position);
          if (existingBone) {
            let extraType = "none";
            if (existingBone.mutation?.name) extraType = "mutation";
            if (existingBone.upgrade?.name) extraType = "upgrade";
            return {
              ...emptyBone,
              ...existingBone,
              _extraType: extraType,
              standard: { ...emptyBone.standard, ...(existingBone.standard || {}) },
              mutation: { ...emptyBone.mutation, ...(existingBone.mutation || {}) },
              upgrade: { ...emptyBone.upgrade, ...(existingBone.upgrade || {}) },
            };
          }
          return emptyBone;
        });

        setFormData({
          ...foundHero,
          skillDetails: mergedSkills,
          soulBones: mergedBones,
          nvvCardSystem: foundHero.nvvCardSystem || { cards: [] },
        });
      } catch (error) {
        setMessage("❌ Lỗi kết nối API!");
      }
    };
    fetchHeroData();
  }, [params.id]);

  // --- CÁC HÀM XỬ LÝ NHẬP LIỆU ---
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const updateBuild = (index: number, value: string) => {
    const newBuilds = [...formData.builds];
    newBuilds[index] = { title: value };
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

  const updateSoulBone = (index: number, field: string, value: any) => {
    const newBones = [...formData.soulBones];
    newBones[index][field] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

  const updateSoulBoneSub = (index: number, type: 'standard' | 'mutation' | 'upgrade', key: string, value: string) => {
    const newBones = [...formData.soulBones];
    newBones[index][type][key] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

  // ---LOGIC THẺ BÀI ---
  const addNvvCard = () => {
    const newCard = { id: `card-${Date.now()}`, name: "", type: "Thông Dụng", image: "", basicSkill: "", detailedEffect: { effect: "" } };
    setFormData({ ...formData, nvvCardSystem: { cards: [...(formData.nvvCardSystem?.cards || []), newCard] } });
  };

  const updateNvvCard = (index: number, field: string, value: any) => {
    const newCards = [...formData.nvvCardSystem.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setFormData({ ...formData, nvvCardSystem: { cards: newCards } });
  };

  const removeNvvCard = (index: number) => {
    const newCards = formData.nvvCardSystem.cards.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, nvvCardSystem: { cards: newCards } });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/update-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Lỗi cập nhật dữ liệu");
      setMessage("✅ Cập nhật thành công!");
    } catch (err: any) {
      setMessage(`❌ Lỗi: ${err.message}`);
    } finally { setLoading(false); }
  };

  if (!formData) return <div className="p-10 text-white flex items-center justify-center">Đang tải dữ liệu...</div>;
  const isVinhVinh = formData.name?.toLowerCase().includes("vinh vinh");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8 pb-32 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-slate-950/95 backdrop-blur z-20 py-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-blue-400 uppercase tracking-tight">CHỈNH SỬA: {formData.name}</h1>
            <p className="text-xs text-slate-500 font-mono mt-1 tracking-widest uppercase">ID: {formData.id}</p>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition active:scale-95 shadow-lg shadow-blue-900/20">
            <FaSave /> {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
          </button>
        </header>

        {message && <div className={`p-4 mb-8 rounded-lg font-bold border animate-fadeIn ${message.includes("Lỗi") ? "bg-red-950/30 border-red-500 text-red-400" : "bg-green-950/30 border-green-500 text-green-400"}`}>{message}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI: INFO CHUNG */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sticky top-28 space-y-4 shadow-2xl">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-slate-800 pb-2"><FaImage className="text-yellow-500"/> Cơ Bản</h2>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-yellow-400 font-bold outline-none focus:border-yellow-500 transition" />
              <div className="grid grid-cols-2 gap-2">
                <select name="rarity" value={formData.rarity} onChange={handleChange} className="bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white">
                  <option value="SP">SP</option><option value="SP+">SP+</option><option value="SSR">SSR</option>
                </select>
                <select name="type" value={formData.type} onChange={handleChange} className="bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white">
                  <option value="Cường Công">Cường Công</option><option value="Phụ Trợ">Phụ Trợ</option><option value="Mẫn Công">Mẫn Công</option><option value="Khống Chế">Khống Chế</option><option value="Phòng Ngự">Phòng Ngự</option>
                </select>
              </div>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Danh hiệu" className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm" />
              
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gợi ý Build</p>
                <input type="text" value={formData.builds[0]?.title || ""} onChange={(e) => updateBuild(0, e.target.value)} placeholder="PvE Build" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm font-mono text-blue-400 outline-none focus:border-blue-500" />
                <input type="text" value={formData.builds[1]?.title || ""} onChange={(e) => updateBuild(1, e.target.value)} placeholder="PvP Build" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm font-mono text-red-400 outline-none focus:border-red-500" />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* HỆ THỐNG THẺ BÀI */}
            {(isVinhVinh || formData.rarity === "SP+") && (
              <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-pink-500/20 shadow-xl animate-fadeIn">
                <div className="flex justify-between items-center border-b border-pink-500/30 pb-3">
                  <h2 className="text-xl font-bold text-pink-400 uppercase flex items-center gap-2"><FaInfoCircle /> Hệ Thống Thẻ Bài</h2>
                  <button onClick={addNvvCard} className="bg-pink-600/20 text-pink-400 border border-pink-600/50 px-4 py-1.5 rounded-md text-xs flex items-center gap-2 hover:bg-pink-600 hover:text-white transition shadow-lg"><FaPlus /> Thêm Thẻ</button>
                </div>
                <div className="grid gap-6">
                  {formData.nvvCardSystem.cards.map((card: any, idx: number) => (
                    <div key={card.id} className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative group shadow-lg hover:border-pink-500/30 transition">
                      <button onClick={() => removeNvvCard(idx)} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors"><FaTrash /></button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div className="space-y-4">
                          <input value={card.name} onChange={(e) => updateNvvCard(idx, "name", e.target.value)} placeholder="Tên thẻ bài..." className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-sm font-bold text-pink-300 outline-none focus:border-pink-500" />
                          <select value={card.type} onChange={(e) => updateNvvCard(idx, "type", e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-sm text-slate-300">
                            <option value="Thông Dụng">Thông Dụng</option>
                            <option value="Cửu Thải Lưu Ly · Tốc">Cửu Thải Lưu Ly · Tốc</option>
                            <option value="Lưu Ly Tâm Nguyên">Lưu Ly Tâm Nguyên</option>
                            <option value="Cửu Thải Lưu Ly · Dụ">Cửu Thải Lưu Ly · Dụ</option>
                            <option value="Cửu Thải Lưu Ly · Diệu">Cửu Thải Lưu Ly · Diệu</option>
                          </select>
                        </div>
                        <div className="space-y-4">
                           <textarea value={card.basicSkill} onChange={(e) => updateNvvCard(idx, "basicSkill", e.target.value)} placeholder="Kỹ năng cơ bản..." className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-xs h-16 outline-none focus:border-pink-500" />
                           <textarea value={card.detailedEffect?.effect} onChange={(e) => {
                              const newCards = [...formData.nvvCardSystem.cards];
                              newCards[idx].detailedEffect = { effect: e.target.value };
                              setFormData({ ...formData, nvvCardSystem: { cards: newCards } });
                           }} placeholder="Hiệu ứng chi tiết..." className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-xs h-16 outline-none focus:border-blue-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HỒN CỐT */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-yellow-500 border-b border-slate-800 pb-2 flex items-center gap-2 uppercase tracking-wide"><FaBone /> Hệ Thống Hồn Cốt</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.soulBones.map((bone: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-xl transition-all hover:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="bg-blue-900/30 text-blue-400 px-3 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{bone.position}</span>
                      <select value={bone._extraType} onChange={(e) => updateSoulBone(idx, "_extraType", e.target.value)} className="text-[10px] bg-slate-800 text-slate-300 p-1.5 rounded outline-none cursor-pointer font-bold border border-slate-700">
                        <option value="none">Mở rộng: Không</option>
                        <option value="mutation">Mở rộng: Suy Biến</option>
                        <option value="upgrade">Mở rộng: Nâng Cấp</option>
                      </select>
                    </div>
                    <input value={bone.name} onChange={(e) => updateSoulBone(idx, "name", e.target.value)} placeholder="Tên hồn cốt" className="w-full bg-transparent border-b border-slate-800 text-sm font-bold text-slate-100 outline-none focus:border-blue-500 transition" />
                    
                    <div className="space-y-2.5">
                       <textarea value={bone.standard?.base} onChange={(e) => updateSoulBoneSub(idx, 'standard', 'base', e.target.value)} placeholder="Hiệu quả cơ bản..." className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-[10px] h-14 outline-none focus:border-yellow-500 transition" />
                       <div className="grid grid-cols-2 gap-2">
                          <input value={bone.standard?.star4} onChange={(e) => updateSoulBoneSub(idx, 'standard', 'star4', e.target.value)} placeholder="4 Sao Vàng..." className="bg-slate-950 border border-slate-800 p-2 rounded text-[9px] text-yellow-500 outline-none focus:border-yellow-600" />
                          <input value={bone.standard?.star6} onChange={(e) => updateSoulBoneSub(idx, 'standard', 'star6', e.target.value)} placeholder="6 Sao Vàng..." className="bg-slate-950 border border-slate-800 p-2 rounded text-[9px] text-yellow-600 outline-none focus:border-yellow-700" />
                       </div>
                    </div>

                    {/* SUY BIẾN */}
                    {bone._extraType === "mutation" && (
                      <div className="space-y-2.5 pt-3 border-t border-red-900/30 bg-red-950/10 p-2.5 rounded-lg animate-fadeIn">
                        <div className="flex items-center gap-1 text-[10px] text-red-400 font-black mb-1"><FaDna /> SUY BIẾN (SAO ĐỎ)</div>
                        <input value={bone.mutation?.name} onChange={(e) => updateSoulBoneSub(idx, 'mutation', 'name', e.target.value)} placeholder="Tên Hồn Cốt Suy Biến..." className="w-full bg-slate-950 border border-red-900/30 rounded p-2 text-[10px] text-red-200 outline-none focus:border-red-500" />
                        <textarea value={bone.mutation?.star6Red} onChange={(e) => updateSoulBoneSub(idx, 'mutation', 'star6Red', e.target.value)} placeholder="Mô tả hiệu quả 6 Sao Đỏ..." className="w-full bg-slate-950 border border-red-900/30 rounded p-2 text-[10px] h-12 outline-none focus:border-red-600" />
                      </div>
                    )}

                    {/* NÂNG CẤP TỨ CHI */}
                    {bone._extraType === "upgrade" && (
                      <div className="space-y-2.5 pt-3 border-t border-yellow-900/30 bg-yellow-950/10 p-2.5 rounded-lg animate-fadeIn">
                        <div className="flex items-center gap-1 text-[10px] text-yellow-400 font-black mb-1"><FaArrowUp /> NÂNG CẤP TỨ CHI</div>
                        <input value={bone.upgrade?.name} onChange={(e) => updateSoulBoneSub(idx, 'upgrade', 'name', e.target.value)} placeholder="Tên sau Nâng Cấp..." className="w-full bg-slate-950 border border-yellow-900/30 rounded p-2 text-[10px] text-yellow-200 outline-none focus:border-yellow-500" />
                        <div className="grid grid-cols-3 gap-1.5">
                           <input value={bone.upgrade?.star2} onChange={(e) => updateSoulBoneSub(idx, 'upgrade', 'star2', e.target.value)} placeholder="2 Sao..." className="bg-slate-950 border border-slate-800 p-1.5 rounded text-[8px] text-slate-300" />
                           <input value={bone.upgrade?.star3} onChange={(e) => updateSoulBoneSub(idx, 'upgrade', 'star3', e.target.value)} placeholder="3 Sao..." className="bg-slate-950 border border-slate-800 p-1.5 rounded text-[8px] text-slate-300" />
                           <input value={bone.upgrade?.star5} onChange={(e) => updateSoulBoneSub(idx, 'upgrade', 'star5', e.target.value)} placeholder="5 Sao..." className="bg-slate-950 border border-slate-800 p-1.5 rounded text-[8px] text-slate-300" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* KỸ NĂNG */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-slate-800 pb-2 uppercase tracking-wide">Chi Tiết Kỹ Năng Hồn Hoàn</h2>
              {formData.skillDetails.map((skill: any, idx: number) => (
                <div key={idx} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl transition-all hover:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">Skill {skill._tempOrder} (Nhánh {skill._tempBranch})</span>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-900/20 px-2 py-0.5 rounded uppercase">{skill.type}</span>
                  </div>
                  <input value={skill.name} onChange={(e) => updateSkill(idx, "name", e.target.value)} placeholder="Tên kỹ năng" className="w-full bg-transparent border-b border-slate-800 py-2 font-bold text-white outline-none focus:border-blue-500 transition text-lg" />
                  <textarea value={skill.description} onChange={(e) => updateSkill(idx, "description", e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm h-28 outline-none focus:border-slate-600 transition text-slate-300" placeholder="Mô tả chi tiết kỹ năng..." />
                  <div className="grid gap-3 bg-slate-950/50 p-5 rounded-2xl border border-slate-900/50">
                    {["y1k", "y10k", "y25k", "y50k", "y100k"].map(y => (
                      <div key={y} className="flex items-center gap-4">
                        <span className={`w-14 text-[10px] font-black uppercase text-right ${y === 'y100k' ? 'text-red-500' : 'text-slate-600'}`}>{y.replace('y', '')}</span>
                        <input value={skill.yearEffects?.[y] || ""} onChange={(e) => updateSkillYear(idx, y, e.target.value)} className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}