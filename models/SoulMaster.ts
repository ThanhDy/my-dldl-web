import mongoose, { Schema, Document, Model } from "mongoose";

// --- 1. Sub-Schemas (Các thành phần con) ---

// Build Schema
const BuildSchema = new Schema(
  {
    title: { type: String, default: "" },
  },
  { _id: false },
);

// Skill Year Effect Schema
const SkillYearEffectSchema = new Schema(
  {
    y1k: String,
    y10k: String,
    y25k: String,
    y50k: String,
    y100k: String,
  },
  { _id: false },
);

// Skill Detail Schema
const SkillDetailSchema = new Schema(
  {
    id: { type: String }, // {heroId}-s1-1
    name: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Chủ động", "Bị động", "Công thường"],
      default: "",
    },
    soulRingType: { type: String, default: "" }, // Ma Nhện / Giáp Thuẫn...
    description: { type: String, default: "" },
    yearEffects: { type: SkillYearEffectSchema, default: {} },
    note: [String],
    iconUrl: String,
  },
  { _id: false },
);

// Soul Bone Schema
const SoulBoneSchema = new Schema(
  {
    position: {
      type: String,
      enum: ["Đầu", "Thân", "Tay Trái", "Tay Phải", "Chân Trái", "Chân Phải"],
      required: true,
    },
    name: { type: String, default: "" },
    iconUrl: String,
    // Cốt thường
    standard: {
      base: String,
      star4: String,
      star6: String,
    },
    // Suy biến (Optional)
    mutation: {
      name: String,
      iconUrl: String,
      star1Red: String,
      star4Red: String,
      star5Red: String,
      star6Red: String,
    },
    // Nâng cấp (Optional)
    upgrade: {
      name: String,
      iconUrl: String,
      star2: String,
      star3: String,
      star5: String,
    },
  },
  { _id: false },
);

// Star Upgrade Schema
const StarUpgradeSchema = new Schema(
  {
    star: Number,
    isRedStar: { type: Boolean, default: false },
    description: String,
  },
  { _id: false },
);

// --- NVV Card System Sub-Schemas ---

// Nvv Card Schema
const NvvCardSchema = new Schema(
  {
    id: String,
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "Thông Dụng",
        "Cửu Thải Lưu Ly · Tốc",
        "Lưu Ly Tâm Nguyên",
        "Cửu Thải Lưu Ly · Dụ",
        "Cửu Thải Lưu Ly · Diệu",
      ],
      required: true,
    },
    image: { type: String, required: true },
    shortDescription: String,
    basicSkill: String,
    detailedEffect: {
      condition: String,
      effect: String,
      quest: {
        description: String,
        buff: String,
      },
    },
    upgradeEffects: [
      {
        condition: String,
        effect: String,
      },
    ],
  },
  { _id: false },
);

// --- Divine System Sub-Schemas (Thần Chỉ) ---

const DivineRingYearEffectSchema = new Schema({
  y50k: String,
  y100k: String,
  y500k: String,
  y1000k: String,
  y1000kBuffs: [String], // Array for +1 to +9 buffs at 1000k
}, { _id: false });

const DivineRingSkillSchema = new Schema({
  name: String,
  description: String,
  iconUrl: { type: String, default: "" },
  yearEffects: { type: DivineRingYearEffectSchema, default: {} },
}, { _id: false });

const DivineGodSkillSchema = new Schema({
  name: String,
  description: String,
  iconUrl: { type: String, default: "" },
  notes: [String],
  rings: [DivineRingSkillSchema], // 3 rings per God Skill
}, { _id: false });

const DivineAvatarLevelSchema = new Schema({
  level: { type: Number, required: true },
  name: { type: String, default: "" },
  skill: { type: String, default: "" },
  iconUrl: { type: String, default: "" },
}, { _id: false });

const WingRegularSkillSchema = new Schema({
  description: String,
  upgrades: [String], // 3 levels
}, { _id: false });

const WingSchema = new Schema({
  name: { type: String, required: true }, // Wing 1, 2, 3, 4
  iconUrl: { type: String, default: "" },
  regularSkill: { type: WingRegularSkillSchema, default: {} },
  mutatedSkill: {
    description: { type: String, default: "" },
  },
}, { _id: false });

const DivineSystemSchema = new Schema({
  branches: [{
    name: String, // e.g., "Nhánh 1", "Nhánh 2"
    skills: [DivineGodSkillSchema], // 5 skills per branch
  }],
  avatars: [DivineAvatarLevelSchema], // 6 levels
  wings: {
    left: [WingSchema], // 4 wings
    right: [WingSchema], // 4 wings
  },
}, { _id: false });

// --- 2. Main Schema (Hồn Sư) ---

const SoulMasterSchema = new Schema(
  {
    // Custom ID string mà bạn dùng trong file data cũ (ví dụ: "duong-tam-sp")
    id: { type: String, required: true, unique: true },

    name: { type: String, required: true }, // Tên hiển thị
    title: { type: String }, // Danh hiệu

    rarity: {
      type: String,
      enum: ["SP", "SSR", "SSR+", "SP+", "Thần Chỉ"],
      required: true,
    },

    isSpPlus: { type: Boolean, default: false }, // Cờ SP+

    type: {
      type: String,
      enum: [
        "Cường Công",
        "Mẫn Công",
        "Khống Chế",
        "Phụ Trợ",
        "Phòng Ngự",
        "Ám Khí",
        "Thần",
      ],
      required: true,
    },

    image: { type: String }, // Ảnh đại diện lớn

    // Arrays of Sub-Schemas
    builds: [BuildSchema],
    skillDetails: [SkillDetailSchema],
    soulBones: [SoulBoneSchema],
    starUpgrades: [StarUpgradeSchema],

    // Hệ thống riêng cho Ninh Vinh Vinh SP+ (Optional)
    nvvCardSystem: {
      cards: [NvvCardSchema],
    },

    // Hệ thống cho Hồn Sư Thần Chỉ (Optional)
    divineSystem: { type: DivineSystemSchema },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  },
);

// --- 3. Export Model ---

// Trong môi trường development, ta xóa model cũ để Mongoose register lại với Schema mới nhất
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.SoulMaster;
}

const SoulMaster =
  mongoose.models.SoulMaster || mongoose.model("SoulMaster", SoulMasterSchema);

export default SoulMaster;
