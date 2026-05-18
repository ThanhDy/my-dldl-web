const fs = require('fs');
let content = fs.readFileSync('d:/MY PROJECTS/my-dldl-web/models/SoulMaster.ts', 'utf8');

const targetStr = `const SoulMasterSchema = new Schema(
  {
    // Custom ID string mà bạn dùng trong file data cũ (ví dụ: "duong-tam-sp")`;

const replacementSchemas = `
// --- 7th, 8th, 9th Soul Skills Sub-Schemas ---

const SeventhSkillEffectSchema = new Schema({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
}, { _id: false });

const SeventhSkillSchema = new Schema({
  y250k: { type: SeventhSkillEffectSchema, default: {} },
  y350k: { type: SeventhSkillEffectSchema, default: {} },
  y400k: { type: SeventhSkillEffectSchema, default: {} },
  y450k: { type: SeventhSkillEffectSchema, default: {} },
  y500k: { type: SeventhSkillEffectSchema, default: {} },
}, { _id: false });

const EighthSkillDetailSchema = new Schema({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
  unlockCondition: { type: String, default: "" },
}, { _id: false });

const EighthSkillSchema = new Schema({
  active: { type: EighthSkillDetailSchema, default: {} },
  passives: {
    honHoanSongHe: { type: EighthSkillDetailSchema, default: {} },
    nguyenHonLuc: { type: EighthSkillDetailSchema, default: {} },
    uyApChanThan: { type: EighthSkillDetailSchema, default: {} },
  }
}, { _id: false });

const NinthSkillSchema = new Schema({
  active: { type: EighthSkillDetailSchema, default: {} },
  passive: { type: EighthSkillDetailSchema, default: {} }, // Khí Nguyên Thần Khí
}, { _id: false });

const SoulMasterSchema = new Schema(
  {
    // Custom ID string mà bạn dùng trong file data cũ (ví dụ: "duong-tam-sp")`;

const targetFields = `    // Hệ thống cho Hồn Sư Thần Chỉ (Optional)
    divineSystem: { type: DivineSystemSchema },
  },`;

const replacementFields = `    // Hệ thống cho Hồn Sư Thần Chỉ (Optional)
    divineSystem: { type: DivineSystemSchema },

    // Hệ thống Đệ thất, Đệ bát, Đệ cửu hồn kỹ
    seventhSkill: { type: SeventhSkillSchema, default: {} },
    eighthSkill: { type: EighthSkillSchema, default: {} },
    ninthSkill: { type: NinthSkillSchema, default: {} },
  },`;

content = content.replace(targetStr, replacementSchemas);
content = content.replace(targetFields, replacementFields);

fs.writeFileSync('d:/MY PROJECTS/my-dldl-web/models/SoulMaster.ts', content, 'utf8');
console.log('Done Mongoose Schema');
