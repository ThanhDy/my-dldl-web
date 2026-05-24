import mongoose, { Schema } from "mongoose";

const ThanThuSkillSchema = new Schema({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
}, { _id: false });

const ThanThuLevelEffectSchema = new Schema({
  level: { type: Number, default: 2 },
  effect: { type: String, default: "" },
}, { _id: false });

const ThanThuUnionSkillSchema = new Schema({
  name: { type: String, default: "" },
  linkedThanThuId: { type: String, default: "" },
  levelEffects: [{
    level: { type: Number, default: 2 },
    effect: { type: String, default: "" }
  }],
}, { _id: false });

const ThanThuSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, default: "" },
  rarity: { type: String, default: "" },
  description: { type: String, default: "" },
  skills: [ThanThuSkillSchema],
  unionSkills: [ThanThuUnionSkillSchema],
  levelEffects: [ThanThuLevelEffectSchema],
}, { timestamps: true });

if (mongoose.models && mongoose.models.ThanThu) {
  delete mongoose.models.ThanThu;
}

export default mongoose.models.ThanThu || mongoose.model("ThanThu", ThanThuSchema);