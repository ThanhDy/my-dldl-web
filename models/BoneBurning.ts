import mongoose, { Schema, Document, Model } from "mongoose";
import { BoneBurning as IBoneBurning, BoneBurningLevel as IBoneBurningLevel } from "@/data/types";

const boneBurningLevelSchema = new Schema<IBoneBurningLevel>({
  level: { type: Number, required: true },
  levelName: { type: String, required: true },
  description: { type: String, required: true },
});

const boneBurningSchema = new Schema<IBoneBurning>(
  {
    type: { type: String, required: true, unique: true }, // "Cường Công", etc.
    levels: [boneBurningLevelSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const BoneBurning: Model<IBoneBurning> =
  mongoose.models.BoneBurning ||
  mongoose.model<IBoneBurning>("BoneBurning", boneBurningSchema);

export default BoneBurning;
