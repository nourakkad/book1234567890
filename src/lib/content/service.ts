import { connectToDatabase } from "@/lib/db";
import { PageContent } from "@/lib/models/PageContent";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";

export async function getContentBySlug<T = unknown>(slug: string): Promise<T> {
  await connectToDatabase();
  const doc = await PageContent.findOne({ slug }).lean();
  return (doc?.data ?? DEFAULT_CONTENT[slug] ?? null) as T;
}

export async function getAllContent() {
  await connectToDatabase();
  const docs = await PageContent.find({}).lean();
  const dbMap = Object.fromEntries(docs.map((d) => [d.slug, d.data]));
  return {
    ...DEFAULT_CONTENT,
    ...dbMap,
  };
}

export async function upsertContent(slug: string, data: unknown) {
  await connectToDatabase();
  await PageContent.updateOne({ slug }, { $set: { data } }, { upsert: true });
}
