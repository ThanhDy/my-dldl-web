import mongoose, { Schema, Model } from "mongoose";
import { HonDaoKhi as IHonDaoKhi } from "@/data/types";

const honDaoKhiStarEffectSchema = new Schema({
  starLevel: { type: String, required: true },
  effect: { type: String, default: "" },
});

const honDaoKhiSchema = new Schema<IHonDaoKhi>(
  {
    name: { type: String, required: true },
    image: { type: String, default: "" },
    starEffects: [honDaoKhiStarEffectSchema],
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

// Add indexes for performance
honDaoKhiSchema.index({ name: 1 });
honDaoKhiSchema.index({ createdAt: -1 });

// Force re-registration in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.HonDaoKhi;
}

const HonDaoKhi: Model<IHonDaoKhi> =
  mongoose.models.HonDaoKhi || mongoose.model<IHonDaoKhi>("HonDaoKhi", honDaoKhiSchema);

export default HonDaoKhi;
