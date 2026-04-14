import mongoose, { Schema, Model } from "mongoose";
import { HungThuSoulRing as IHungThuSoulRing } from "@/data/types";

const hungThuYearEffectSchema = new Schema({
  year: { type: String, required: true },
  effect: { type: String, required: true },
});

const hungThuSoulRingSchema = new Schema<IHungThuSoulRing>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    systems: { 
      type: [String], 
      required: true, 
      enum: ["Cường Công", "Mẫn Công", "Khống Chế", "Phụ Trợ/Phòng Ngự"] 
    },
    type: { 
      type: String, 
      required: true, 
      enum: ["Regular", "Combined"] 
    },
    basicEffect: { type: String, required: true },
    yearEffects: [hungThuYearEffectSchema],
    // References
    componentIds: [{ type: Schema.Types.ObjectId, ref: "HungThuSoulRing" }],
    suitableWithId: { type: Schema.Types.ObjectId, ref: "HungThuSoulRing" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret: any) {
        ret.id = ret._id.toString();
        if (ret.componentIds) {
          ret.componentIds = ret.componentIds.map((id: any) => id.toString());
        }
        if (ret.suitableWithId) {
          ret.suitableWithId = ret.suitableWithId.toString();
        }
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Force re-registration in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.HungThuSoulRing;
}

const HungThuSoulRing: Model<IHungThuSoulRing> =
  mongoose.models.HungThuSoulRing ||
  mongoose.model<IHungThuSoulRing>("HungThuSoulRing", hungThuSoulRingSchema);

export default HungThuSoulRing;
