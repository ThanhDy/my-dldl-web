import dbConnect from "@/lib/mongodb";
import SourceSoulHeart from "@/models/SourceSoulHeart";
import SourceSoulHeartList from "./SourceSoulHeartList";
import { SourceSoulHeart as SourceSoulHeartType } from "@/data/types";

export const revalidate = 60;

async function getData() {
  await dbConnect();
  const items = await SourceSoulHeart.find({}).sort({ createdAt: -1 }).lean();
  // Map _id to id since lean() doesn't include virtuals
  return JSON.parse(JSON.stringify(items)).map((item: any) => ({
    ...item,
    id: item._id
  })) as SourceSoulHeartType[];
}

export default async function Page() {
  const items = await getData();
  return <SourceSoulHeartList initialData={items} />;
}
