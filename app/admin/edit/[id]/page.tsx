"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaDna,
  FaStar,
  FaLightbulb,
  FaChevronDown,
  FaBone,
} from "react-icons/fa";
import BackToTop from "@/app/components/BackToTop";
import { Button } from "@/components/ui/button";

// --- CÁC HÀM KHỞI TẠO MẪU ---
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
  position,
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
  starUpgrades: [],
  amKhiNote: "",
  thienPhu: [],
  divineSystem: {
    branches: [
      { name: "Nhánh 1", skills: Array(5).fill(null).map(() => ({
        name: "", description: "", notes: [], rings: Array(3).fill(null).map(() => ({
          name: "", description: "", yearEffects: { y50k: "", y100k: "", y500k: "", y1000k: "", y1000kBuffs: Array(9).fill("") }
        }))
      })) },
      { name: "Nhánh 2", skills: Array(5).fill(null).map(() => ({
        name: "", description: "", notes: [], rings: Array(3).fill(null).map(() => ({
          name: "", description: "", yearEffects: { y50k: "", y100k: "", y500k: "", y1000k: "", y1000kBuffs: Array(9).fill("") }
        }))
      })) }
    ],
    avatars: Array(6).fill(null).map((_, i) => ({ level: i + 1, name: "", skill: "", iconUrl: "" })),
    wings: {
      left: Array(4).fill(null).map((_, i) => ({ name: `Cánh ${i + 1}`, iconUrl: "", regularSkill: { description: "", upgrades: ["", "", ""] }, mutatedSkill: { description: "" } })),
      right: Array(4).fill(null).map((_, i) => ({ name: `Cánh ${i + 1}`, iconUrl: "", regularSkill: { description: "", upgrades: ["", "", ""] }, mutatedSkill: { description: "" } }))
    }
  }
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

export default function EditHeroPage() {
  const [hasBranch2, setHasBranch2] = useState(true);
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [skillFiles, setSkillFiles] = useState<{ [key: number]: File }>({});
  const [skillPreviews, setSkillPreviews] = useState<{ [key: number]: string }>(
    {},
  );
  const [boneFiles, setBoneFiles] = useState<{ [key: number]: File }>({});
  const [bonePreviews, setBonePreviews] = useState<{ [key: number]: string }>(
    {},
  );
  const [cardFiles, setCardFiles] = useState<{ [key: number]: File }>({});
  const [cardPreviews, setCardPreviews] = useState<Record<number, string>>({});

  // Divine System Files
  const [divineSkillFiles, setDivineSkillFiles] = useState<Record<string, File>>({});
  const [divineSkillPreviews, setDivineSkillPreviews] = useState<Record<string, string>>({});
  const [divineRingFiles, setDivineRingFiles] = useState<Record<string, File>>({});
  const [divineRingPreviews, setDivineRingPreviews] = useState<Record<string, string>>({});
  const [divineAvatarFiles, setDivineAvatarFiles] = useState<Record<number, File>>({});
  const [divineAvatarPreviews, setDivineAvatarPreviews] = useState<Record<number, string>>({});
  const [divineWingFiles, setDivineWingFiles] = useState<Record<string, File>>({});
  const [divineWingPreviews, setDivineWingPreviews] = useState<Record<string, string>>({});



  // --- LOGIC LOAD DỮ LIỆU & MERGE ---
  useEffect(() => {
    const fetchHeroData = async () => {
      setMessage("");
      try {
        const heroId = params.id as string;
        if (!heroId) return;
        const res = await fetch(`/api/soul-masters/${heroId}`);
        if (!res.ok)
          return setMessage(`❌ Không tìm thấy dữ liệu cho ID: "${heroId}"`);

        const json = await res.json();
        const foundHero = json.data;

        const hasDataInBranch2 = foundHero.skillDetails?.length > 4;
        // Nếu là SP+ thì mặc định tắt nhánh 2, trừ khi trong DB đã lỡ lưu data nhánh 2 rồi
        if (foundHero.rarity === "SP+" && !hasDataInBranch2) {
          setHasBranch2(false);
        } else {
          setHasBranch2(hasDataInBranch2); // Tự động bật nếu có dữ liệu cũ
        }

        // Merge Skills
        const mergedSkills = INITIAL_SKILLS.map((emptySkill, index) => {
          const existingSkill = foundHero.skillDetails?.[index];
          return existingSkill
            ? {
                ...emptySkill,
                ...existingSkill,
                yearEffects: {
                  ...emptySkill.yearEffects,
                  ...(existingSkill.yearEffects || {}),
                },
              }
            : emptySkill;
        });

        // Merge Bones
        const mergedBones = INITIAL_SOUL_BONES.map((emptyBone) => {
          const existingBone = foundHero.soulBones?.find(
            (b: any) => b.position === emptyBone.position,
          );
          if (existingBone) {
            let extraType = "none";
            if (existingBone.mutation?.name) extraType = "mutation";
            if (existingBone.upgrade?.name) extraType = "upgrade";
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

        // Merge Divine System
        const mergedDivine = {
          ...INITIAL_HERO.divineSystem,
          ...(foundHero.divineSystem || {}),
          branches: INITIAL_HERO.divineSystem.branches.map((b: any, bIdx: number) => {
            const existingB = foundHero.divineSystem?.branches?.[bIdx];
            return existingB
              ? {
                  ...b,
                  ...existingB,
                  skills: b.skills.map((s: any, sIdx: number) => {
                    const existingS = existingB.skills?.[sIdx];
                    return existingS
                      ? {
                          ...s,
                          ...existingS,
                          rings: s.rings.map((r: any, rIdx: number) => {
                            const existingR = existingS.rings?.[rIdx];
                            return existingR
                              ? {
                                  ...r,
                                  ...existingR,
                                  yearEffects: {
                                    ...r.yearEffects,
                                    ...(existingR.yearEffects || {}),
                                  },
                                }
                              : r;
                          }),
                        }
                      : s;
                  }),
                }
              : b;
          }),
          avatars: INITIAL_HERO.divineSystem.avatars.map(
            (a: any, aIdx: number) => {
              const existingA = foundHero.divineSystem?.avatars?.[aIdx];
              return existingA ? { ...a, ...existingA } : a;
            },
          ),
          wings: {
            left: INITIAL_HERO.divineSystem.wings.left.map(
              (w: any, wIdx: number) => {
                const existingW = foundHero.divineSystem?.wings?.left?.[wIdx];
                return existingW ? { ...w, ...existingW } : w;
              },
            ),
            right: INITIAL_HERO.divineSystem.wings.right.map(
              (w: any, wIdx: number) => {
                const existingW = foundHero.divineSystem?.wings?.right?.[wIdx];
                return existingW ? { ...w, ...existingW } : w;
              },
            ),
          },
        };

        setFormData({
          ...foundHero,
          skillDetails: mergedSkills,
          soulBones: mergedBones,
          nvvCardSystem: foundHero.nvvCardSystem || { cards: [] },
          starUpgrades: foundHero.starUpgrades || [],
          amKhiNote: foundHero.amKhiNote || "",
          thienPhu: foundHero.thienPhu || [],
          divineSystem: mergedDivine,
        });
      } catch (error) {
        setMessage("❌ Lỗi kết nối API!");
      }
    };
    fetchHeroData();
  }, [params.id]);

  // Tự động ẩn thông báo (Toast effect)
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Tự động chuyển hệ thành "Thần" nếu là rarity "Thần Chỉ"
  useEffect(() => {
    if (formData?.rarity === "Thần Chỉ") {
      if (formData.type !== "Thần") {
        setFormData((prev: any) => ({ ...prev, type: "Thần" }));
      }
    } else if (formData?.type === "Thần") {
      setFormData((prev: any) => ({ ...prev, type: "Cường Công" }));
    }
  }, [formData?.rarity]);

  // --- CÁC HÀM XỬ LÝ NHẬP LIỆU ---
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const updateBuild = (index: number, value: string) => {
    const newBuilds = [...formData.builds];
    newBuilds[index] = { ...newBuilds[index], title: value };
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

  const updateSoulBone = (index: number, field: string, value: any) => {
    const newBones = [...formData.soulBones];
    newBones[index][field] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

  const updateSoulBoneSub = (
    index: number,
    type: "standard" | "mutation" | "upgrade",
    key: string,
    value: string,
  ) => {
    const newBones = [...formData.soulBones];
    if (!newBones[index][type]) newBones[index][type] = {};
    newBones[index][type][key] = value;
    setFormData({ ...formData, soulBones: newBones });
  };

  // --- LOGIC THẺ BÀI ---
  const addNvvCard = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      name: "",
      type: "Thông Dụng",
      image: "",
      shortDescription: "",
      basicSkill: "",
      detailedEffect: {
        condition: "Yêu cầu Thần lực cơ bản: 1000",
        effect: "",
      },
      upgradeEffects: [],
    };
    setFormData({
      ...formData,
      nvvCardSystem: {
        cards: [newCard, ...(formData.nvvCardSystem?.cards || [])],
      },
    });
  };

  const updateNvvCard = (index: number, field: string, value: any) => {
    const newCards = [...formData.nvvCardSystem.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setFormData({ ...formData, nvvCardSystem: { cards: newCards } });
  };

  const updateNvvCardDetail = (index: number, field: string, value: any) => {
    const newCards = [...formData.nvvCardSystem.cards];
    if (!newCards[index].detailedEffect) newCards[index].detailedEffect = {};
    newCards[index].detailedEffect[field] = value;
    setFormData({ ...formData, nvvCardSystem: { cards: newCards } });
  };

  const updateNvvCardQuest = (index: number, field: string, value: any) => {
    const newCards = [...formData.nvvCardSystem.cards];
    if (!newCards[index].detailedEffect.quest) {
      newCards[index].detailedEffect.quest = { description: "", buff: "" };
    }
    newCards[index].detailedEffect.quest[field] = value;
    setFormData({ ...formData, nvvCardSystem: { cards: newCards } });
  };

  const toggleNvvCardMode = (index: number, mode: "effect" | "quest") => {
    const newCards = [...formData.nvvCardSystem.cards];
    if (!newCards[index].detailedEffect)
      newCards[index].detailedEffect = {
        condition: "Yêu cầu Thần lực cơ bản: 1000",
      };

    if (mode === "effect") {
      newCards[index].detailedEffect.effect =
        newCards[index].detailedEffect.effect || "";
      delete newCards[index].detailedEffect.quest;
    } else {
      newCards[index].detailedEffect.quest = newCards[index].detailedEffect
        .quest || {
        description: "",
        buff: "",
      };
      delete newCards[index].detailedEffect.effect;
    }
    setFormData({ ...formData, nvvCardSystem: { cards: newCards } });
  };

  const addNvvCardUpgradeEffect = (cardIndex: number) => {
    const newCards = [...formData.nvvCardSystem.cards];
    const currentEffects = newCards[cardIndex].upgradeEffects || [];
    newCards[cardIndex].upgradeEffects = [
      ...currentEffects,
      { condition: "", effect: "" },
    ];
    setFormData({
      ...formData,
      nvvCardSystem: { cards: newCards },
    });
  };

  const removeNvvCardUpgradeEffect = (
    cardIndex: number,
    effectIndex: number,
  ) => {
    const newCards = [...formData.nvvCardSystem.cards];
    if (newCards[cardIndex].upgradeEffects) {
      newCards[cardIndex].upgradeEffects = newCards[
        cardIndex
      ].upgradeEffects.filter((_: any, i: number) => i !== effectIndex);
      setFormData({
        ...formData,
        nvvCardSystem: { cards: newCards },
      });
    }
  };

  const updateNvvCardUpgradeEffect = (
    cardIndex: number,
    effectIndex: number,
    field: string,
    value: any,
  ) => {
    const newCards = [...formData.nvvCardSystem.cards];
    const newEffects = [...(newCards[cardIndex].upgradeEffects || [])];
    newEffects[effectIndex] = { ...newEffects[effectIndex], [field]: value };
    newCards[cardIndex].upgradeEffects = newEffects;
    setFormData({ ...formData, nvvCardSystem: { cards: newCards } });
  };

  const removeNvvCard = (index: number) => {
    const newCards = formData.nvvCardSystem.cards.filter(
      (_: any, i: number) => i !== index,
    );
    setFormData({ ...formData, nvvCardSystem: { cards: newCards } });
  };

  // --- LOGIC ÁM KHÍ  ---
  const addStarUpgrade = () => {
    const newStar = { star: 4, isRedStar: false, description: "" };
    setFormData({
      ...formData,
      starUpgrades: [...formData.starUpgrades, newStar],
    });
  };

  const updateStarUpgrade = (index: number, field: string, value: any) => {
    const newStars = [...formData.starUpgrades];
    newStars[index][field] = value;
    setFormData({ ...formData, starUpgrades: newStars });
  };

  const addThienPhu = () => {
    setFormData({
      ...formData,
      thienPhu: [
        ...formData.thienPhu,
        { name: "", description: "", label: "0/0" },
      ],
    });
  };

  const updateThienPhu = (index: number, field: string, value: any) => {
    const newThienPhu = [...formData.thienPhu];
    newThienPhu[index][field] = value;
    setFormData({ ...formData, thienPhu: newThienPhu });
  };

  const removeThienPhu = (index: number) => {
    const newThienPhu = formData.thienPhu.filter(
      (_: any, i: number) => i !== index,
    );
    setFormData({ ...formData, thienPhu: newThienPhu });
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

  const handleSkillFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSkillFiles((prev) => ({ ...prev, [index]: file }));
    setSkillPreviews((prev) => ({
      ...prev,
      [index]: URL.createObjectURL(file),
    }));
  };

  const handleBoneFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBoneFiles((prev) => ({ ...prev, [index]: file }));
    setBonePreviews((prev) => ({
      ...prev,
      [index]: URL.createObjectURL(file),
    }));
  };

  const handleCardFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCardFiles((prev) => ({ ...prev, [index]: file }));
    setCardPreviews((prev) => ({
      ...prev,
      [index]: URL.createObjectURL(file),
    }));
  };

  const handleDivineSkillFileChange = (bIdx: number, sIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `${bIdx}-${sIdx}`;
    setDivineSkillFiles(prev => ({ ...prev, [key]: file }));
    setDivineSkillPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleDivineRingFileChange = (bIdx: number, sIdx: number, rIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `${bIdx}-${sIdx}-${rIdx}`;
    setDivineRingFiles(prev => ({ ...prev, [key]: file }));
    setDivineRingPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleDivineAvatarFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDivineAvatarFiles(prev => ({ ...prev, [idx]: file }));
    setDivineAvatarPreviews(prev => ({ ...prev, [idx]: URL.createObjectURL(file) }));
  };

  const handleDivineWingFileChange = (side: string, idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `${side}-${idx}`;
    setDivineWingFiles(prev => ({ ...prev, [key]: file }));
    setDivineWingPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  // 2. HÀM CHỌN ẢNH (CHỈ PREVIEW, KHÔNG UPLOAD)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // 3. HÀM UPLOAD THỰC SỰ (SẼ GỌI KHI BẤM LƯU)
  const uploadToCloudinary = async (file: File, folderName: string) => {
    const dataForm = new FormData();
    dataForm.append("file", file);

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
          {skillPreviews[idx] || skill.iconUrl ? (
            <Image
              src={skillPreviews[idx] || skill.iconUrl}
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
                      {divineSkillPreviews[`${bIdx}-${sIdx}`] || skill.iconUrl ? (
                        <Image
                          src={divineSkillPreviews[`${bIdx}-${sIdx}`] || skill.iconUrl}
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
                          {divineRingPreviews[`${bIdx}-${sIdx}-${rIdx}`] || ring.iconUrl ? (
                            <Image
                              src={divineRingPreviews[`${bIdx}-${sIdx}-${rIdx}`] || ring.iconUrl}
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
              {divineAvatarPreviews[idx] || av.iconUrl ? (
                <Image
                  src={divineAvatarPreviews[idx] || av.iconUrl}
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
                    {divineWingPreviews[`${side}-${wIdx}`] || wing.iconUrl ? (
                      <Image
                        src={divineWingPreviews[`${side}-${wIdx}`] || wing.iconUrl}
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

  const deleteCloudinaryImage = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) return;

    // Regex lấy public_id: khớp đoạn sau /upload/ (có thể có v1234/) đến trước dấu chấm đuôi file
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/;
    const match = imageUrl.match(regex);
    if (match && match[1]) {
      await fetch("/api/cloudinary/delete", {
        method: "POST",
        body: JSON.stringify({ public_id: match[1] }),
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const folderName = formData.id || "hon-su-khac";
    try {
      let finalImageUrl = formData.image;
      if (selectedFile) {
        try {
          // 1. Upload ảnh mới
          const newUrl = await uploadToCloudinary(selectedFile, folderName);

          // 2. Nếu upload thành công -> Xóa ảnh cũ (nếu có)
          if (newUrl) {
            await deleteCloudinaryImage(formData.image);
            finalImageUrl = newUrl;
          }
        } catch (uploadError) {
          throw new Error("Lỗi khi upload ảnh lên Cloudinary!");
        }
      }

      // Upload Skills
      const uploadedSkills = await Promise.all(
        formData.skillDetails.map(async (skill: any, index: number) => {
          if (skillFiles[index]) {
            if (skill.iconUrl) await deleteCloudinaryImage(skill.iconUrl);
            const url = await uploadToCloudinary(skillFiles[index], folderName);
            return { ...skill, iconUrl: url };
          }
          return skill;
        }),
      );

      // Upload Bones
      const uploadedBones = await Promise.all(
        formData.soulBones.map(async (bone: any, index: number) => {
          if (boneFiles[index]) {
            if (bone.iconUrl) await deleteCloudinaryImage(bone.iconUrl);
            const url = await uploadToCloudinary(boneFiles[index], folderName);
            return { ...bone, iconUrl: url };
          }
          return bone;
        }),
      );

      // Upload Cards
      let uploadedCards = formData.nvvCardSystem?.cards || [];
      if (cardFiles && Object.keys(cardFiles).length > 0) {
        uploadedCards = await Promise.all(
          formData.nvvCardSystem?.cards?.map(async (card: any, index: number) => {
            if (cardFiles[index]) {
              try {
                const url = await uploadToCloudinary(cardFiles[index], folderName);
                if (card.image) await deleteCloudinaryImage(card.image);
                return { ...card, image: url };
              } catch (err) {
                return card;
              }
            }
            return card;
          }) || [],
        );
      }

      // Upload Divine System
      let updatedDivineSystem = { ...formData.divineSystem };
      if (updatedDivineSystem.branches) {
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
                      folderName,
                    );
                    if (skill.iconUrl) await deleteCloudinaryImage(skill.iconUrl);
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
                            folderName,
                          );
                          if (ring.iconUrl)
                            await deleteCloudinaryImage(ring.iconUrl);
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
      if (updatedDivineSystem.avatars) {
        updatedDivineSystem.avatars = await Promise.all(
          updatedDivineSystem.avatars.map(async (av: any, idx: number) => {
            if (divineAvatarFiles[idx]) {
              try {
                const url = await uploadToCloudinary(divineAvatarFiles[idx], folderName);
                if (av.iconUrl) await deleteCloudinaryImage(av.iconUrl);
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
      if (updatedDivineSystem.wings) {
        const sides: ("left" | "right")[] = ["left", "right"];
        for (const side of sides) {
          if (updatedDivineSystem.wings[side]) {
            updatedDivineSystem.wings[side] = await Promise.all(
              updatedDivineSystem.wings[side].map(async (wing: any, idx: number) => {
                const wingKey = `${side}-${idx}`;
                if (divineWingFiles[wingKey]) {
                  try {
                    const url = await uploadToCloudinary(divineWingFiles[wingKey], folderName);
                    if (wing.iconUrl) await deleteCloudinaryImage(wing.iconUrl);
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
        nvvCardSystem: { ...formData.nvvCardSystem, cards: uploadedCards },
        divineSystem: updatedDivineSystem,
      };

      // 1. Tự động sinh ID cho skill nếu bị thiếu
      cleanData.skillDetails = cleanData.skillDetails.map((skill: any) => {
        // Nếu skill chưa có ID hoặc ID rỗng, hãy tạo mới theo chuẩn
        if (!skill.id) {
          return {
            ...skill,
            id: `${cleanData.id}-s${skill._tempOrder}-${skill._tempBranch}`,
            // Tự động tạo luôn link icon nếu chưa có (Optional)
            iconUrl:
              skill.iconUrl ||
              `/images/${cleanData.id}/hh${skill._tempOrder}-${skill._tempBranch}.webp`,
          };
        }
        return skill;
      });
      if (!hasBranch2) {
        // Chỉ giữ lại 4 kỹ năng đầu tiên (Nhánh 1)
        cleanData.skillDetails = cleanData.skillDetails.slice(0, 4);
      }
      const res = await fetch(`/api/soul-masters/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Lỗi cập nhật dữ liệu");
      setMessage("✅ Cập nhật thành công!");
    } catch (err: any) {
      setMessage(`❌ Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!formData)
    return (
      <div className="p-10 text-white flex items-center justify-center">
        Đang tải dữ liệu hồn sư...
      </div>
    );

  const isVinhVinh = formData.name?.toLowerCase().includes("vinh vinh");
  const isAmKhi = formData.type === "Ám Khí";
  const isDivine = formData.rarity === "Thần Chỉ";
  const isTranTam = formData.id === "cuc-han---kiem-dao-tran-tam";
  const isSpecialNoBuild = isVinhVinh || formData.rarity === "SP+";

  return (
    <div className="min-h-full bg-slate-950 text-slate-200 p-6 md:p-8 pb-32 font-sans">
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
              <h1 className="text-2xl font-bold text-blue-400 uppercase tracking-tight">
                CHỈNH SỬA: {formData.name}
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1 tracking-widest uppercase">
                ID: {formData.id}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition active:scale-95 shadow-lg shadow-blue-900/20 h-10"
          >
            <FaSave /> {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
          </Button>
        </header>

        {message && (
          <div
            className={`fixed bottom-5 right-5 z-50 px-6 py-4 rounded-xl font-bold border shadow-2xl backdrop-blur-md animate-fadeIn ${message.includes("Lỗi") ? "bg-red-950/90 border-red-500 text-red-400" : "bg-green-950/90 border-green-500 text-green-400"}`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col gap-10">
          {/* PHẦN TRÊN: THÔNG TIN CƠ BẢN (FULL WIDTH) */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sticky top-28 space-y-4 shadow-2xl">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-slate-800 pb-2">
                <FaImage className="text-yellow-500" /> Cơ Bản
              </h2>

              {/* --- KHU VỰC UPLOAD ẢNH --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* 1. Khu vực ảnh */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Hình ảnh đại diện
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-950 shrink-0">
                      {previewUrl || formData.image ? (
                        <Image
                          src={previewUrl || formData.image}
                          alt={formData.name || "Preview"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <FaImage size={30} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="block cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-2 px-4 rounded-lg inline-flex items-center gap-2 transition uppercase">
                          <FaImage /> Chọn ảnh
                        </div>
                      </label>
                      {loading && selectedFile && (
                        <p className="text-[10px] text-yellow-500 animate-pulse font-bold">⏳ Đang xử lý...</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Khu vực Tên, Phẩm chất, Hệ, Danh hiệu */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tên Hồn Sư</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-yellow-400 font-bold outline-none focus:border-yellow-500 transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Phẩm Chất</label>
                        <select
                          name="rarity"
                          value={formData.rarity}
                          onChange={handleChange}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none"
                        >
                          <option value="SP">SP</option>
                          <option value="SP+">SP+</option>
                          <option value="SSR+">SSR+</option>
                          <option value="SSR">SSR</option>
                          <option value="Thần Chỉ">Thần Chỉ</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Hệ</label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          disabled={formData.rarity === "Thần Chỉ"}
                          className={`w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none ${formData.rarity === "Thần Chỉ" ? "opacity-50 cursor-not-allowed text-yellow-500" : ""}`}
                        >
                          {formData.rarity === "Thần Chỉ" ? (
                            <option value="Thần">Thần</option>
                          ) : (
                            <>
                              <option value="Cường Công">Cường Công</option>
                              <option value="Phụ Trợ">Phụ Trợ</option>
                              <option value="Mẫn Công">Mẫn Công</option>
                              <option value="Phòng Ngự">Phòng Ngự</option>
                              <option value="Khống Chế">Khống Chế</option>
                              <option value="Ám Khí">Ám Khí</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Danh Hiệu</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title || ""}
                        onChange={handleChange}
                        placeholder="Danh hiệu..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    {!isSpecialNoBuild && !isAmKhi && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Gợi ý Build</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={formData.builds?.[0]?.title || ""}
                            onChange={(e) => updateBuild(0, e.target.value)}
                            placeholder="PvE"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-blue-400 outline-none focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={formData.builds?.[1]?.title || ""}
                            onChange={(e) => updateBuild(1, e.target.value)}
                            placeholder="PvP"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-red-400 outline-none focus:border-red-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
              <>
                {isTranTam && (
                  <Section
                    title="Hệ Thống Thiên Phú"
                    icon={<FaLightbulb />}
                    color="blue"
                    action={
                      <button
                        type="button"
                        onClick={addThienPhu}
                        className="bg-blue-600/20 text-blue-400 border border-blue-600/50 px-4 py-1.5 rounded-md text-xs flex items-center gap-2 hover:bg-blue-600 transition shadow-lg"
                      >
                        <FaPlus /> Thêm
                      </button>
                    }
                  >
                    <div className="grid gap-4">
                      {formData.thienPhu?.map((tp: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-slate-900 p-4 rounded-xl border border-slate-800 relative group shadow-lg"
                        >
                          <button
                            type="button"
                            onClick={() => removeThienPhu(idx)}
                            className="absolute top-2 right-2 text-slate-600 hover:text-red-500 transition"
                          >
                            <FaTrash />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              value={tp.name}
                              onChange={(e) =>
                                updateThienPhu(idx, "name", e.target.value)
                              }
                              placeholder="Tên thiên phú..."
                              className="bg-slate-950 border border-slate-800 p-2 rounded text-sm font-bold text-blue-300 outline-none focus:border-blue-500"
                            />
                            <input
                              value={tp.label}
                              onChange={(e) =>
                                updateThienPhu(idx, "label", e.target.value)
                              }
                              placeholder="Cấp độ (VD: 0/19)"
                              className="bg-slate-950 border border-slate-800 p-2 rounded text-xs text-slate-500 outline-none"
                            />
                          </div>
                          <textarea
                            value={tp.description}
                            onChange={(e) =>
                              updateThienPhu(idx, "description", e.target.value)
                            }
                            placeholder="Mô tả hiệu ứng..."
                            className="w-full mt-2 bg-slate-950 border border-slate-800 p-2 rounded text-xs h-16 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
                {isAmKhi && (
                  <Section
                    title="Nâng Sao"
                    icon={<FaStar />}
                    color="red"
                    action={
                      <button
                        type="button"
                        onClick={addStarUpgrade}
                        className="bg-red-600/20 text-red-400 border border-red-600/50 px-4 py-1.5 rounded-md text-xs flex items-center gap-2 hover:bg-red-600 transition shadow-lg"
                      >
                        <FaPlus /> Thêm Mốc
                      </button>
                    }
                  >
                    <div className="space-y-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Hiệu ứng mặc định
                      </label>
                      <textarea
                        name="amKhiNote"
                        value={formData.amKhiNote}
                        onChange={handleChange}
                        placeholder="Nhập ghi chú Ám khí..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm h-20 outline-none focus:border-red-500"
                      />
                      <div className="grid gap-4">
                        {formData.starUpgrades.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex gap-4 items-start bg-slate-900 p-4 rounded-xl border border-slate-800 relative group"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  starUpgrades: formData.starUpgrades.filter(
                                    (_: any, i: number) => i !== idx,
                                  ),
                                })
                              }
                              className="absolute -top-2 -right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
                            >
                              <FaTrash />
                            </button>
                            <div className="flex flex-col gap-2 shrink-0">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={item.star}
                                  onChange={(e) =>
                                    updateStarUpgrade(
                                      idx,
                                      "star",
                                      parseInt(e.target.value),
                                    )
                                  }
                                  className={`w-16 bg-slate-950 border border-slate-800 p-1.5 rounded text-center text-sm font-bold ${item.isRedStar ? "text-red-500" : "text-yellow-500"}`}
                                />
                                <FaStar
                                  className={
                                    item.isRedStar
                                      ? "text-red-500"
                                      : "text-yellow-500"
                                  }
                                />
                              </div>
                              <label className="flex items-center gap-2 text-[10px] cursor-pointer bg-slate-800 p-1 rounded hover:bg-slate-700 transition">
                                <input
                                  type="checkbox"
                                  checked={item.isRedStar}
                                  onChange={(e) =>
                                    updateStarUpgrade(
                                      idx,
                                      "isRedStar",
                                      e.target.checked,
                                    )
                                  }
                                  className="accent-red-500"
                                />
                                <span
                                  className={
                                    item.isRedStar
                                      ? "text-red-400 font-bold"
                                      : "text-slate-400"
                                  }
                                >
                                  Sao Đỏ
                                </span>
                              </label>
                            </div>
                            <textarea
                              value={item.description}
                              onChange={(e) =>
                                updateStarUpgrade(
                                  idx,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Mô tả thuộc tính nâng cấp..."
                              className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded text-xs h-20 outline-none focus:border-red-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Section>
                )}

                {/* THẺ BÀI VINH VINH */}
                {isVinhVinh && (
                  <Section
                    title="Hệ Thống Thẻ Bài"
                    color="pink"
                    action={
                      <button
                        type="button"
                        onClick={addNvvCard}
                        className="bg-pink-600/20 text-pink-400 border border-pink-600/50 px-4 py-1.5 rounded-md text-xs flex items-center gap-2 hover:bg-pink-600 transition shadow-lg"
                      >
                        <FaPlus /> Thêm Thẻ
                      </button>
                    }
                  >
                    <div className="grid gap-6">
                      {formData.nvvCardSystem.cards.map(
                        (card: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative group shadow-lg hover:border-pink-500/30 transition"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                              <div className="space-y-4">
                                <input
                                  value={card.name}
                                  onChange={(e) =>
                                    updateNvvCard(idx, "name", e.target.value)
                                  }
                                  placeholder="Tên thẻ bài..."
                                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-sm font-bold text-pink-300 outline-none focus:border-pink-500"
                                />
                                <select
                                  value={card.type}
                                  onChange={(e) =>
                                    updateNvvCard(idx, "type", e.target.value)
                                  }
                                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-sm text-slate-300"
                                >
                                  <option value="Thông Dụng">Thông Dụng</option>
                                  <option value="Cửu Thải Lưu Ly · Tốc">
                                    Cửu Thải Lưu Ly · Tốc
                                  </option>
                                  <option value="Lưu Ly Tâm Nguyên">
                                    Lưu Ly Tâm Nguyên
                                  </option>
                                  <option value="Cửu Thải Lưu Ly · Dụ">
                                    Cửu Thải Lưu Ly · Dụ
                                  </option>
                                  <option value="Cửu Thải Lưu Ly · Diệu">
                                    Cửu Thải Lưu Ly · Diệu
                                  </option>
                                </select>
                                <div className="flex items-center gap-4">
                                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0 group">
                                    {cardPreviews[idx] || card.image ? (
                                      <Image
                                        src={cardPreviews[idx] || card.image}
                                        alt="card"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                                        <FaImage size={24} />
                                      </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                                      <FaImage size={20} className="text-white" />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                          handleCardFileChange(idx, e)
                                        }
                                      />
                                    </label>
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <input
                                      value={card.id}
                                      onChange={(e) =>
                                        updateNvvCard(idx, "id", e.target.value)
                                      }
                                      placeholder="ID thẻ bài (tùy chọn)..."
                                      className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs text-slate-400 outline-none focus:border-pink-500"
                                    />
                                    <p className="text-[10px] text-slate-500 italic">
                                      {cardFiles[idx]
                                        ? "Đã chọn ảnh mới (sẽ upload khi Lưu)"
                                        : "Chạm vào ảnh để thay đổi"}
                                    </p>
                                  </div>
                                </div>
                                <textarea
                                  value={card.shortDescription || ""}
                                  onChange={(e) =>
                                    updateNvvCard(
                                      idx,
                                      "shortDescription",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Mô tả ngắn..."
                                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-xs h-20 outline-none focus:border-pink-500"
                                />
                              </div>
                              <div className="space-y-4">
                                <textarea
                                  value={card.basicSkill}
                                  onChange={(e) =>
                                    updateNvvCard(idx, "basicSkill", e.target.value)
                                  }
                                  placeholder="Kỹ năng cơ bản..."
                                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-xs h-16 outline-none focus:border-pink-500"
                                />

                                {/* DETAILED EFFECT */}
                                <div className="bg-slate-950/50 p-3 rounded border border-slate-800 space-y-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                                    Hiệu ứng chi tiết
                                  </label>
                                  <input
                                    value={card.detailedEffect?.condition || ""}
                                    onChange={(e) =>
                                      updateNvvCardDetail(
                                        idx,
                                        "condition",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Điều kiện kích hoạt..."
                                    className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-xs outline-none focus:border-blue-500"
                                  />

                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleNvvCardMode(idx, "effect")
                                      }
                                      className={`text-[10px] px-2 py-1 rounded border ${!card.detailedEffect?.quest ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400"}`}
                                    >
                                      Hiệu ứng
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleNvvCardMode(idx, "quest")
                                      }
                                      className={`text-[10px] px-2 py-1 rounded border ${card.detailedEffect?.quest ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400"}`}
                                    >
                                      Nhiệm vụ
                                    </button>
                                  </div>

                                  {!card.detailedEffect?.quest ? (
                                    <textarea
                                      value={card.detailedEffect?.effect || ""}
                                      onChange={(e) =>
                                        updateNvvCardDetail(
                                          idx,
                                          "effect",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Mô tả hiệu ứng..."
                                      className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-xs h-20 outline-none focus:border-blue-500"
                                    />
                                  ) : (
                                    <div className="space-y-2">
                                      <textarea
                                        value={
                                          card.detailedEffect?.quest?.description ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          updateNvvCardQuest(
                                            idx,
                                            "description",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Mô tả nhiệm vụ..."
                                        className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-xs h-14 outline-none focus:border-blue-500"
                                      />
                                      <textarea
                                        value={
                                          card.detailedEffect?.quest?.buff || ""
                                        }
                                        onChange={(e) =>
                                          updateNvvCardQuest(
                                            idx,
                                            "buff",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Buff nhận được..."
                                        className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-xs h-14 outline-none focus:border-blue-500"
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* UPGRADE EFFECTS ARRAY */}
                                <div className="bg-slate-950/50 p-3 rounded border border-slate-800">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase">
                                      Hiệu ứng nâng cấp
                                    </h4>
                                    <button
                                      type="button"
                                      onClick={() => addNvvCardUpgradeEffect(idx)}
                                      className="text-[10px] bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1"
                                    >
                                      <FaPlus size={8} /> Thêm
                                    </button>
                                  </div>

                                  <div className="space-y-3">
                                    {card.upgradeEffects?.map(
                                      (effect: any, effectIdx: number) => (
                                        <div
                                          key={effectIdx}
                                          className="flex gap-2 items-start bg-slate-900 p-2 rounded border border-slate-700 relative group"
                                        >
                                          <div className="flex-1 space-y-2">
                                            <input
                                              type="text"
                                              value={effect.condition}
                                              onChange={(e) =>
                                                updateNvvCardUpgradeEffect(
                                                  idx,
                                                  effectIdx,
                                                  "condition",
                                                  e.target.value,
                                                )
                                              }
                                              placeholder="Điều kiện nâng cấp..."
                                              className="w-full bg-transparent border-b border-slate-700 text-xs text-yellow-500 font-bold outline-none focus:border-yellow-500"
                                            />
                                            <textarea
                                              value={effect.effect}
                                              onChange={(e) =>
                                                updateNvvCardUpgradeEffect(
                                                  idx,
                                                  effectIdx,
                                                  "effect",
                                                  e.target.value,
                                                )
                                              }
                                              placeholder="Mô tả hiệu ứng..."
                                              className="w-full bg-transparent text-xs text-slate-300 outline-none h-10"
                                            />
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeNvvCardUpgradeEffect(
                                                idx,
                                                effectIdx,
                                              )
                                            }
                                            className="text-red-500 hover:text-red-400 p-1"
                                          >
                                            <FaTrash size={10} />
                                          </button>
                                        </div>
                                      ),
                                    )}
                                    {(!card.upgradeEffects ||
                                      card.upgradeEffects.length === 0) && (
                                      <p className="text-[10px] text-slate-600 italic text-center">
                                        Chưa có hiệu ứng nâng cấp
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </Section>
                )}

                {/* HỒN CỐT */}
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
                            {bonePreviews[idx] || bone.iconUrl ? (
                              <Image
                                src={bonePreviews[idx] || bone.iconUrl}
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
                            <option value="none">Mặc định</option>
                            <option value="mutation">Suy Biến</option>
                            <option value="upgrade">Nâng Cấp</option>
                          </select>
                        </div>
                        <input
                          value={bone.name}
                          onChange={(e) =>
                            updateSoulBone(idx, "name", e.target.value)
                          }
                          placeholder="Tên hồn cốt"
                          className="w-full bg-transparent border-b border-slate-800 text-base font-bold text-slate-100 outline-none focus:border-blue-500 transition"
                        />

                        <div className="space-y-2.5">
                          <textarea
                            value={bone.standard?.base}
                            onChange={(e) =>
                              updateSoulBoneSub(
                                idx,
                                "standard",
                                "base",
                                e.target.value,
                              )
                            }
                            placeholder="Hiệu quả cơ bản..."
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-sm min-h-[80px] outline-none focus:border-yellow-500 transition resize-y"
                          />
                          <div className="grid grid-cols-1 gap-2">
                            <textarea
                              value={bone.standard?.star4}
                              onChange={(e) =>
                                updateSoulBoneSub(
                                  idx,
                                  "standard",
                                  "star4",
                                  e.target.value,
                                )
                              }
                              placeholder="4 Sao Vàng..."
                              className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-yellow-500 outline-none focus:border-yellow-600 min-h-[60px] resize-y"
                            />
                            <textarea
                              value={bone.standard?.star6}
                              onChange={(e) =>
                                updateSoulBoneSub(
                                  idx,
                                  "standard",
                                  "star6",
                                  e.target.value,
                                )
                              }
                              placeholder="6 Sao Vàng..."
                              className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-yellow-600 outline-none focus:border-yellow-700 min-h-[60px] resize-y"
                            />
                          </div>
                        </div>

                        {bone._extraType === "mutation" && (
                          <div className="space-y-2.5 pt-3 border-t border-red-900/30 bg-red-950/10 p-2.5 rounded-lg animate-fadeIn">
                            <div className="flex items-center gap-1 text-[10px] text-red-400 font-black mb-1">
                              <FaDna /> SUY BIẾN
                            </div>
                            <input
                              value={bone.mutation?.name}
                              onChange={(e) =>
                                updateSoulBoneSub(
                                  idx,
                                  "mutation",
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder="Tên Hồn Cốt Suy Biến..."
                              className="w-full bg-slate-950 border border-red-900/30 rounded p-2 text-sm text-red-200 outline-none focus:border-red-500"
                            />
                            <div className="grid grid-cols-1 gap-2">
                              <textarea
                                value={bone.mutation?.star1Red}
                                onChange={(e) =>
                                  updateSoulBoneSub(
                                    idx,
                                    "mutation",
                                    "star1Red",
                                    e.target.value,
                                  )
                                }
                                placeholder="1 Sao Đỏ..."
                                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                              />
                              <textarea
                                value={bone.mutation?.star4Red}
                                onChange={(e) =>
                                  updateSoulBoneSub(
                                    idx,
                                    "mutation",
                                    "star4Red",
                                    e.target.value,
                                  )
                                }
                                placeholder="4 Sao Đỏ..."
                                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                              />
                              <textarea
                                value={bone.mutation?.star5Red}
                                onChange={(e) =>
                                  updateSoulBoneSub(
                                    idx,
                                    "mutation",
                                    "star5Red",
                                    e.target.value,
                                  )
                                }
                                placeholder="5 Sao Đỏ..."
                                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                              />
                              <textarea
                                value={bone.mutation?.star6Red}
                                onChange={(e) =>
                                  updateSoulBoneSub(
                                    idx,
                                    "mutation",
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

                        {bone._extraType === "upgrade" && (
                          <div className="space-y-2.5 pt-3 border-t border-yellow-900/30 bg-yellow-950/10 p-2.5 rounded-lg animate-fadeIn">
                            <div className="flex items-center gap-1 text-[10px] text-yellow-400 font-black mb-1">
                              <FaArrowUp /> NÂNG CẤP
                            </div>
                            <input
                              value={bone.upgrade?.name}
                              onChange={(e) =>
                                updateSoulBoneSub(
                                  idx,
                                  "upgrade",
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder="Tên sau Nâng Cấp..."
                              className="w-full bg-slate-950 border border-yellow-900/30 rounded p-2 text-sm text-yellow-200 outline-none focus:border-yellow-500"
                            />
                            <div className="grid grid-cols-1 gap-2">
                              <textarea
                                value={bone.upgrade?.star2}
                                onChange={(e) =>
                                  updateSoulBoneSub(
                                    idx,
                                    "upgrade",
                                    "star2",
                                    e.target.value,
                                  )
                                }
                                placeholder="2 Sao..."
                                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                              />
                              <textarea
                                value={bone.upgrade?.star3}
                                onChange={(e) =>
                                  updateSoulBoneSub(
                                    idx,
                                    "upgrade",
                                    "star3",
                                    e.target.value,
                                  )
                                }
                                placeholder="3 Sao..."
                                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-300 min-h-[60px] resize-y"
                              />
                              <textarea
                                value={bone.upgrade?.star5}
                                onChange={(e) =>
                                  updateSoulBoneSub(
                                    idx,
                                    "upgrade",
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

                {/* KỸ NĂNG */}
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
              </>
            )}
          </div>
        </div>
      </div>

      <BackToTop />
    </div>
  );
}
