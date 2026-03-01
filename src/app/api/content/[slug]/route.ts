import { NextResponse } from "next/server";
import { getContentBySlug, upsertContent } from "@/lib/content/service";
import { isAdminAuthenticated } from "@/lib/adminAuth";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const data = await getContentBySlug(slug);
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: Request, ctx: Ctx) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { data?: unknown } | null;

  if (typeof body?.data === "undefined") {
    return NextResponse.json({ ok: false, message: "Missing data" }, { status: 400 });
  }

  await upsertContent(slug, body.data);
  return NextResponse.json({ ok: true });
}
