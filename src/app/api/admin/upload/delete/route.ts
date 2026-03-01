import { NextResponse } from "next/server";
import path from "node:path";
import { stat, unlink } from "node:fs/promises";
import { isAdminAuthenticated } from "@/lib/adminAuth";

function normalizeUploadUrl(url: string) {
  const noQuery = url.split("?")[0].split("#")[0];
  if (!noQuery.startsWith("/uploads/")) return null;
  if (noQuery.includes("..")) return null;
  return noQuery;
}

export async function POST(req: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { url?: string } | null;
  const normalized = normalizeUploadUrl(String(body?.url ?? ""));
  if (!normalized) {
    return NextResponse.json({ ok: false, message: "Invalid file url" }, { status: 400 });
  }

  const absolutePath = path.join(process.cwd(), "public", normalized);
  try {
    await stat(absolutePath);
    await unlink(absolutePath);
  } catch {
    return NextResponse.json({ ok: false, message: "File not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
