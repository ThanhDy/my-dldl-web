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

async function cleanEmptySkills() {
  try {
    console.log("🔌 Đang kết nối tới MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Kết nối thành công!");

    const db = mongoose.connection.db;
    if (!db) throw new Error("Không thể truy cập DB");

    const collection = db.collection("soulmasters");
    const heroes = await collection.find({}).toArray();

    let updatedCount = 0;
    let totalSkillsRemoved = 0;

    for (const hero of heroes) {
      if (!hero.skillDetails || !Array.isArray(hero.skillDetails)) continue;

      const validSkills = hero.skillDetails.filter((s: any) => {
        const hasName = typeof s.name === "string" && s.name.trim() !== "";
        const hasDesc = typeof s.description === "string" && s.description.trim() !== "";
        const hasCloudinaryIcon = typeof s.iconUrl === "string" && s.iconUrl.startsWith("http");
        return hasName || hasDesc || hasCloudinaryIcon;
      });

      if (validSkills.length !== hero.skillDetails.length) {
        const removed = hero.skillDetails.length - validSkills.length;
        totalSkillsRemoved += removed;
        updatedCount++;
        console.log(`🧹 [${hero.id}] Đã loại bỏ ${removed} kỹ năng rỗng.`);

        await collection.updateOne(
          { _id: hero._id },
          { $set: { skillDetails: validSkills } }
        );
      }
    }

    console.log("----------------------------------------");
    console.log(`🎉 Đã dọn dẹp xong! Cập nhật ${updatedCount} nhân vật, loại bỏ tổng cộng ${totalSkillsRemoved} kỹ năng rỗng.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi dọn dẹp kỹ năng rỗng:", error);
    process.exit(1);
  }
}

cleanEmptySkills();
