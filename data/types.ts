export interface SkillYearEffect {
  y1k?: string;
  y10k?: string; // 1 Vạn năm
  y25k?: string; // 2.5 Vạn năm
  y50k?: string; // 5 Vạn năm
  y100k?: string; // 10 Vạn năm
}

export interface SkillDetail {
  id: string; // Quy ước: {heroId}-s{thứ_tự_skill}-{hệ_skill (1 hoặc 2)}
  name: string; // Tên kỹ năng
  type: "Chủ động" | "Bị động" | "Công thường"; // Loại kỹ năng
  description: string; // Mô tả chính
  yearEffects: SkillYearEffect; // Các mốc kích hoạt theo năm
  note?: string[]; // Chú thích thêm (Optional)
  iconUrl?: string;
}

export interface MutationStarEffect {
  starLevel: string; // Số sao, VD: "1", "4", "5", "6"
  type: "red" | "gold"; // "red" (Sao Đỏ) hoặc "gold" (Sao Kim SP+)
  effect: string; // Mô tả hiệu ứng suy biến
}

export interface SoulBone {
  position:
    | "Đầu"
    | "Thân"
    | "Tay Trái"
    | "Tay Phải"
    | "Chân Trái"
    | "Chân Phải";
  name: string; // Tên cốt thường
  iconUrl?: string; // Ảnh cốt thường

  // Chỉ số/Hiệu ứng Hồn cốt thường
  standard: {
    base: string; // Kỹ năng cơ bản
    star4: string; // 4 Sao Vàng
    star6: string; // 6 Sao Vàng
  };

  // Chỉ số/Hiệu ứng Suy Biến
  mutation?: {
    name: string; // Tên cốt suy biến
    iconUrl?: string; // Ảnh cốt suy biến
    effects?: MutationStarEffect[]; // Danh sách hiệu quả suy biến tự nhập mốc sao
    [key: string]: any; // Tương thích dữ liệu legacy (star1Red, star4Gold, v.v...)
  };

  upgrade?: {
    name: string; // Tên sau khi nâng cấp
    iconUrl?: string; // Ảnh cốt mới
    star2: string; // Mốc 2 sao nâng cấp
    star3: string; // Mốc 3 sao nâng cấp
    star5: string; // Mốc 5 sao nâng cấp
  };
}

// --- HỆ THỐNG THẺ BÀI NINH VINH VINH SP+ ---

export type NvvCardType =
  | "Thông Dụng"
  | "Cửu Thải Lưu Ly · Tốc"
  | "Lưu Ly Tâm Nguyên"
  | "Cửu Thải Lưu Ly · Dụ"
  | "Cửu Thải Lưu Ly · Diệu";

export interface NvvCard {
  id: string;
  name: string;
  type: NvvCardType;
  image: string;
  shortDescription: string;

  // Chi tiết kỹ năng
  basicSkill: string;

  detailedEffect: {
    condition: string;
    effect?: string;
    quest?: {
      description: string;
      buff: string;
    };
  };

  upgradeEffects?: {
    condition: string;
    effect: string;
  }[];
}

export interface StarUpgrade {
  star: number;
  isRedStar: boolean;
  description: string;
}

export interface SoulMaster {
  id: string;
  name: string;
  title: string;
  rarity: "SP" | "SSR" | "SSR+" | "SP+";
  isSpPlus?: boolean;
  type:
    | "Cường Công"
    | "Mẫn Công"
    | "Khống Chế"
    | "Phụ Trợ"
    | "Phòng Ngự"
    | "Ám Khí";
  image: string;
  buildNote?: string;
  skillDetails: SkillDetail[];
  soulBones: SoulBone[];
  starUpgrades?: StarUpgrade[];

  // Dữ liệu NVV SP+
  nvvCardSystem?: {
    cards: NvvCard[];
  };

  // Hệ thống Đệ thất, Đệ bát, Đệ cửu hồn kỹ
  seventhSkill?: {
    y250k: { name: string; description: string };
    y350k: { name: string; description: string };
    y400k: { name: string; description: string };
    y450k: { name: string; description: string };
    y500k: { name: string; description: string };
  };
  eighthSkill?: {
    active?: { name: string; description: string };
    passives?: {
      honHoanSongHe?: { name: string; description: string; unlockCondition?: string };
      nguyenHonLuc?: { name: string; description: string; unlockCondition?: string };
      uyApChanThan?: { name: string; description: string; unlockCondition?: string };
    };
  };
  ninthSkill?: {
    active?: { name: string; description: string };
    passive?: { name: string; description: string; unlockCondition?: string };
  };
}

// --- NGUỒN HỒN TÂM ---

export interface StarEffect {
  star: number;
  description: string;
  condition: number;
}
export type starEffect = StarEffect;

export interface SourceSoulHeart {
  id: string;
  name: string;
  character: string;
  rarity: string;
  type: string;
  avatar: string;
  basicStat: string;
  basicSkill: string;
  isExtend?: boolean;
  starEffects: StarEffect[];
}

export interface BoneBurningLevel {
  level: number;
  levelName: string;
  description: string;
}

export interface BoneBurning {
  id: string;
  type: string;
  levels: BoneBurningLevel[];
}

// --- HỆ THỐNG HỒN HOÀN HUNG THÚ ---

export type HungThuSystem = "Cường Công" | "Mẫn Công" | "Khống Chế" | "Phụ Trợ/Phòng Ngự";
export type HungThuType = "Regular" | "Combined";

export interface HungThuYearEffect {
  year: string;
  effect: string;
}

export interface HungThuSoulRing {
  id: string;
  name: string;
  image: string;
  systems: HungThuSystem[];
  type: HungThuType;
  basicEffect: string;
  yearEffects: HungThuYearEffect[];
  componentIds?: string[];
  suitableWithId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- HỆ THỐNG HỒN ĐẠO KHÍ ---

export interface HonDaoKhiStarEffect {
  starLevel: string;
  effect: string;
}

export interface HonDaoKhi {
  id: string;
  name: string;
  image: string;
  starEffects: HonDaoKhiStarEffect[];
  createdAt?: string;
  updatedAt?: string;
}

// --- HỆ THỐNG KHẮC ẤN HỒN CỐT ---

export interface KhacAnPiece {
  id: string;
  name: string;
  image: string;
  descriptionPVP: string;
  descriptionPVE: string;
}

export interface KhacAnSet {
  setId: number;
  name: string;
  description?: string;
  pieces: KhacAnPiece[];
}

export interface KhacAnSystem {
  id: string;
  type: string;
  sets: KhacAnSet[];
  createdAt?: string;
  updatedAt?: string;
}

// --- HỆ THỐNG THẦN THÚ ---

export interface ThanThuSkill {
  name: string;
  description: string;
}

export interface ThanThuLevelEffect {
  level: number;
  effect: string;
}

export interface ThanThuUnionSkill {
  name: string;
  linkedThanThuId: string;
  levelEffects: ThanThuLevelEffect[];
}

export interface ThanThu {
  id: string;
  name: string;
  image: string;
  rarity?: string;
  description: string;
  skills: ThanThuSkill[];
  unionSkills?: ThanThuUnionSkill[];
  levelEffects: ThanThuLevelEffect[];
  createdAt?: string;
  updatedAt?: string;
}
