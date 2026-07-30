import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

// Đọc .env.local để lấy MONGODB_URI
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  for (const line of envConfig.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI không tìm thấy trong .env.local");
  process.exit(1);
}

// Hàm kiểm tra xem object có chứa dữ liệu thực sự (chuỗi không rỗng, số, mảng không rỗng) hay không
function hasRealContent(obj: any): boolean {
  if (!obj || typeof obj !== "object") return false;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string" && val.trim() !== "") return true;
    if (typeof val === "number" && !isNaN(val)) return true;
    if (typeof val === "boolean" && val === true) return true;
    if (Array.isArray(val) && val.length > 0) return true;
    if (typeof val === "object" && val !== null && hasRealContent(val)) return true;
  }
  return false;
}

async function cleanData() {
  try {
    console.log("🔌 Đang kết nối tới MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Kết nối thành công!");

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Không thể truy cập database handle");
    }

    const collection = db.collection("soulmasters");
    const heroes = await collection.find({}).toArray();

    console.log(`📦 Tìm thấy tổng cộng ${heroes.length} nhân vật.`);

    let countVhct = 0;
    let countSeventh = 0;
    let countEighth = 0;
    let countNinth = 0;
    let countNvv = 0;
    let countDivine = 0;

    for (const hero of heroes) {
      const unsetFields: any = {};

      // 1. Kiểm tra nvvCardSystem
      if (hero.id !== "ninh-vinh-vinh-sp" || !hasRealContent(hero.nvvCardSystem)) {
        if (hero.nvvCardSystem !== undefined) {
          unsetFields.nvvCardSystem = "";
          countNvv++;
        }
      }

      // 2. Kiểm tra divineSystem
      if (hero.rarity !== "Thần Chỉ" || !hasRealContent(hero.divineSystem)) {
        if (hero.divineSystem !== undefined) {
          unsetFields.divineSystem = "";
          countDivine++;
        }
      }

      // 3. Kiểm tra vuHonChanThan
      if (hero.vuHonChanThan !== undefined && !hasRealContent(hero.vuHonChanThan)) {
        unsetFields.vuHonChanThan = "";
        countVhct++;
      }

      // 4. Kiểm tra seventhSkill
      if (hero.seventhSkill !== undefined && !hasRealContent(hero.seventhSkill)) {
        unsetFields.seventhSkill = "";
        countSeventh++;
      }

      // 5. Kiểm tra eighthSkill
      if (hero.eighthSkill !== undefined && !hasRealContent(hero.eighthSkill)) {
        unsetFields.eighthSkill = "";
        countEighth++;
      }

      // 6. Kiểm tra ninthSkill
      if (hero.ninthSkill !== undefined && !hasRealContent(hero.ninthSkill)) {
        unsetFields.ninthSkill = "";
        countNinth++;
      }

      if (Object.keys(unsetFields).length > 0) {
        await collection.updateOne(
          { _id: hero._id },
          { $unset: unsetFields }
        );
      }
    }

    console.log("🧹 Kết quả dọn dẹp chi tiết:");
    console.log(` -> Đã unset vuHonChanThan rỗng trên: ${countVhct} nhân vật.`);
    console.log(` -> Đã unset seventhSkill rỗng trên: ${countSeventh} nhân vật.`);
    console.log(` -> Đã unset eighthSkill rỗng trên: ${countEighth} nhân vật.`);
    console.log(` -> Đã unset ninthSkill rỗng trên: ${countNinth} nhân vật.`);
    console.log(` -> Đã unset nvvCardSystem rỗng trên: ${countNvv} nhân vật.`);
    console.log(` -> Đã unset divineSystem rỗng trên: ${countDivine} nhân vật.`);

    console.log("🎉 Hoàn tất dọn dẹp dữ liệu rỗng trong MongoDB!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi dọn dẹp dữ liệu:", error);
    process.exit(1);
  }
}

cleanData();
