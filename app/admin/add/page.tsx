"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaBone,
  FaStar,
  FaChevronDown,
  FaDna,
  FaArrowUp,
  FaPlus,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

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
  iconUrl: "",
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

// --- THẦN CHỈ HELPERS ---

const createEmptyDivineRing = () => ({
  name: "",
  description: "",
  iconUrl: "",
  yearEffects: {
    y50k: "",
    y100k: "",
    y500k: "",
    y1000k: "",
    y1000kBuffs: Array(9).fill(""),
  },
});

const createEmptyDivineSkill = () => ({
  name: "",
  description: "",
  iconUrl: "",
  notes: [],
  rings: [createEmptyDivineRing(), createEmptyDivineRing(), createEmptyDivineRing()],
});

const createEmptyDivineBranch = (name: string) => ({
  name: name,
  skills: Array(5).fill(null).map(() => createEmptyDivineSkill()),
});

const createEmptyDivineAvatar = (level: number) => ({
  level: level,
  name: "",
  skill: "",
  iconUrl: "",
});

const createEmptyWing = (name: string) => ({
  name: name,
  iconUrl: "",
  regularSkill: { description: "", upgrades: ["", "", ""] },
  mutatedSkill: { description: "" },
});

const INITIAL_DIVINE_SYSTEM = {
  branches: [createEmptyDivineBranch("Nhánh 1"), createEmptyDivineBranch("Nhánh 2")],
  avatars: Array(6).fill(null).map((_, i) => createEmptyDivineAvatar(i + 1)),
  wings: {
    left: [createEmptyWing("Cánh 1"), createEmptyWing("Cánh 2"), createEmptyWing("Cánh 3"), createEmptyWing("Cánh 4")],
    right: [createEmptyWing("Cánh 1"), createEmptyWing("Cánh 2"), createEmptyWing("Cánh 3"), createEmptyWing("Cánh 4")],
  },
};

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
  divineSystem: INITIAL_DIVINE_SYSTEM,
};

// --- COMPONENT ACCORDION SECTION ---
const Section = ({
  title,
  icon,
  color = "slate",
  children,
  action,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ReactNode;
  color?: "blue" | "red" | "pink" | "yellow" | "slate";
  children: React.ReactNode;
  action?: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const styles = {
    blue: {
      container: "bg-slate-900/50 border-blue-500/20",
      header: "border-blue-500/30 text-blue-400",
    },
    red: {
      container: "bg-slate-900/50 border-red-500/20",
      header: "border-red-500/30 text-red-400",
    },
    pink: {
      container: "bg-slate-900/50 border-pink-500/20",
      header: "border-pink-500/30 text-pink-400",
    },
    yellow: {
      container: "bg-slate-900/50 border-yellow-500/20",
      header: "border-yellow-500/30 text-yellow-500",
    },
    slate: {
      container: "bg-slate-900/20 border-slate-800",
      header: "border-slate-800 text-slate-200",
    },
  };

  const currentStyle = styles[color];

  return (
    <div
      className={`rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 ${currentStyle.container}`}
    >
      <div
        className={`flex justify-between items-center p-4 cursor-pointer bg-slate-900/80 hover:bg-slate-900 transition border-b ${isOpen ? currentStyle.header : "border-transparent"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold uppercase flex items-center gap-2">
          {icon} {title}
        </h2>
        <div className="flex items-center gap-3">
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
          <FaChevronDown
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} text-slate-400`}
          />
        </div>
      </div>
      {isOpen && <div className="p-6 space-y-6 animate-fadeIn">{children}</div>}
    </div>
  );
};

export default function AddHeroPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [skillFiles, setSkillFiles] = useState<{ [key: number]: File }>({});
  const [boneFiles, setBoneFiles] = useState<{ [key: number]: File }>({});

  // Divine System Files
  const [divineSkillFiles, setDivineSkillFiles] = useState<Record<string, File>>({});
  const [divineRingFiles, setDivineRingFiles] = useState<Record<string, File>>({});
  const [divineAvatarFiles, setDivineAvatarFiles] = useState<Record<number, File>>({});
  const [divineWingFiles, setDivineWingFiles] = useState<Record<string, File>>({});

  const [formData, setFormData] = useState<any>(INITIAL_HERO);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasBranch2, setHasBranch2] = useState(true);
  const isAmKhi = formData.type === "Ám Khí";
  const isDivine = formData.rarity === "Thần Chỉ";

  useEffect(() => {
    if (formData.rarity === "SP+") {
      setHasBranch2(false);
    } else {
      setHasBranch2(true);
    }

    // Tự động chuyển hệ thành "Thần" nếu là rarity "Thần Chỉ"
    if (formData.rarity === "Thần Chỉ") {
      setFormData((prev: any) => ({ ...prev, type: "Thần" }));
    } else if (formData.type === "Thần") {
      // Nếu chuyển từ Thần Chỉ sang cái khác thì reset type về Cường Công
      setFormData((prev: any) => ({ ...prev, type: "Cường Công" }));
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
      image:
        previewUrl || prev.image?.startsWith("http")
          ? prev.image
          : `/images/${slug}/avt.webp`,
      skillDetails: prev.skillDetails.map((s: any, idx: number) => ({
        ...s,
        id: `${slug}-s${s._tempOrder}-${s._tempBranch}`,
        iconUrl:
          skillFiles[idx] || s.iconUrl?.startsWith("http")
            ? s.iconUrl
            : `/images/${slug}/hh${s._tempOrder}-${s._tempBranch}.webp`,
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

  // --- HÀM XỬ LÝ THẦN CHỈ ---
  const updateDivineGodSkill = (
    branchIdx: number,
    skillIdx: number,
    field: string,
    value: any,
  ) => {
    const newDivine = { ...formData.divineSystem };
    newDivine.branches[branchIdx].skills[skillIdx][field] = value;
    setFormData({ ...formData, divineSystem: newDivine });
  };

  const updateDivineRing = (
    branchIdx: number,
    skillIdx: number,
    ringIdx: number,
    field: string,
    value: any,
  ) => {
    const newDivine = { ...formData.divineSystem };
    newDivine.branches[branchIdx].skills[skillIdx].rings[ringIdx][field] = value;
    setFormData({ ...formData, divineSystem: newDivine });
  };

  const updateDivineRingYear = (
    branchIdx: number,
    skillIdx: number,
    ringIdx: number,
    yearKey: string,
    value: any,
  ) => {
    const newDivine = { ...formData.divineSystem };
    newDivine.branches[branchIdx].skills[skillIdx].rings[ringIdx].yearEffects[
      yearKey
    ] = value;
    setFormData({ ...formData, divineSystem: newDivine });
  };

  const updateDivineRingBuff = (
    branchIdx: number,
    skillIdx: number,
    ringIdx: number,
    buffIdx: number,
    value: string,
  ) => {
    const newDivine = { ...formData.divineSystem };
    newDivine.branches[branchIdx].skills[skillIdx].rings[
      ringIdx
    ].yearEffects.y1000kBuffs[buffIdx] = value;
    setFormData({ ...formData, divineSystem: newDivine });
  };

  const updateDivineAvatar = (idx: number, field: string, value: string) => {
    const newDivine = { ...formData.divineSystem };
    newDivine.avatars[idx][field] = value;
    setFormData({ ...formData, divineSystem: newDivine });
  };

  const updateWing = (
    side: "left" | "right",
    wingIdx: number,
    field: string,
    value: any,
  ) => {
    const newDivine = { ...formData.divineSystem };
    newDivine.wings[side][wingIdx][field] = value;
    setFormData({ ...formData, divineSystem: newDivine });
  };

  // 2. HÀM CHỌN ẢNH (CHỈ PREVIEW, KHÔNG UPLOAD)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Lưu file vào state để dành đó
    setSelectedFile(file);

    // Tạo link ảo để xem trước ngay lập tức
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Xóa dữ liệu ảnh cũ trong form (nếu có) để ưu tiên file mới
    setFormData((prev: any) => ({ ...prev, image: "" }));
  };

  const handleSkillFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSkillFiles((prev) => ({ ...prev, [index]: file }));
    const objectUrl = URL.createObjectURL(file);
    const newSkills = [...formData.skillDetails];
    newSkills[index].iconUrl = objectUrl;
    setFormData({ ...formData, skillDetails: newSkills });
  };

  const handleBoneFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBoneFiles((prev) => ({ ...prev, [index]: file }));
    const objectUrl = URL.createObjectURL(file);
    const newBones = [...formData.soulBones];
    newBones[index].iconUrl = objectUrl;
    setFormData({ ...formData, soulBones: newBones });
  };

  const handleDivineSkillFileChange = (bIdx: number, sIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `${bIdx}-${sIdx}`;
    setDivineSkillFiles(prev => ({ ...prev, [key]: file }));
    const objectUrl = URL.createObjectURL(file);
    const newDivine = { ...formData.divineSystem };
    newDivine.branches[bIdx].skills[sIdx].iconUrl = objectUrl;
    setFormData({ ...formData, divineSystem: newDivine });
  };

  const handleDivineRingFileChange = (bIdx: number, sIdx: number, rIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `${bIdx}-${sIdx}-${rIdx}`;
    setDivineRingFiles(prev => ({ ...prev, [key]: file }));
    const objectUrl = URL.createObjectURL(file);
    const newDivine = { ...formData.divineSystem };
    newDivine.branches[bIdx].skills[sIdx].rings[rIdx].iconUrl = objectUrl;
    setFormData({ ...formData, divineSystem: newDivine });
  };

  const handleDivineAvatarFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDivineAvatarFiles(prev => ({ ...prev, [idx]: file }));
    const objectUrl = URL.createObjectURL(file);
    const newDivine = { ...formData.divineSystem };
    newDivine.avatars[idx].iconUrl = objectUrl;
    setFormData({ ...formData, divineSystem: newDivine });
  };

  const handleDivineWingFileChange = (side: string, idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `${side}-${idx}`;
    setDivineWingFiles(prev => ({ ...prev, [key]: file }));
    const objectUrl = URL.createObjectURL(file);
    const newDivine = { ...formData.divineSystem };
    newDivine.wings[side][idx].iconUrl = objectUrl;
    setFormData({ ...formData, divineSystem: newDivine });
  };

  // 3. HÀM UPLOAD THỰC SỰ (SẼ GỌI KHI BẤM LƯU)
  const uploadToCloudinary = async (file: File, folderName: string) => {
    const dataForm = new FormData();
    dataForm.append("file", file);

    // Gửi tên folder muốn tạo lên API nội bộ
    if (folderName) {
      dataForm.append("folder", `soul-masters/${folderName}`);
    }

    // Gọi API nội bộ thay vì gọi trực tiếp Cloudinary từ client
    const res = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: dataForm,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Lỗi khi upload ảnh lên server!");
    }

    const data = await res.json();
    return data.secure_url; // Trả về link ảnh thật từ Cloudinary
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    // 1. Đảm bảo ID được sinh ra trước khi upload (Tránh trường hợp chưa Blur ô tên)
    let currentId = formData.id;
    if (!currentId && formData.name) {
      currentId = formData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      // Cập nhật cả vào formData để các bước sau dùng đúng ID này
      setFormData((prev: any) => ({ ...prev, id: currentId }));
    }

    try {
      let finalImageUrl = formData.image;
      if (selectedFile) {
        try {
          const folderName = currentId || "hon-su-khac";
          finalImageUrl = await uploadToCloudinary(selectedFile, folderName);
        } catch (uploadError: any) {
          throw new Error(`Cloudinary Error: ${uploadError.message}`);
        }
      }

      // Upload Skills
      const uploadedSkills = await Promise.all(
        formData.skillDetails.map(async (skill: any, index: number) => {
          if (skillFiles[index]) {
            const url = await uploadToCloudinary(
              skillFiles[index],
              currentId || "skills",
            );
            return { ...skill, iconUrl: url };
          }
          return skill;
        }),
      );

      // Upload Bones
      const uploadedBones = await Promise.all(
        formData.soulBones.map(async (bone: any, index: number) => {
          if (boneFiles[index]) {
            const url = await uploadToCloudinary(
              boneFiles[index],
              currentId || "bones",
            );
            return { ...bone, iconUrl: url };
          }
          return bone;
        }),
      );

      // Upload Divine System
      let updatedDivineSystem = { ...formData.divineSystem };
      if (isDivine && updatedDivineSystem.branches) {
        updatedDivineSystem.branches = await Promise.all(
          updatedDivineSystem.branches.map(async (branch: any, bIdx: number) => {
            const updatedSkills = await Promise.all(
              branch.skills.map(async (skill: any, sIdx: number) => {
                const skillKey = `${bIdx}-${sIdx}`;
                let updatedSkill = { ...skill };

                if (divineSkillFiles[skillKey]) {
                  try {
                    const url = await uploadToCloudinary(
                      divineSkillFiles[skillKey],
                      currentId || "skills",
                    );
                    updatedSkill.iconUrl = url;
                  } catch (err) {
                    console.error("Error uploading divine skill icon:", err);
                  }
                }

                // Upload Divine Rings
                if (updatedSkill.rings) {
                  updatedSkill.rings = await Promise.all(
                    updatedSkill.rings.map(async (ring: any, rIdx: number) => {
                      const ringKey = `${bIdx}-${sIdx}-${rIdx}`;
                      let updatedRing = { ...ring };
                      if (divineRingFiles[ringKey]) {
                        try {
                          const url = await uploadToCloudinary(
                            divineRingFiles[ringKey],
                            currentId || "rings",
                          );
                          updatedRing.iconUrl = url;
                        } catch (err) {
                          console.error("Error uploading divine ring icon:", err);
                        }
                      }
                      return updatedRing;
                    }),
                  );
                }

                return updatedSkill;
              }),
            );
            return { ...branch, skills: updatedSkills };
          }),
        );
      }

      // Upload Avatars
      if (isDivine && updatedDivineSystem.avatars) {
        updatedDivineSystem.avatars = await Promise.all(
          updatedDivineSystem.avatars.map(async (av: any, idx: number) => {
            if (divineAvatarFiles[idx]) {
              try {
                const url = await uploadToCloudinary(divineAvatarFiles[idx], currentId || "avatars");
                return { ...av, iconUrl: url };
              } catch (err) {
                console.error("Error uploading divine avatar icon:", err);
              }
            }
            return av;
          })
        );
      }

      // Upload Wings
      if (isDivine && updatedDivineSystem.wings) {
        const sides: ("left" | "right")[] = ["left", "right"];
        for (const side of sides) {
          if (updatedDivineSystem.wings[side]) {
            updatedDivineSystem.wings[side] = await Promise.all(
              updatedDivineSystem.wings[side].map(async (wing: any, idx: number) => {
                const wingKey = `${side}-${idx}`;
                if (divineWingFiles[wingKey]) {
                  try {
                    const url = await uploadToCloudinary(divineWingFiles[wingKey], currentId || "wings");
                    return { ...wing, iconUrl: url };
                  } catch (err) {
                    console.error("Error uploading divine wing icon:", err);
                  }
                }
                return wing;
              })
            );
          }
        }
      }

      const cleanData = {
        ...formData,
        image: finalImageUrl,
        skillDetails: uploadedSkills,
        soulBones: uploadedBones,
        divineSystem: updatedDivineSystem,
      };

      if (isDivine) {
        // Có thể xóa các phần không cần thiết của SP/SSR nếu muốn, 
        // nhưng tốt nhất là giữ lại để linh hoạt
      } else {
        delete cleanData.divineSystem;
      }

      if (!isDivine && !hasBranch2) {
        cleanData.skillDetails = cleanData.skillDetails.slice(0, 4);
      }

      // Đảm bảo ID được sinh ra nếu chưa có
      cleanData.skillDetails = cleanData.skillDetails.map((skill: any) => {
        if (!skill.id && currentId) {
          return {
            ...skill,
            id: `${currentId}-s${skill._tempOrder}-${skill._tempBranch}`,
            iconUrl:
              skill.iconUrl ||
              `/images/${currentId}/hh${skill._tempOrder}-${skill._tempBranch}.webp`,
          };
        }
        return skill;
      });

      const res = await fetch("/api/soul-masters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      const result = await res.json(); // Lấy message lỗi từ server nếu có
      if (!res.ok) throw new Error(result.message || "Lỗi lưu dữ liệu");

      setMessage("✅ Thêm tướng thành công!");

      setSelectedFile(null);
    } catch (err: any) {
      setMessage(`❌ Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };



  const renderSkillCard = (skill: any, idx: number) => (
    <div
      key={idx}
      className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl transition-all hover:border-slate-700"
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">
          Skill {skill._tempOrder}
        </span>
        <span className="text-[10px] font-bold text-blue-500 bg-blue-900/20 px-2 py-0.5 rounded uppercase">
          {skill.type}
        </span>
        <div className="relative w-10 h-10 rounded overflow-hidden border border-slate-700 bg-slate-950 shrink-0 group ml-auto mr-4">
          {skill.iconUrl ? (
            <Image
              src={skill.iconUrl}
              alt="icon"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <FaImage size={12} />
            </div>
          )}
          <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
            <FaImage size={12} className="text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleSkillFileChange(idx, e)}
            />
          </label>
        </div>
      </div>
      <div className="flex gap-4 items-end">
        <input
          value={skill.name}
          onChange={(e) => updateSkill(idx, "name", e.target.value)}
          placeholder="Tên kỹ năng"
          className="flex-1 bg-transparent border-b border-slate-800 py-2 font-bold text-white outline-none focus:border-blue-500 transition text-lg"
        />
        <input
          type="text"
          value={skill.soulRingType}
          onChange={(e) => updateSkill(idx, "soulRingType", e.target.value)}
          className="w-1/3 bg-transparent border-b border-slate-700 focus:border-slate-400 py-2 text-sm text-slate-300 outline-none transition"
          placeholder="Loại (VD: Khống chế)"
        />
      </div>
      <textarea
        value={skill.description}
        onChange={(e) => updateSkill(idx, "description", e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm h-28 outline-none focus:border-slate-600 transition text-slate-300"
        placeholder="Mô tả chi tiết kỹ năng..."
      />
      <div className="grid gap-3 bg-slate-950/50 p-5 rounded-2xl border border-slate-900/50">
        {["y1k", "y10k", "y25k", "y50k", "y100k"].map((y) => (
          <div key={y} className="flex items-center gap-4">
            <span
              className={`w-5 text-[10px] font-black uppercase text-left ${y === "y100k" ? "text-red-500" : "text-slate-600"}`}
            >
              {y.replace("y", "")}
            </span>
            <textarea
              value={skill.yearEffects?.[y] || ""}
              onChange={(e) => updateSkillYear(idx, y, e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500 transition"
            />
          </div>
        ))}
      </div>
      <div>
        <textarea
          defaultValue={Array.isArray(skill.note) ? skill.note.join("\n") : ""}
          onBlur={(e) => updateSkillNote(idx, e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono h-20 focus:border-slate-500 outline-none"
          placeholder="Ghi chú (Mỗi dòng 1 ý)"
        />
      </div>
    </div>
  );

  const renderDivineRingSystem = () => (
    <div className="space-y-12">
      {formData.divineSystem.branches.map((branch: any, bIdx: number) => (
        <div key={bIdx} className="space-y-6">
          <h3 className="text-2xl font-black text-yellow-500 border-b-2 border-yellow-500/20 pb-2 uppercase italic tracking-tighter">
            {branch.name}
          </h3>
          <div className="grid gap-8">
            {branch.skills.map((skill: any, sIdx: number) => (
              <div
                key={sIdx}
                className="bg-slate-900/80 rounded-3xl border border-white/5 p-8 space-y-6 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <FaDna size={80} />
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-yellow-500/20 bg-black/40 shrink-0 group">
                      {skill.iconUrl ? (
                        <Image
                          src={skill.iconUrl}
                          alt="icon"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-yellow-500/20">
                          <FaImage size={24} />
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                        <FaPlus size={16} className="text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleDivineSkillFileChange(bIdx, sIdx, e)}
                        />
                      </label>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black bg-yellow-500 text-black px-2 py-0.5 rounded uppercase">
                          Thần Kỹ {sIdx + 1}
                        </span>
                        <input
                          value={skill.name}
                          onChange={(e) =>
                            updateDivineGodSkill(bIdx, sIdx, "name", e.target.value)
                          }
                          placeholder="Tên Thần Kỹ"
                          className="flex-1 bg-transparent border-b border-white/10 py-2 font-black text-white outline-none focus:border-yellow-500 transition text-xl uppercase tracking-tight"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <textarea
                  value={skill.description}
                  onChange={(e) =>
                    updateDivineGodSkill(
                      bIdx,
                      sIdx,
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Mô tả kỹ năng cơ bản..."
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm h-24 outline-none focus:border-yellow-500/50 transition text-slate-300"
                />
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">
                    Ghi chú hiệu ứng (Mỗi dòng 1 ý)
                  </label>
                  <textarea
                    value={skill.notes.join("\n")}
                    onChange={(e) =>
                      updateDivineGodSkill(
                        bIdx,
                        sIdx,
                        "notes",
                        e.target.value.split("\n"),
                      )
                    }
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs font-mono h-20 focus:border-yellow-500/30 outline-none text-slate-400"
                    placeholder="Giải thích tên hiệu ứng..."
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-4">
                  {skill.rings.map((ring: any, rIdx: number) => (
                    <div
                      key={rIdx}
                      className="bg-black/40 rounded-2xl border border-white/5 p-5 space-y-4 hover:border-yellow-500/20 transition-all"
                    >
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/40 shrink-0 group">
                          {ring.iconUrl ? (
                            <Image
                              src={ring.iconUrl}
                              alt="icon"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-yellow-500/20">
                              <span className="text-xs font-black">{rIdx + 1}</span>
                            </div>
                          )}
                          <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                            <FaPlus size={10} className="text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleDivineRingFileChange(bIdx, sIdx, rIdx, e)}
                            />
                          </label>
                        </div>
                        <input
                          value={ring.name}
                          onChange={(e) =>
                            updateDivineRing(
                              bIdx,
                              sIdx,
                              rIdx,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder="Tên Thần Hoàn"
                          className="flex-1 bg-transparent py-1 font-bold text-sm text-yellow-400 outline-none"
                        />
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/5">
                        {["y50k", "y100k", "y500k", "y1000k"].map((y) => (
                          <div key={y} className="flex gap-3">
                            <span
                              className={`text-[9px] font-black w-8 pt-2 ${y === "y1000k" ? "text-red-500" : "text-slate-600"}`}
                            >
                              {y === "y50k" ? "5v" : y === "y100k" ? "10v" : y === "y500k" ? "50v" : "100v"}
                            </span>
                            <textarea
                              value={ring.yearEffects[y]}
                              onChange={(e) =>
                                updateDivineRingYear(
                                  bIdx,
                                  sIdx,
                                  rIdx,
                                  y,
                                  e.target.value,
                                )
                              }
                              className="flex-1 bg-black/20 border border-white/5 rounded-lg px-2 py-1.5 text-[11px] text-slate-300 outline-none focus:border-yellow-500/50 min-h-[40px]"
                            />
                          </div>
                        ))}
                        <div className="flex flex-col gap-2 pt-2">
                          {ring.yearEffects.y1000kBuffs.map(
                            (buff: string, buffIdx: number) => (
                              <div key={buffIdx} className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-yellow-600 w-5">+{buffIdx + 1}</span>
                                <input
                                  value={buff}
                                  onChange={(e) =>
                                    updateDivineRingBuff(
                                      bIdx,
                                      sIdx,
                                      rIdx,
                                      buffIdx,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`Chỉ số +${buffIdx + 1}`}
                                  className="flex-1 bg-black/40 border border-white/5 rounded px-3 py-1.5 text-[11px] text-yellow-500 outline-none focus:border-yellow-500"
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDivineAvatarSystem = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {formData.divineSystem.avatars.map((av: any, idx: number) => (
        <div
          key={idx}
          className="bg-slate-900/60 rounded-2xl border border-white/5 p-6 space-y-4 hover:border-blue-500/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-blue-500/20 bg-black/40 shrink-0 group">
              {av.iconUrl ? (
                <Image
                  src={av.iconUrl}
                  alt="icon"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-500/20">
                  <FaImage size={16} />
                </div>
              )}
              <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                <FaPlus size={12} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleDivineAvatarFileChange(idx, e)}
                />
              </label>
            </div>
            <div className="h-10 px-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xs whitespace-nowrap">
              Lvl {av.level}
            </div>
            <input
              value={av.name}
              onChange={(e) => updateDivineAvatar(idx, "name", e.target.value)}
              placeholder="Tên Pháp Tướng"
              className="flex-1 bg-transparent border-b border-white/10 py-2 font-bold text-white outline-none focus:border-blue-400 transition"
            />
          </div>
          <textarea
            value={av.skill}
            onChange={(e) => updateDivineAvatar(idx, "skill", e.target.value)}
            placeholder="Kỹ năng pháp tướng..."
            className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm h-32 outline-none focus:border-blue-500/50 transition text-slate-300"
          />
        </div>
      ))}
    </div>
  );

  const renderWingSystem = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
      {["left", "right"].map((side) => (
        <div key={side} className="space-y-6">
          <h3 className="text-xl font-black text-pink-500 border-b border-pink-500/20 pb-2 uppercase italic tracking-widest">
            Cánh {side === "left" ? "Trái" : "Phải"}
          </h3>
          <div className="space-y-8">
            {formData.divineSystem.wings[side].map((wing: any, wIdx: number) => (
              <div
                key={wIdx}
                className="bg-slate-900/60 rounded-3xl border border-white/5 p-6 space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-pink-500/20 bg-black/40 shrink-0 group">
                    {wing.iconUrl ? (
                      <Image
                        src={wing.iconUrl}
                        alt="icon"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pink-500/20">
                        <FaImage size={14} />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                      <FaPlus size={10} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleDivineWingFileChange(side, wIdx, e)}
                      />
                    </label>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-black text-xs uppercase">
                    {wIdx + 1}
                  </div>
                  <input
                    value={wing.name}
                    onChange={(e) =>
                      updateWing(side as any, wIdx, "name", e.target.value)
                    }
                    placeholder="Tên Cánh"
                    className="flex-1 bg-transparent border-b border-white/10 py-1 font-bold text-slate-200 outline-none focus:border-pink-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                      Kỹ năng thường
                    </span>
                    <textarea
                      value={wing.regularSkill.description}
                      onChange={(e) =>
                        updateWing(side as any, wIdx, "regularSkill", {
                          ...wing.regularSkill,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs h-24 focus:border-pink-500/30 outline-none text-slate-300"
                      placeholder="Mô tả cơ bản..."
                    />
                    <div className="space-y-2">
                      {wing.regularSkill.upgrades.map(
                        (up: string, upIdx: number) => (
                          <div key={upIdx} className="flex gap-2">
                            <span className="text-[9px] font-bold text-slate-600 pt-2 w-10">
                              Lvl {upIdx + 1}
                            </span>
                            <input
                              value={up}
                              onChange={(e) => {
                                const newUpgrades = [
                                  ...wing.regularSkill.upgrades,
                                ];
                                newUpgrades[upIdx] = e.target.value;
                                updateWing(side as any, wIdx, "regularSkill", {
                                  ...wing.regularSkill,
                                  upgrades: newUpgrades,
                                });
                              }}
                              className="flex-1 bg-black/20 border border-white/5 rounded-lg px-2 py-1 text-[11px] text-slate-400 focus:border-pink-500/50"
                              placeholder="Nâng cấp..."
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest block">
                      Kỹ năng suy biến
                    </span>
                    <textarea
                      value={wing.mutatedSkill.description}
                      onChange={(e) =>
                        updateWing(side as any, wIdx, "mutatedSkill", {
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-purple-900/10 border border-purple-500/10 rounded-xl p-3 text-xs h-full focus:border-purple-500/30 outline-none text-slate-300 min-h-[150px]"
                      placeholder="Mô tả kỹ năng suy biến..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

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
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95 h-10"
          >
            <FaSave /> {loading ? "Đang xử lý..." : "Lưu Dữ Liệu"}
          </Button>
        </header>

        {message && (
          <div
            className={`p-4 mb-8 rounded-lg font-bold border ${message.includes("Lỗi") ? "bg-red-950/30 border-red-500/50 text-red-400" : "bg-green-950/30 border-green-500/50 text-green-400"}`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col gap-10">
          {/* PHẦN TRÊN: THÔNG TIN CƠ BẢN (FULL WIDTH) */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <FaImage className="text-yellow-500" />
                <h2 className="text-lg font-bold text-slate-100">
                  Thông Tin Cơ Bản
                </h2>
              </div>

              {/* --- KHU VỰC UPLOAD ẢNH MỚI --- */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase">
                  Hình ảnh
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                    {/* Ưu tiên hiện Preview từ file, nếu không có thì hiện từ formData */}
                    {previewUrl || formData.image ? (
                      <Image
                        src={previewUrl || formData.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <FaImage size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Input chọn file */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                    />

                    {/* Thông báo khi đang lưu */}
                    {loading && selectedFile && (
                      <p className="text-[10px] text-yellow-500 animate-pulse font-bold">
                        ⏳ Đang upload ảnh và lưu dữ liệu...
                      </p>
                    )}
                  </div>
                </div>
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
                    <option value="Thần Chỉ">Thần Chỉ</option>
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
                    disabled={formData.rarity === "Thần Chỉ"}
                    className={`w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 outline-none ${formData.rarity === "Thần Chỉ" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {formData.rarity === "Thần Chỉ" ? (
                      <option value="Thần">Thần</option>
                    ) : (
                      <>
                        <option value="Cường Công">Cường Công</option>
                        <option value="Mẫn Công">Mẫn Công</option>
                        <option value="Khống Chế">Khống Chế</option>
                        <option value="Phụ Trợ">Phụ Trợ</option>
                        <option value="Phòng Ngự">Phòng Ngự</option>
                        <option value="Ám Khí">Ám Khí</option>
                      </>
                    )}
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

          {/* PHẦN DƯỚI: CÁC HỆ THỐNG CHI TIẾT (FULL WIDTH) */}
          <div className="space-y-10">
            {isDivine && (
              <>
                <Section
                  title="Hệ Thống Thần Hoàn"
                  icon={<FaDna />}
                  color="yellow"
                >
                  {renderDivineRingSystem()}
                </Section>
                <Section
                  title="Hệ Thống Pháp Tướng"
                  icon={<FaArrowUp />}
                  color="blue"
                >
                  {renderDivineAvatarSystem()}
                </Section>
                <Section
                  title="Hệ Thống Cánh"
                  icon={<FaBone />}
                  color="pink"
                >
                  {renderWingSystem()}
                </Section>
              </>
            )}

            {!isDivine && (
              isAmKhi ? (
                <Section
                  title="Mốc Sức Mạnh Nâng Sao"
                  icon={<FaStar />}
                  color="red"
                >
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
                </Section>
              ) : (
                <Section
                  title="Chi Tiết Kỹ Năng Hồn Hoàn"
                  color="slate"
                  action={
                    <label className="flex items-center gap-3 cursor-pointer bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg hover:border-blue-500 transition">
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        Kích hoạt Nhánh 2
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
                  }
                >
                  <div
                    className={`grid gap-8 ${hasBranch2 ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}
                  >
                    {/* Cột Nhánh 1 */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-blue-400 border-b border-blue-500/30 pb-2 mb-4">
                        NHÁNH 1
                      </h3>
                      {formData.skillDetails.map((skill: any, idx: number) => {
                        if (idx >= 4) return null;
                        return renderSkillCard(skill, idx);
                      })}
                    </div>

                    {/* Cột Nhánh 2 */}
                    {hasBranch2 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-purple-400 border-b border-purple-500/30 pb-2 mb-4">
                          NHÁNH 2
                        </h3>
                        {formData.skillDetails.map((skill: any, idx: number) => {
                          if (idx < 4) return null;
                          return renderSkillCard(skill, idx);
                        })}
                      </div>
                    )}
                  </div>
                </Section>
              )
            )}

            <Section title="Hệ Thống Hồn Cốt" color="yellow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.soulBones.map((bone: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-xl transition-all hover:border-slate-700"
                  >
                    <div className="flex justify-between items-center">
                      <span className="bg-blue-900/30 text-blue-400 px-3 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                        {bone.position}
                      </span>
                      <div className="relative w-8 h-8 rounded overflow-hidden border border-slate-700 bg-slate-950 shrink-0 group">
                        {bone.iconUrl ? (
                          <Image
                            src={bone.iconUrl}
                            alt="icon"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <FaImage size={10} />
                          </div>
                        )}
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                          <FaImage size={10} className="text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleBoneFileChange(idx, e)}
                          />
                        </label>
                      </div>
                      <select
                        value={bone._extraType}
                        onChange={(e) =>
                          updateSoulBone(idx, "_extraType", e.target.value)
                        }
                        className="text-[10px] bg-slate-800 text-slate-300 p-1.5 rounded outline-none cursor-pointer font-bold border border-slate-700"
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
                      className="w-full bg-transparent border-b border-slate-800 text-base font-bold text-slate-100 outline-none focus:border-blue-500 transition"
                    />

                    <textarea
                      value={bone.standard.base}
                      onChange={(e) =>
                        updateSoulBoneStandard(idx, "base", e.target.value)
                      }
                      placeholder="Hiệu quả cơ bản..."
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-sm min-h-[80px] outline-none focus:border-yellow-500 transition resize-y"
                    />

                    <div className="grid grid-cols-1 gap-2">
                      <textarea
                        value={bone.standard.star4}
                        onChange={(e) =>
                          updateSoulBoneStandard(idx, "star4", e.target.value)
                        }
                        placeholder="4 Sao Vàng..."
                        className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-yellow-500 outline-none focus:border-yellow-600 min-h-[60px] resize-y"
                      />
                      <textarea
                        value={bone.standard.star6}
                        onChange={(e) =>
                          updateSoulBoneStandard(idx, "star6", e.target.value)
                        }
                        placeholder="6 Sao Vàng..."
                        className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-yellow-600 outline-none focus:border-yellow-700 min-h-[60px] resize-y"
                      />
                    </div>

                    {/* SUY BIẾN */}
                    {bone._extraType === "mutation" && (
                      <div className="space-y-2.5 pt-3 border-t border-red-900/30 bg-red-950/10 p-2.5 rounded-lg animate-fadeIn">
                        <div className="flex items-center gap-1 text-[10px] text-red-400 font-black mb-1">
                          <FaDna /> SUY BIẾN
                        </div>
                        <input
                          value={bone.mutation.name}
                          onChange={(e) =>
                            updateSoulBoneMutation(idx, "name", e.target.value)
                          }
                          placeholder="Tên Hồn Cốt Suy Biến..."
                          className="w-full bg-slate-950 border border-red-900/30 rounded p-2 text-sm text-red-200 outline-none focus:border-red-500"
                        />
                        <div className="grid grid-cols-1 gap-2">
                          <textarea
                            value={bone.mutation.star1Red}
                            onChange={(e) =>
                              updateSoulBoneMutation(
                                idx,
                                "star1Red",
                                e.target.value,
                              )
                            }
                            placeholder="1 Sao Đỏ..."
                            className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                          />
                          <textarea
                            value={bone.mutation.star4Red}
                            onChange={(e) =>
                              updateSoulBoneMutation(
                                idx,
                                "star4Red",
                                e.target.value,
                              )
                            }
                            placeholder="4 Sao Đỏ..."
                            className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                          />
                          <textarea
                            value={bone.mutation.star5Red}
                            onChange={(e) =>
                              updateSoulBoneMutation(
                                idx,
                                "star5Red",
                                e.target.value,
                              )
                            }
                            placeholder="5 Sao Đỏ..."
                            className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                          />
                          <textarea
                            value={bone.mutation.star6Red}
                            onChange={(e) =>
                              updateSoulBoneMutation(
                                idx,
                                "star6Red",
                                e.target.value,
                              )
                            }
                            placeholder="6 Sao Đỏ..."
                            className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                          />
                        </div>
                      </div>
                    )}

                    {/* NÂNG CẤP */}
                    {bone._extraType === "upgrade" && (
                      <div className="space-y-2.5 pt-3 border-t border-yellow-900/30 bg-yellow-950/10 p-2.5 rounded-lg animate-fadeIn">
                        <div className="flex items-center gap-1 text-[10px] text-yellow-400 font-black mb-1">
                          <FaArrowUp /> NÂNG CẤP
                        </div>
                        <input
                          value={bone.upgrade.name}
                          onChange={(e) =>
                            updateSoulBoneUpgrade(idx, "name", e.target.value)
                          }
                          placeholder="Tên sau Nâng Cấp..."
                          className="w-full bg-slate-950 border border-yellow-900/30 rounded p-2 text-sm text-yellow-200 outline-none focus:border-yellow-500"
                        />
                        <div className="grid grid-cols-1 gap-2">
                          <textarea
                            value={bone.upgrade.star2}
                            onChange={(e) =>
                              updateSoulBoneUpgrade(
                                idx,
                                "star2",
                                e.target.value,
                              )
                            }
                            placeholder="2 Sao..."
                            className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                          />
                          <textarea
                            value={bone.upgrade.star3}
                            onChange={(e) =>
                              updateSoulBoneUpgrade(
                                idx,
                                "star3",
                                e.target.value,
                              )
                            }
                            placeholder="3 Sao..."
                            className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                          />
                          <textarea
                            value={bone.upgrade.star5}
                            onChange={(e) =>
                              updateSoulBoneUpgrade(
                                idx,
                                "star5",
                                e.target.value,
                              )
                            }
                            placeholder="5 Sao..."
                            className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
