// utils/skillHelpers.ts

export const getSkillBranch = (skillId: string): number => {
  // Cắt chuỗi dựa trên dấu gạch ngang "-"
  const parts = skillId.split("-");
  // Lấy phần tử cuối cùng
  const lastPart = parts[parts.length - 1];

  // Chuyển sang số (1 hoặc 2)
  return parseInt(lastPart) || 1; // Mặc định là 1 nếu lỗi
};

// Hàm lấy thứ tự kỹ năng (Skill 1, 2, 3, 4)
export const getSkillOrder = (skillId: string): number => {
  // ID mẫu: tieu-bach-s1-1 -> lấy chữ "s1"
  const parts = skillId.split("-");
  // Tìm phần tử bắt đầu bằng chữ 's' và theo sau là số
  const skillPart = parts.find((p) => p.match(/^s\d+$/));
  if (skillPart) {
    return parseInt(skillPart.replace("s", ""));
  }
  return 1;
};
