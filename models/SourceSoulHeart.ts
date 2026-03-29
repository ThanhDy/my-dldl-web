import mongoose, { Schema, Document, Model } from "mongoose";
import {
  SourceSoulHeart as ISourceSoulHeart,
  starEffect as IStarEffect,
} from "@/data/types";

const starEffectSchema = new Schema<IStarEffect>({
  star: { type: Number, required: true },
  condition: { type: Number, required: true },
  description: { type: String, required: true },
});

const sourceSoulHeartSchema = new Schema<ISourceSoulHeart>(
  {
    name: { type: String, required: true, trim: true },
    character: { type: String, required: true, trim: true },
    rarity: { type: String, required: true },
    type: { type: String, required: true },
    avatar: { type: String },
    basicStat: { type: String },
    basicSkill: { type: String },
    isExtend: { type: Boolean, default: false },
    starEffects: [starEffectSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const SourceSoulHeart: Model<ISourceSoulHeart> =
  mongoose.models.SourceSoulHeart ||
  mongoose.model<ISourceSoulHeart>("SourceSoulHeart", sourceSoulHeartSchema);

export default SourceSoulHeart;
