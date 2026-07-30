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

async function cleanBuildsAndSoulRingType() {
  try {
    console.log("🔌 Đang kết nối tới MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Kết nối thành công!");

    const db = mongoose.connection.db;
    if (!db) throw new Error("Không thể truy cập DB");

    const collection = db.collection("soulmasters");
    const heroes = await collection.find({}).toArray();

    let updatedHeroesCount = 0;

    for (const hero of heroes) {
      const unsetFields: any = {};

      if (hero.builds !== undefined) {
        unsetFields.builds = "";
      }

      if (hero.skillDetails && Array.isArray(hero.skillDetails)) {
        const cleanedSkills = hero.skillDetails.map((skill: any) => {
          const { soulRingType, ...rest } = skill;
          return rest;
        });

        await collection.updateOne(
          { _id: hero._id },
          { 
            $set: { skillDetails: cleanedSkills },
            $unset: unsetFields 
          }
        );
        updatedHeroesCount++;
      } else if (Object.keys(unsetFields).length > 0) {
        await collection.updateOne(
          { _id: hero._id },
          { $unset: unsetFields }
        );
        updatedHeroesCount++;
      }
    }

    console.log("----------------------------------------");
    console.log(`🎉 Đã dọn dẹp xong! Xóa bỏ 'builds' và 'soulRingType' trên ${updatedHeroesCount} nhân vật trong MongoDB.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi dọn dẹp:", error);
    process.exit(1);
  }
}

cleanBuildsAndSoulRingType();
