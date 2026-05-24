"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FaArrowLeft, FaPlus, FaSave, FaTrash, FaEdit, FaImage, FaStar, FaSearch
} from "react-icons/fa";
import { ThanThuIcon } from "@/app/components/Icons";

const INITIAL_FORM = {
  id: "", name: "", image: "", rarity: "SSR", description: "",
  skills: [], unionSkills: [], levelEffects: []
};

export default function AdminThanThuPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State cho ảnh
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/than-thu");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
    }
  };

  const handleAddNew = () => {
    setFormData(INITIAL_FORM);
    setMainImageFile(null);
    setMainImagePreview("");
    setView("form");
    setMessage("");
  };

  const handleEdit = (item: any) => {
    setFormData({
      ...INITIAL_FORM,
      ...item,
      skills: item.skills || [],
      unionSkills: item.unionSkills || [],
      levelEffects: item.levelEffects || []
    });
    setMainImageFile(null);
    setMainImagePreview(item.image || "");
    setView("form");
    setMessage("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa Thần Thú này?")) return;
    try {
      const res = await fetch(`/api/than-thu?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchItems();
      } else {
        alert("Lỗi khi xóa");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Xử lý Upload Ảnh
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn định dạng hình ảnh hợp lệ (PNG, JPG, WebP...).");
        return;
      }
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file: File, folderName: string) => {
    const dataForm = new FormData();
    dataForm.append("file", file);
    dataForm.append("folder", `than-thu/${folderName}`);
    
    const res = await fetch("/api/cloudinary/upload", { method: "POST", body: dataForm });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Lỗi khi upload ảnh lên Cloudinary");
    }
    
    const data = await res.json();
    return data.secure_url;
  };

  // Thao tác Form
  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (!formData.name.trim()) {
        throw new Error("Vui lòng nhập Tên Thần Thú trước khi lưu!");
      }

      let currentId = formData.id;
      if (!currentId) {
        currentId = formData.name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9-]/g, "-");
        setFormData((prev: any) => ({ ...prev, id: currentId }));
      }

      let finalImageUrl = formData.image;
      if (mainImageFile) {
        try {
          finalImageUrl = await uploadToCloudinary(mainImageFile, currentId || "general");
        } catch (uploadErr: any) {
          throw new Error(`Tải ảnh thất bại: ${uploadErr.message}`);
        }
      }

      const payload = {
        ...formData,
        id: currentId,
        image: finalImageUrl
      };

      const isEdit = !!items.find(i => i.id === payload.id);
      const url = "/api/than-thu";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        let errorMsg = "Lỗi lưu dữ liệu vào Database";
        try {
          const dbErr = JSON.parse(text);
          if (dbErr.error) errorMsg = dbErr.error;
        } catch (e) {
          errorMsg = text || errorMsg;
        }
        throw new Error(errorMsg);
      }
      
      setMessage("Lưu thành công!");
      fetchItems();
      setTimeout(() => setView("list"), 1500);
    } catch (err: any) {
      setMessage(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Thêm/Xóa phần tử mảng
  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, { name: "", description: "" }] });
  };
  const removeSkill = (idx: number) => {
    const newArr = [...formData.skills];
    newArr.splice(idx, 1);
    setFormData({ ...formData, skills: newArr });
  };

  const addUnionSkill = () => {
    setFormData({ 
      ...formData, 
      unionSkills: [...(formData.unionSkills || []), { name: "", linkedThanThuId: "", levelEffects: [] }] 
    });
  };
  const removeUnionSkill = (idx: number) => {
    const newArr = [...(formData.unionSkills || [])];
    newArr.splice(idx, 1);
    setFormData({ ...formData, unionSkills: newArr });
  };

  const addUnionSkillLevelEffect = (skillIdx: number) => {
    const newUnionSkills = [...(formData.unionSkills || [])];
    const targetSkill = { ...newUnionSkills[skillIdx] };
    targetSkill.levelEffects = [...(targetSkill.levelEffects || []), { level: 2, effect: "" }];
    newUnionSkills[skillIdx] = targetSkill;
    setFormData({ ...formData, unionSkills: newUnionSkills });
  };

  const removeUnionSkillLevelEffect = (skillIdx: number, effectIdx: number) => {
    const newUnionSkills = [...(formData.unionSkills || [])];
    const targetSkill = { ...newUnionSkills[skillIdx] };
    const newEffects = [...(targetSkill.levelEffects || [])];
    newEffects.splice(effectIdx, 1);
    targetSkill.levelEffects = newEffects;
    newUnionSkills[skillIdx] = targetSkill;
    setFormData({ ...formData, unionSkills: newUnionSkills });
  };

  const handleUnionSkillLevelChange = (skillIdx: number, effectIdx: number, field: "level" | "effect", value: any) => {
    const newUnionSkills = [...(formData.unionSkills || [])];
    const targetSkill = { ...newUnionSkills[skillIdx] };
    const newEffects = [...(targetSkill.levelEffects || [])];
    newEffects[effectIdx] = { ...newEffects[effectIdx], [field]: value };
    targetSkill.levelEffects = newEffects;
    newUnionSkills[skillIdx] = targetSkill;
    setFormData({ ...formData, unionSkills: newUnionSkills });
  };

  const addLevelEffect = () => {
    setFormData({ ...formData, levelEffects: [...formData.levelEffects, { level: 2, effect: "" }] });
  };
  const removeLevelEffect = (idx: number) => {
    const newArr = [...formData.levelEffects];
    newArr.splice(idx, 1);
    setFormData({ ...formData, levelEffects: newArr });
  };

  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const RARITY_ORDER: Record<string, number> = {
    "SP+": 6,
    "SP": 5,
    "SSR+": 4,
    "SSR": 3,
    "SR": 2,
    "R": 1,
  };

  const getRarityWeight = (rarity: string) => {
    const r = (rarity || "").toUpperCase().trim();
    return RARITY_ORDER[r] || 0;
  };

  const filteredAndSortedItems = items
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const normalizedQuery = removeAccents(searchQuery.toLowerCase());
      const normalizedName = removeAccents(item.name.toLowerCase());
      return normalizedName.includes(normalizedQuery) || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const weightA = getRarityWeight(a.rarity);
      const weightB = getRarityWeight(b.rarity);
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return (a.name || "").localeCompare(b.name || "", "vi");
    });

  if (view === "list") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-yellow-500/30">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <FaArrowLeft size={18} className="text-slate-400" />
              </Link>
              <div className="p-2.5 bg-yellow-500/10 rounded-2xl ring-1 ring-yellow-500/20 shadow-lg shadow-yellow-500/5">
                <ThanThuIcon className="text-yellow-500" size={24} />
              </div>
              <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
                Quản Lý Thần Thú
              </h2>
            </div>
            <div className="flex gap-3 w-full xl:w-auto justify-end">
              <button onClick={handleAddNew} className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
                <FaPlus /> Thêm Mới
              </button>
            </div>
          </header>

          {/* Search bar */}
          <div className="mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm thần thú theo tên..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all"
              />
              <div className="absolute left-3.5 top-3.5 text-slate-500">
                <FaSearch size={14} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-black">
                <tr>
                  <th className="px-6 py-4">Hình ảnh</th>
                  <th className="px-6 py-4">Tên</th>
                  <th className="px-6 py-4">Phẩm Chất</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredAndSortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden relative">
                        {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized /> : <FaImage className="m-auto mt-4 text-slate-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-yellow-500">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase bg-slate-800 px-2 py-1 rounded text-slate-300 mr-2">{item.rarity}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleEdit(item)} className="text-blue-400 hover:text-blue-300 p-2"><FaEdit size={18} /></button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 p-2"><FaTrash size={18} /></button>
                    </td>
                  </tr>
                ))}
                {filteredAndSortedItems.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-slate-500">Chưa có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-yellow-500/30 pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 sticky top-4 z-50 shadow-2xl">
          <button onClick={() => setView("list")} className="text-slate-400 hover:text-white flex items-center gap-2">
            <FaArrowLeft /> Quay lại
          </button>
          <div className="flex items-center gap-4">
            {message && <span className={message.includes("Lỗi") ? "text-red-400 font-bold" : "text-green-400 font-bold"}>{message}</span>}
            <button onClick={handleSave} disabled={loading} className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2">
              <FaSave /> {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </header>

        {/* THÔNG TIN CƠ BẢN */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-black text-yellow-500 border-b border-slate-800 pb-3 uppercase tracking-wider">Thông Tin Cơ Bản</h2>
          <div className="flex gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase">Ảnh đại diện</label>
              <div className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-slate-700 hover:border-yellow-500 bg-slate-950 overflow-hidden group flex flex-col items-center justify-center cursor-pointer transition-colors">
                {mainImagePreview ? (
                  <Image src={mainImagePreview} alt="Preview" fill className="object-cover" unoptimized />
                ) : (
                  <>
                    <FaImage size={24} className="text-slate-600 mb-2" />
                    <span className="text-[10px] font-bold text-slate-500">Upload</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tên Thần Thú</label>
                <input 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-bold text-yellow-400 outline-none focus:border-yellow-500" 
                  placeholder="Ví dụ: Bát Giác Huyền Băng Thảo"
                />
              </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phẩm chất</label>
                  <select 
                    value={formData.rarity} onChange={e => setFormData({...formData, rarity: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 outline-none focus:border-yellow-500"
                  >
                    <option value="R">R</option>
                    <option value="SR">SR</option>
                    <option value="SSR">SSR</option>
                    <option value="SSR+">SSR+</option>
                    <option value="SP">SP</option>
                    <option value="SP+">SP+</option>
                  </select>
                </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mô tả kỹ năng</label>
            <textarea 
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 min-h-[100px] text-sm text-slate-300 outline-none focus:border-yellow-500" 
              placeholder="Mô tả kỹ năng của thần thú..."
            />
          </div>
        </section>

        {/* HIỆU ỨNG NÂNG LEVEL */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-xl font-black text-orange-400 uppercase tracking-wider">Hiệu Ứng Nâng Level</h2>
            <button onClick={addLevelEffect} className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded font-bold hover:bg-orange-500/40">+ Thêm mốc level</button>
          </div>

          <div className="space-y-3">
            {formData.levelEffects.map((effect: any, idx: number) => (
              <div key={idx} className="flex gap-3 items-start bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="w-24 shrink-0">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Cấp Level</label>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-2">
                    <span className="text-slate-500 font-bold text-xs">Lv.</span>
                    <input 
                      type="number" min="2" max="5"
                      value={effect.level} onChange={e => {
                        const newArr = [...formData.levelEffects]; newArr[idx].level = Number(e.target.value); setFormData({...formData, levelEffects: newArr})
                      }}
                      className="w-full bg-transparent text-center font-bold text-yellow-500 outline-none" 
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Hiệu ứng</label>
                  <textarea 
                    value={effect.effect} onChange={e => {
                      const newArr = [...formData.levelEffects]; newArr[idx].effect = e.target.value; setFormData({...formData, levelEffects: newArr})
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm text-slate-300 min-h-[60px] outline-none focus:border-orange-500" 
                    placeholder="Mô tả hiệu ứng..."
                  />
                </div>
                <button onClick={() => removeLevelEffect(idx)} className="mt-5 bg-red-500/20 text-red-400 p-2 rounded hover:bg-red-500/40 shrink-0"><FaTrash size={14} /></button>
              </div>
            ))}
             {formData.levelEffects.length === 0 && <p className="text-center text-sm text-slate-500 py-4">Chưa có mốc hiệu ứng level nào</p>}
          </div>
        </section>

        {/* TRẠNG THÁI ĐẶC BIỆT / KỸ NĂNG CƠ BẢN */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-xl font-black text-blue-400 uppercase tracking-wider">
              Trạng Thái Đặc Biệt
            </h2>
            <button onClick={addSkill} className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded font-bold hover:bg-blue-500/40">+ Thêm trạng thái</button>
          </div>
          
          <div className="space-y-4">
            {(formData.skills || []).map((skill: any, idx: number) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex gap-4">
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex gap-2">
                    <input 
                      value={skill.name} onChange={e => {
                        const newArr = [...formData.skills]; newArr[idx].name = e.target.value; setFormData({...formData, skills: newArr})
                      }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded p-2 text-sm font-bold text-white outline-none focus:border-blue-500" 
                      placeholder="Tên trạng thái..."
                    />
                    <button onClick={() => removeSkill(idx)} className="bg-red-500/20 text-red-400 px-3 rounded hover:bg-red-500/40"><FaTrash /></button>
                  </div>
                  <textarea 
                    value={skill.description} onChange={e => {
                      const newArr = [...formData.skills]; newArr[idx].description = e.target.value; setFormData({...formData, skills: newArr})
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 min-h-[60px] outline-none focus:border-blue-500" 
                    placeholder="Mô tả trạng thái..."
                  />
                </div>
              </div>
            ))}
            {(formData.skills || []).length === 0 && <p className="text-center text-sm text-slate-500 py-4">Chưa có trạng thái nào</p>}
          </div>
        </section>

        {/* KỸ NĂNG LIÊN MINH (Chỉ dành cho SP+) */}
        {formData.rarity === "SP+" && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-xl font-black text-pink-400 uppercase tracking-wider">Kỹ Năng Liên Minh</h2>
              <button onClick={addUnionSkill} className="text-xs bg-pink-500/20 text-pink-400 px-3 py-1 rounded font-bold hover:bg-pink-500/40">+ Thêm kỹ năng liên minh</button>
            </div>
            
            <div className="space-y-4">
              {(formData.unionSkills || []).map((skill: any, idx: number) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tên kỹ năng liên minh</label>
                        <input 
                          value={skill.name} onChange={e => {
                            const newArr = [...formData.unionSkills]; newArr[idx].name = e.target.value; setFormData({...formData, unionSkills: newArr})
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm font-bold text-white outline-none focus:border-pink-500" 
                          placeholder="Ví dụ: Thiên Địa Đồng Thọ..."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Thần Thú Liên Kết</label>
                        <select
                          value={skill.linkedThanThuId || ""}
                          onChange={e => {
                            const newArr = [...formData.unionSkills]; newArr[idx].linkedThanThuId = e.target.value; setFormData({...formData, unionSkills: newArr})
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm font-bold text-white outline-none focus:border-pink-500"
                        >
                          <option value="">-- Chọn Thần Thú Liên Kết --</option>
                          {items
                            .filter(i => i.id !== formData.id)
                            .map(i => (
                              <option key={i.id} value={i.id}>{i.name} ({i.rarity})</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                    <button onClick={() => removeUnionSkill(idx)} className="bg-red-500/20 text-red-400 p-2 rounded hover:bg-red-500/40 shrink-0"><FaTrash size={14} /></button>
                  </div>

                  {/* Level effects for Union Skill */}
                  <div className="border-t border-slate-850 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-pink-400 uppercase tracking-widest">Các mốc Level</span>
                      <button 
                        type="button"
                        onClick={() => addUnionSkillLevelEffect(idx)} 
                        className="text-[10px] bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded font-bold hover:bg-pink-500/20"
                      >
                        + Thêm mốc Lv
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(skill.levelEffects || []).map((eff: any, effIdx: number) => (
                        <div key={effIdx} className="flex gap-3 items-start bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <div className="w-20 shrink-0">
                            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1.5 py-1">
                              <span className="text-slate-500 font-bold text-[10px]">Lv.</span>
                              <input 
                                type="number" min="1" max="10"
                                value={eff.level} onChange={e => {
                                  handleUnionSkillLevelChange(idx, effIdx, "level", Number(e.target.value));
                                }}
                                className="w-full bg-transparent text-center font-bold text-yellow-500 text-xs outline-none" 
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <textarea 
                              value={eff.effect} onChange={e => {
                                  handleUnionSkillLevelChange(idx, effIdx, "effect", e.target.value);
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 min-h-[50px] outline-none focus:border-pink-500" 
                              placeholder="Mô tả hiệu ứng kỹ năng liên minh..."
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeUnionSkillLevelEffect(idx, effIdx)} 
                            className="bg-red-500/10 text-red-400 p-1.5 rounded hover:bg-red-500/25 shrink-0"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ))}
                      {(skill.levelEffects || []).length === 0 && (
                        <p className="text-center text-xs text-slate-600 py-1 italic">Chưa có mốc level nào</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(formData.unionSkills || []).length === 0 && <p className="text-center text-sm text-slate-500 py-4">Chưa có kỹ năng liên minh nào</p>}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}