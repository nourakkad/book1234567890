import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { upsertContent } from "@/lib/content/service";

export async function POST() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  await Promise.all(
    Object.entries(DEFAULT_CONTENT).map(([slug, data]) => upsertContent(slug, data))
  );

  return NextResponse.json({ ok: true });
}
