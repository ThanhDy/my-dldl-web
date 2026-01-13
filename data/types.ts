export interface Build {
  title: string; // Ví dụ: "PvE - 1111" hoặc "PvP - 2212"
}

export interface SkillYearEffect {
  y1k?: string;
  y10k?: string; // 1 Vạn năm
  y25k?: string; // 2.5 Vạn năm
  y50k?: string; // 5 Vạn năm
  y100k?: string; // 10 Vạn năm
}

export interface SkillDetail {
  id: string; // Quy ước: {heroId}-s{thứ_tự_skill}-{hệ_skill (1 hoặc 2)}
  name: string; // Tên kỹ năng (Phần 1)
  type: "Chủ động" | "Bị động"; // Loại (Phần 1)
  soulRingType: string;
  description: string; // Mô tả chính (Phần 2)
  yearEffects: SkillYearEffect; // Các mốc kích hoạt (Phần 3)
  note?: string[]; // Chú thích thêm (Phần 4 - Optional)
  iconUrl?: string;
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

  // Chỉ số/Hiệu ứng Suy Biến (Có thể có hoặc không)
  mutation?: {
    name: string; // Tên cốt suy biến
    iconUrl?: string; // Ảnh cốt suy biến (thường màu đỏ)
    star1Red: string; // 1 Sao Đỏ
    star4Red: string; // 4 Sao Đỏ
    star5Red: string; // 5 Sao Đỏ
    star6Red: string; // 6 Sao Đỏ
  };

  upgrade?: {
    name: string; // Tên sau khi nâng cấp (VD: Cốt 10 vạn năm...)
    iconUrl?: string; // Ảnh cốt mới
    star2: string; // Dòng mới thêm
    star3: string; // Dòng mới thêm
    star5: string; // Dòng mới thêm
  };
}

export interface SoulMaster {
  id: string;
  name: string;
  title: string;
  rarity: "SP" | "SSR" | "SP+";
  type: "Cường Công" | "Mẫn Công" | "Khống Chế" | "Phụ Trợ" | "Phòng Ngự";
  image: string; // Link ảnh
  builds: Build[]; // Danh sách các cách build
  skillDetails: SkillDetail[];
  soulBones: SoulBone[];
}
