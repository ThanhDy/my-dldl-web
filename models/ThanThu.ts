import mongoose, { Schema } from "mongoose";

const ThanThuSkillSchema = new Schema({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
}, { _id: false });

const ThanThuLevelEffectSchema = new Schema({
  level: { type: Number, default: 2 },
  effect: { type: String, default: "" },
}, { _id: false });

const ThanThuSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, default: "" },
  rarity: { type: String, default: "" },
  description: { type: String, default: "" },
  skills: [ThanThuSkillSchema],
  levelEffects: [ThanThuLevelEffectSchema],
}, { timestamps: true });

export default mongoose.models.ThanThu || mongoose.model("ThanThu", ThanThuSchema);