import ThanThuClient from "./ThanThuClient";
import dbConnect from "@/lib/mongodb";
import ThanThu from "@/models/ThanThu";

export const metadata = {
  title: "Thần Thú | DLDL Wiki",
  description: "Tra cứu thông tin, kỹ năng và hiệu ứng của các Thần Thú",
};

export const revalidate = 60;

const RARITY_ORDER: Record<string, number> = {
  "SP+": 6,
  "SP": 5,
  "SSR+": 4,
  "SSR": 3,
  "SR": 2,
  "R": 1,
};

const getRarityWeight = (rarity: string) => {
  const r = (rarity || "").toUpperCase().trim();
  return RARITY_ORDER[r] || 0;
};

export default async function ThanThuPage() {
  await dbConnect();
  const data = await ThanThu.find({}).lean();
  const serializedData = JSON.parse(JSON.stringify(data));

  serializedData.sort((a: any, b: any) => {
    const weightA = getRarityWeight(a.rarity);
    const weightB = getRarityWeight(b.rarity);
    if (weightB !== weightA) {
      return weightB - weightA;
    }
    return (a.name || "").localeCompare(b.name || "", "vi");
  });

  return <ThanThuClient initialData={serializedData} />;
}