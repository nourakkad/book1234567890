import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

function sanitizeFolder(folder: string) {
  return folder.replace(/[^a-zA-Z0-9_-]/g, "");
}

function getExtension(name: string) {
  return name.includes(".") ? name.split(".").pop()?.toLowerCase() ?? "" : "";
}

export async function POST(req: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const rawFolder = String(formData.get("folder") ?? "content");
  const folder = sanitizeFolder(rawFolder) || "content";
  const kind = String(formData.get("kind") ?? "image");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "No file uploaded" }, { status: 400 });
  }

  const ext = getExtension(file.name);
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf" || ext === "pdf";

  if (kind === "pdf" && !isPdf) {
    return NextResponse.json({ ok: false, message: "Only PDF files are allowed" }, { status: 400 });
  }

  if (kind !== "pdf" && !isImage) {
    return NextResponse.json({ ok: false, message: "Only image files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ ok: false, message: "File is too large (max 8MB)" }, { status: 400 });
  }

  const safeExt = ext || (kind === "pdf" ? "pdf" : "png");
  const fileName = `${Date.now()}-${randomUUID()}.${safeExt}`;
  const relativeDir = path.join("uploads", folder);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  const absolutePath = path.join(absoluteDir, fileName);

  await mkdir(absoluteDir, { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(absolutePath, Buffer.from(bytes));

  const url = `/${relativeDir.replaceAll("\\", "/")}/${fileName}`;
  return NextResponse.json({ ok: true, url });
}
