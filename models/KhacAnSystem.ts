import mongoose, { Schema } from "mongoose";

const KhacAnPieceSchema = new Schema({
  id: { type: String, required: true }, // 'main', 'sub1', 'sub2', v.v.
  name: { type: String, default: "" },
  image: { type: String, default: "" },
  descriptionPVP: { type: String, default: "" },
  descriptionPVE: { type: String, default: "" },
}, { _id: false });

const KhacAnSetSchema = new Schema({
  setId: { type: Number, required: true }, // 1, 2, 3, 4
  name: { type: String, default: "" },
  pieces: [KhacAnPieceSchema],
}, { _id: false });

const KhacAnSystemSchema = new Schema(
  {
    id: { type: String, required: true, unique: true }, // "cuong-man", "ho-tro", "khong-che"
    type: { type: String, required: true },
    sets: [KhacAnSetSchema],
  },
  { timestamps: true }
);

// Cần xóa model rác khi dev (tránh lỗi HMR)
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.KhacAnSystem;
}

const KhacAnSystem = mongoose.models.KhacAnSystem || mongoose.model("KhacAnSystem", KhacAnSystemSchema);
export default KhacAnSystem;