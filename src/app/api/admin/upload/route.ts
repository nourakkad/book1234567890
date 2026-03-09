import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const MAX_SIZE_IMAGE_PDF = 8 * 1024 * 1024; // 8 MB
const MAX_SIZE_AUDIO = 50 * 1024 * 1024; // 50 MB

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
  const isAudio =
    file.type.startsWith("audio/") ||
    file.type === "video/mp4" ||
    ["mp3", "m4a", "mp4", "ogg", "wav", "webm"].includes(ext);

  if (kind === "pdf" && !isPdf) {
    return NextResponse.json({ ok: false, message: "Only PDF files are allowed" }, { status: 400 });
  }
  if (kind === "audio" && !isAudio) {
    return NextResponse.json(
      { ok: false, message: "Only audio files are allowed (e.g. mp3, m4a, mp4)" },
      { status: 400 }
    );
  }
  if (kind !== "pdf" && kind !== "audio" && !isImage) {
    return NextResponse.json({ ok: false, message: "Only image files are allowed" }, { status: 400 });
  }

  const maxSize = kind === "audio" ? MAX_SIZE_AUDIO : MAX_SIZE_IMAGE_PDF;
  if (file.size > maxSize) {
    const maxMB = kind === "audio" ? 50 : 8;
    return NextResponse.json(
      { ok: false, message: `File is too large (max ${maxMB}MB)` },
      { status: 400 }
    );
  }

  const safeExt =
    ext || (kind === "pdf" ? "pdf" : kind === "audio" ? "mp3" : "png");
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
