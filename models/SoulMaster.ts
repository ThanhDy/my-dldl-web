import mongoose, { Schema, Document, Model } from "mongoose";

// --- 1. Sub-Schemas (Các thành phần con) ---

// Build Schema
const BuildSchema = new Schema(
  {
    title: { type: String, required: true },
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
    id: { type: String, required: true }, // {heroId}-s1-1
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Chủ động", "Bị động", "Công thường"],
      required: true,
    },
    soulRingType: { type: String, required: true }, // Ma Nhện / Giáp Thuẫn...
    description: { type: String, required: true },
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
    name: { type: String, required: true },
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
    upgradeEffect: {
      condition: String,
      effect: String,
    },
  },
  { _id: false },
);

// --- 2. Main Schema (Hồn Sư) ---

const SoulMasterSchema = new Schema(
  {
    // Custom ID string mà bạn dùng trong file data cũ (ví dụ: "duong-tam-sp")
    id: { type: String, required: true, unique: true },

    name: { type: String, required: true }, // Tên hiển thị
    title: { type: String, required: true }, // Danh hiệu

    rarity: {
      type: String,
      enum: ["SP", "SSR", "SSR+", "SP+"],
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
      ],
      required: true,
    },

    image: { type: String, required: true }, // Ảnh đại diện lớn

    // Arrays of Sub-Schemas
    builds: [BuildSchema],
    skillDetails: [SkillDetailSchema],
    soulBones: [SoulBoneSchema],
    starUpgrades: [StarUpgradeSchema],

    // Hệ thống riêng cho Ninh Vinh Vinh SP+ (Optional)
    nvvCardSystem: {
      cards: [NvvCardSchema],
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  },
);

// --- 3. Export Model ---

// Kiểm tra xem Model đã tồn tại chưa để tránh lỗi OverwriteModelError khi hot-reload trong Next.js
const SoulMaster =
  mongoose.models.SoulMaster || mongoose.model("SoulMaster", SoulMasterSchema);

export default SoulMaster;
