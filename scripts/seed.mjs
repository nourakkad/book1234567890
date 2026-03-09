/**
 * Seed the database with default content.
 * Run: pnpm run seed (or npm run seed)
 * Requires: MONGODB_URI and MONGODB_DB in .env.local
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import mongoose from "mongoose";

// Load .env.local if present
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

// Dynamic import for TS modules (requires tsx when running)
const { DEFAULT_CONTENT } = await import("../src/lib/content/defaults.ts");
const { PageContent } = await import("../src/lib/models/PageContent.ts");

async function seed() {
  const uri = process.env.MONGODB_URI;
  const db = process.env.MONGODB_DB || "books_showroom";

  if (!uri) {
    console.error("Missing MONGODB_URI. Set it in .env.local or pass as env var.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri, { dbName: db });
  console.log("Connected.");

  const slugs = Object.keys(DEFAULT_CONTENT);
  console.log(`Seeding ${slugs.length} content slugs...`);

  for (const slug of slugs) {
    const data = DEFAULT_CONTENT[slug];
    await PageContent.updateOne(
      { slug },
      { $set: { data } },
      { upsert: true }
    );
    console.log(`  ✓ ${slug}`);
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
