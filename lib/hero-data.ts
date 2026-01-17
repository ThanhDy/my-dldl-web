import fs from "fs";
import path from "path";
import { SoulMaster } from "@/data/types"; // Đảm bảo bạn import đúng type

export async function getHeroById(id: string): Promise<SoulMaster | null> {
  try {
    const filePath = path.join(process.cwd(), "data", "heroes", `${id}.json`);
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}
