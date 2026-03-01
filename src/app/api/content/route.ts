import { NextResponse } from "next/server";
import { getAllContent } from "@/lib/content/service";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function GET() {
  const all = await getAllContent();
  return NextResponse.json({ ok: true, data: all });
}

export async function PUT(req: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { data?: Record<string, unknown> }
    | null;

  if (!body?.data || typeof body.data !== "object") {
    return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
  }

  const { upsertContent } = await import("@/lib/content/service");
  await Promise.all(
    Object.entries(body.data).map(([slug, data]) => upsertContent(slug, data))
  );

  return NextResponse.json({ ok: true });
}
