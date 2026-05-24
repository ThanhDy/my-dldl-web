import ThanThuClient from "./ThanThuClient";
import dbConnect from "@/lib/mongodb";
import ThanThu from "@/models/ThanThu";

export const metadata = {
  title: "Thần Thú | DLDL Wiki",
  description: "Tra cứu thông tin, kỹ năng và hiệu ứng của các Thần Thú",
};

export const revalidate = 60;

export default async function ThanThuPage() {
  await dbConnect();
  const data = await ThanThu.find({}).sort({ rarity: -1, name: 1 }).lean();
  const serializedData = JSON.parse(JSON.stringify(data));

  return <ThanThuClient initialData={serializedData} />;
}