import { NextResponse } from "next/server";
import { setAdminSession, verifyAdminPassword } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { password?: string }
    | null;

  const password = body?.password ?? "";
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ ok: false, message: "Invalid password" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
