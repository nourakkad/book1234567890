"use client";

import { useEffect, useMemo, useState } from "react";
import { EDITABLE_SLUGS } from "@/lib/content/defaults";

type ContentMap = Record<string, unknown>;
type EditorMode = "form" | "json";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<ContentMap>({});
  const [selectedSlug, setSelectedSlug] = useState(EDITABLE_SLUGS[0] ?? "global");
  const [jsonValue, setJsonValue] = useState("{}");
  const [message, setMessage] = useState("");
  const [editorMode, setEditorMode] = useState<EditorMode>("form");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setAuthenticated(Boolean(d?.authenticated)))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    void fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        const data = (d?.data ?? {}) as ContentMap;
        setContent(data);
        const dataForSlug = data[selectedSlug] ?? {};
        setJsonValue(JSON.stringify(dataForSlug, null, 2));
      });
  }, [authenticated, selectedSlug]);

  const prettySlugs = useMemo(() => EDITABLE_SLUGS, []);
  const parsed = useMemo(() => {
    try {
      return { valid: true as const, value: JSON.parse(jsonValue) as unknown };
    } catch {
      return { valid: false as const, value: {} as unknown };
    }
  }, [jsonValue]);

  const selectedData = useMemo<Record<string, unknown>>(() => {
    if (parsed.valid && isObject(parsed.value)) return parsed.value;
    return {};
  }, [parsed]);

  const formSupportedSlugs = new Set(["global", "home", "about", "books", "reviews", "articles"]);
  const canUseForm = formSupportedSlugs.has(selectedSlug);

  function applyObject(next: Record<string, unknown>) {
    setJsonValue(JSON.stringify(next, null, 2));
  }

  function updateTopLevelField(key: string, value: unknown) {
    applyObject({ ...selectedData, [key]: value });
  }

  function updateNestedField(path: string[], value: unknown) {
    const next = JSON.parse(JSON.stringify(selectedData)) as Record<string, unknown>;
    let current: Record<string, unknown> = next;
    for (let i = 0; i < path.length - 1; i += 1) {
      const step = path[i];
      const existing = current[step];
      if (!isObject(existing)) {
        current[step] = {};
      }
      current = current[step] as Record<string, unknown>;
    }
    current[path[path.length - 1]] = value;
    applyObject(next);
  }

  function getTopArray(key: string) {
    const value = selectedData[key];
    return Array.isArray(value) ? value : [];
  }

  function setTopArray(key: string, nextArray: unknown[]) {
    updateTopLevelField(key, nextArray);
  }

  function patchTopArrayItem(key: string, index: number, patch: Record<string, unknown>) {
    const arr = [...getTopArray(key)];
    const current = arr[index];
    const base = isObject(current) ? current : {};
    arr[index] = { ...base, ...patch };
    setTopArray(key, arr);
  }

  function removeTopArrayItem(key: string, index: number) {
    const arr = [...getTopArray(key)];
    arr.splice(index, 1);
    setTopArray(key, arr);
  }

  function addTopArrayItem(key: string, item: Record<string, unknown>) {
    setTopArray(key, [...getTopArray(key), item]);
  }

  async function uploadFile(
    file: File,
    folder: string,
    key: string,
    kind: "image" | "pdf" = "image"
  ) {
    setMessage("");
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("kind", kind);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; url?: string; message?: string }
        | null;
      if (!res.ok || !data?.url) {
        setMessage(data?.message ?? "فشل رفع الملف");
        return null;
      }
      setMessage("تم رفع الملف بنجاح");
      return data.url;
    } finally {
      setUploadingKey(null);
    }
  }

  async function deleteUploadedFile(url: string) {
    if (!url || !url.startsWith("/uploads/")) return true;
    const res = await fetch("/api/admin/upload/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      setMessage("تعذر حذف الملف من السيرفر");
      return false;
    }
    return true;
  }

  async function login() {
    setMessage("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setMessage("كلمة المرور غير صحيحة");
      return;
    }
    setAuthenticated(true);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
  }

  async function save() {
    setMessage("");
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonValue);
    } catch {
      setMessage("JSON غير صالح");
      return;
    }

    const res = await fetch(`/api/content/${selectedSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: parsed }),
    });

    if (!res.ok) {
      setMessage("فشل الحفظ");
      return;
    }

    setContent((prev) => ({ ...prev, [selectedSlug]: parsed }));
    setMessage("تم الحفظ بنجاح");
  }

  async function seedDefaults() {
    setMessage("");
    const res = await fetch("/api/content/seed", { method: "POST" });
    if (!res.ok) {
      setMessage("فشل تهيئة البيانات");
      return;
    }
    const refreshed = await fetch("/api/content").then((r) => r.json());
    const data = (refreshed?.data ?? {}) as ContentMap;
    setContent(data);
    const dataForSlug = data[selectedSlug] ?? {};
    setJsonValue(JSON.stringify(dataForSlug, null, 2));
    setMessage("تمت تهيئة البيانات الافتراضية");
  }

  if (checking) {
    return <div className="p-8 text-[#1e3a5f]">Loading...</div>;
  }

  if (!authenticated) {
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-6 text-2xl font-bold text-[#1e3a5f]">لوحة التحكم</h1>
        <div className="rounded-xl border border-[#e5e0d8] bg-white p-6">
          <label className="mb-2 block text-sm text-[#1e3a5f]">كلمة مرور الإدارة</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-lg border border-[#d6cfc4] px-3 py-2 outline-none focus:border-[#1e3a5f]"
          />
          <button
            type="button"
            onClick={login}
            className="w-full rounded-lg bg-[#1e3a5f] px-4 py-2 text-white"
          >
            دخول
          </button>
          {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">لوحة التحكم بالمحتوى</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={seedDefaults}
            className="rounded-lg border border-[#d6cfc4] px-4 py-2 text-[#1e3a5f]"
          >
            تهيئة البيانات
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-[#d6cfc4] px-4 py-2 text-[#1e3a5f]"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-[#e5e0d8] bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-[#1e3a5f]">الصفحات</p>
          <div className="flex flex-col gap-2">
            {prettySlugs.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(slug);
                  const dataForSlug = content[slug] ?? {};
                  setJsonValue(JSON.stringify(dataForSlug, null, 2));
                }}
                className={`rounded-lg px-3 py-2 text-right text-sm ${
                  selectedSlug === slug
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-[#f5f0e8] text-[#1e3a5f]"
                }`}
              >
                {slug}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-xl border border-[#e5e0d8] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#1e3a5f]">تحرير: {selectedSlug}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditorMode("form")}
                disabled={!canUseForm}
                className={`rounded-md px-3 py-1 text-sm ${
                  editorMode === "form"
                    ? "bg-[#1e3a5f] text-white"
                    : "border border-[#d6cfc4] text-[#1e3a5f]"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("json")}
                className={`rounded-md px-3 py-1 text-sm ${
                  editorMode === "json"
                    ? "bg-[#1e3a5f] text-white"
                    : "border border-[#d6cfc4] text-[#1e3a5f]"
                }`}
              >
                JSON
              </button>
            </div>
          </div>

          {editorMode === "form" && canUseForm ? (
            <div className="space-y-4">
              {selectedSlug === "global" ? (
                <>
                  <LabeledInput
                    label="Site Title"
                    value={String(selectedData.siteTitle ?? "")}
                    onChange={(v) => updateTopLevelField("siteTitle", v)}
                  />
                  <LabeledTextarea
                    label="Site Description"
                    value={String(selectedData.siteDescription ?? "")}
                    onChange={(v) => updateTopLevelField("siteDescription", v)}
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <LabeledInput
                      label="Nav Home"
                      value={String((isObject(selectedData.nav) ? selectedData.nav.home : "") ?? "")}
                      onChange={(v) => updateNestedField(["nav", "home"], v)}
                    />
                    <LabeledInput
                      label="Nav About"
                      value={String((isObject(selectedData.nav) ? selectedData.nav.about : "") ?? "")}
                      onChange={(v) => updateNestedField(["nav", "about"], v)}
                    />
                    <LabeledInput
                      label="Nav Books"
                      value={String((isObject(selectedData.nav) ? selectedData.nav.books : "") ?? "")}
                      onChange={(v) => updateNestedField(["nav", "books"], v)}
                    />
                    <LabeledInput
                      label="Nav Articles"
                      value={String((isObject(selectedData.nav) ? selectedData.nav.articles : "") ?? "")}
                      onChange={(v) => updateNestedField(["nav", "articles"], v)}
                    />
                    <LabeledInput
                      label="Footer Quick Links Title"
                      value={String((isObject(selectedData.footer) ? selectedData.footer.quickLinksTitle : "") ?? "")}
                      onChange={(v) => updateNestedField(["footer", "quickLinksTitle"], v)}
                    />
                    <LabeledInput
                      label="Footer Follow Title"
                      value={String((isObject(selectedData.footer) ? selectedData.footer.followTitle : "") ?? "")}
                      onChange={(v) => updateNestedField(["footer", "followTitle"], v)}
                    />
                  </div>
                  <LabeledInput
                    label="Footer Copyright"
                    value={String((isObject(selectedData.footer) ? selectedData.footer.copyright : "") ?? "")}
                    onChange={(v) => updateNestedField(["footer", "copyright"], v)}
                  />
                </>
              ) : null}

              {selectedSlug === "home" ? (
                <>
                  <LabeledInput
                    label="Hero Badge"
                    value={String(selectedData.heroBadge ?? "")}
                    onChange={(v) => updateTopLevelField("heroBadge", v)}
                  />
                  <LabeledInput
                    label="Hero Title"
                    value={String(selectedData.heroTitle ?? "")}
                    onChange={(v) => updateTopLevelField("heroTitle", v)}
                  />
                  <LabeledTextarea
                    label="Hero Text"
                    value={String(selectedData.heroText ?? "")}
                    onChange={(v) => updateTopLevelField("heroText", v)}
                  />
                  <LabeledInput
                    label="Hero Subtext"
                    value={String(selectedData.heroSubtext ?? "")}
                    onChange={(v) => updateTopLevelField("heroSubtext", v)}
                  />
                  <LabeledInput
                    label="CTA Title"
                    value={String(selectedData.ctaTitle ?? "")}
                    onChange={(v) => updateTopLevelField("ctaTitle", v)}
                  />
                  <LabeledInput
                    label="CTA Subtitle"
                    value={String(selectedData.ctaSubtitle ?? "")}
                    onChange={(v) => updateTopLevelField("ctaSubtitle", v)}
                  />
                  <LabeledInput
                    label="About Card Title"
                    value={String(selectedData.aboutTitle ?? "")}
                    onChange={(v) => updateTopLevelField("aboutTitle", v)}
                  />
                  <LabeledTextarea
                    label="About Card Text"
                    value={String(selectedData.aboutText ?? "")}
                    onChange={(v) => updateTopLevelField("aboutText", v)}
                  />
                  <ImageUploadField
                    label="Home About Image URL"
                    value={String(selectedData.aboutImageUrl ?? "")}
                    uploading={uploadingKey === "home-about-image"}
                    onChange={(v) => updateTopLevelField("aboutImageUrl", v)}
                    onUpload={async (file) => {
                      const url = await uploadFile(file, "home", "home-about-image", "image");
                      if (url) updateTopLevelField("aboutImageUrl", url);
                    }}
                    onDelete={async () => {
                      const current = String(selectedData.aboutImageUrl ?? "");
                      if (await deleteUploadedFile(current)) updateTopLevelField("aboutImageUrl", "");
                    }}
                  />
                </>
              ) : null}

              {selectedSlug === "about" ? (
                <>
                  <LabeledInput
                    label="Badge"
                    value={String(selectedData.badge ?? "")}
                    onChange={(v) => updateTopLevelField("badge", v)}
                  />
                  <LabeledInput
                    label="Title"
                    value={String(selectedData.title ?? "")}
                    onChange={(v) => updateTopLevelField("title", v)}
                  />
                  <LabeledTextarea
                    label="Intro"
                    value={String(selectedData.intro ?? "")}
                    onChange={(v) => updateTopLevelField("intro", v)}
                  />
                  <ImageUploadField
                    label="Author Image URL"
                    value={String(selectedData.authorImageUrl ?? "")}
                    uploading={uploadingKey === "about-author-image"}
                    onChange={(v) => updateTopLevelField("authorImageUrl", v)}
                    onUpload={async (file) => {
                      const url = await uploadFile(file, "about", "about-author-image", "image");
                      if (url) updateTopLevelField("authorImageUrl", url);
                    }}
                    onDelete={async () => {
                      const current = String(selectedData.authorImageUrl ?? "");
                      if (await deleteUploadedFile(current)) updateTopLevelField("authorImageUrl", "");
                    }}
                  />
                  <LabeledTextarea
                    label="Role Paragraphs (one line per paragraph)"
                    value={Array.isArray(selectedData.roleParagraphs) ? selectedData.roleParagraphs.join("\n") : ""}
                    onChange={(v) =>
                      updateTopLevelField(
                        "roleParagraphs",
                        v
                          .split("\n")
                          .map((x) => x.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </>
              ) : null}

              {selectedSlug === "books" ? (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <LabeledInput
                      label="Section Title"
                      value={String(selectedData.sectionTitle ?? "")}
                      onChange={(v) => updateTopLevelField("sectionTitle", v)}
                    />
                    <LabeledInput
                      label="Reviews Title"
                      value={String(selectedData.reviewsTitle ?? "")}
                      onChange={(v) => updateTopLevelField("reviewsTitle", v)}
                    />
                    <LabeledInput
                      label="Book Detail Reviews Title"
                      value={String(selectedData.bookDetailReviewsTitle ?? "")}
                      onChange={(v) => updateTopLevelField("bookDetailReviewsTitle", v)}
                    />
                    <LabeledInput
                      label="Related Section Title"
                      value={String(selectedData.relatedTitle ?? "")}
                      onChange={(v) => updateTopLevelField("relatedTitle", v)}
                    />
                  </div>
                  <LabeledTextarea
                    label="Author Role Text"
                    value={String(selectedData.authorRoleText ?? "")}
                    onChange={(v) => updateTopLevelField("authorRoleText", v)}
                  />

                  <div className="mt-4 rounded-lg border border-[#e5e0d8] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1e3a5f]">Book Items</p>
                      <button
                        type="button"
                        onClick={() =>
                          addTopArrayItem("bookItems", {
                            id: Date.now(),
                            title: "اسم الكتاب",
                            category: "ثقافية",
                            desc: "وصف بسيط",
                            longDesc: "وصف تفصيلي",
                            pdfUrl: "",
                            relatedIds: [],
                            reviews: [],
                          })
                        }
                        className="rounded-md border border-[#d6cfc4] px-3 py-1 text-sm text-[#1e3a5f]"
                      >
                        + إضافة كتاب
                      </button>
                    </div>

                    <div className="space-y-4">
                      {getTopArray("bookItems").map((rawItem, index) => {
                        const item = isObject(rawItem) ? rawItem : {};
                        const relatedIds = Array.isArray(item.relatedIds) ? item.relatedIds.join(", ") : "";
                        return (
                          <div key={index} className="rounded-lg border border-[#e5e0d8] p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-sm font-semibold text-[#1e3a5f]">كتاب #{index + 1}</p>
                              <button
                                type="button"
                                onClick={() => removeTopArrayItem("bookItems", index)}
                                className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-600"
                              >
                                حذف
                              </button>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                              <LabeledInput
                                label="ID"
                                value={String(item.id ?? "")}
                                onChange={(v) => patchTopArrayItem("bookItems", index, { id: Number(v) || 0 })}
                              />
                              <LabeledInput
                                label="Title"
                                value={String(item.title ?? "")}
                                onChange={(v) => patchTopArrayItem("bookItems", index, { title: v })}
                              />
                              <LabeledInput
                                label="Category"
                                value={String(item.category ?? "")}
                                onChange={(v) => patchTopArrayItem("bookItems", index, { category: v })}
                              />
                              <LabeledInput
                                label="Related IDs (comma)"
                                value={relatedIds}
                                onChange={(v) =>
                                  patchTopArrayItem("bookItems", index, {
                                    relatedIds: v
                                      .split(",")
                                      .map((x) => Number(x.trim()))
                                      .filter((n) => !Number.isNaN(n) && n > 0),
                                  })
                                }
                              />
                            </div>
                            <LabeledTextarea
                              label="Short Description"
                              value={String(item.desc ?? "")}
                              onChange={(v) => patchTopArrayItem("bookItems", index, { desc: v })}
                            />
                            <LabeledTextarea
                              label="Long Description"
                              value={String(item.longDesc ?? "")}
                              onChange={(v) => patchTopArrayItem("bookItems", index, { longDesc: v })}
                            />
                            <ImageUploadField
                              label="Image URL"
                              value={String(item.imageUrl ?? "")}
                              uploading={uploadingKey === `book-image-${index}`}
                              onChange={(v) => patchTopArrayItem("bookItems", index, { imageUrl: v })}
                              onUpload={async (file) => {
                                const url = await uploadFile(file, "books", `book-image-${index}`, "image");
                                if (url) patchTopArrayItem("bookItems", index, { imageUrl: url });
                              }}
                              onDelete={async () => {
                                const current = String(item.imageUrl ?? "");
                                if (await deleteUploadedFile(current)) {
                                  patchTopArrayItem("bookItems", index, { imageUrl: "" });
                                }
                              }}
                            />
                            <FileUploadField
                              label="PDF URL"
                              value={String(item.pdfUrl ?? "")}
                              accept=".pdf,application/pdf"
                              uploading={uploadingKey === `book-pdf-${index}`}
                              uploadLabel="رفع PDF"
                              onChange={(v) => patchTopArrayItem("bookItems", index, { pdfUrl: v })}
                              onUpload={async (file) => {
                                const url = await uploadFile(file, "books-pdf", `book-pdf-${index}`, "pdf");
                                if (url) patchTopArrayItem("bookItems", index, { pdfUrl: url });
                              }}
                              onDelete={async () => {
                                const current = String(item.pdfUrl ?? "");
                                if (await deleteUploadedFile(current)) {
                                  patchTopArrayItem("bookItems", index, { pdfUrl: "" });
                                }
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : null}

              {selectedSlug === "reviews" ? (
                <>
                  <LabeledInput
                    label="Title"
                    value={String(selectedData.title ?? "")}
                    onChange={(v) => updateTopLevelField("title", v)}
                  />

                  <div className="mt-4 rounded-lg border border-[#e5e0d8] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1e3a5f]">Reviews</p>
                      <button
                        type="button"
                        onClick={() =>
                          addTopArrayItem("items", {
                            text: "مراجعة جديدة",
                            likes: 0,
                            dislikes: 0,
                          })
                        }
                        className="rounded-md border border-[#d6cfc4] px-3 py-1 text-sm text-[#1e3a5f]"
                      >
                        + إضافة مراجعة
                      </button>
                    </div>
                    <div className="space-y-4">
                      {getTopArray("items").map((rawItem, index) => {
                        const item = isObject(rawItem) ? rawItem : {};
                        return (
                          <div key={index} className="rounded-lg border border-[#e5e0d8] p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-sm font-semibold text-[#1e3a5f]">Review #{index + 1}</p>
                              <button
                                type="button"
                                onClick={() => removeTopArrayItem("items", index)}
                                className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-600"
                              >
                                حذف
                              </button>
                            </div>
                            <LabeledTextarea
                              label="Text"
                              value={String(item.text ?? "")}
                              onChange={(v) => patchTopArrayItem("items", index, { text: v })}
                            />
                            <div className="grid gap-3 md:grid-cols-2">
                              <LabeledInput
                                label="Likes"
                                value={String(item.likes ?? 0)}
                                onChange={(v) => patchTopArrayItem("items", index, { likes: Number(v) || 0 })}
                              />
                              <LabeledInput
                                label="Dislikes"
                                value={String(item.dislikes ?? 0)}
                                onChange={(v) => patchTopArrayItem("items", index, { dislikes: Number(v) || 0 })}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : null}

              {selectedSlug === "articles" ? (
                <>
                  <div className="rounded-lg border border-[#e5e0d8] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1e3a5f]">Article Items</p>
                      <button
                        type="button"
                        onClick={() => {
                          const items = isObject(selectedData.items) ? selectedData.items : {};
                          const ids = Object.keys(items)
                            .map((k) => Number(k))
                            .filter((n) => !Number.isNaN(n));
                          const nextId = String((ids.length ? Math.max(...ids) : 0) + 1);
                          updateNestedField(["items", nextId], {
                            title: `عنوان المقال ${nextId}`,
                            date: "1-1-2026",
                            secondaryTitle: "عنوان ثانوي",
                          });
                        }}
                        className="rounded-md border border-[#d6cfc4] px-3 py-1 text-sm text-[#1e3a5f]"
                      >
                        + إضافة مقال
                      </button>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(isObject(selectedData.items) ? selectedData.items : {})
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([id, rawItem]) => {
                          const item = isObject(rawItem) ? rawItem : {};
                          return (
                            <div key={id} className="rounded-lg border border-[#e5e0d8] p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <p className="text-sm font-semibold text-[#1e3a5f]">Article #{id}</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const items = isObject(selectedData.items) ? { ...selectedData.items } : {};
                                    delete items[id];
                                    updateTopLevelField("items", items);
                                  }}
                                  className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-600"
                                >
                                  حذف
                                </button>
                              </div>
                              <LabeledInput
                                label="Title"
                                value={String(item.title ?? "")}
                                onChange={(v) => updateNestedField(["items", id, "title"], v)}
                              />
                              <LabeledInput
                                label="Date"
                                value={String(item.date ?? "")}
                                onChange={(v) => updateNestedField(["items", id, "date"], v)}
                              />
                              <LabeledTextarea
                                label="Secondary Title"
                                value={String(item.secondaryTitle ?? "")}
                                onChange={(v) => updateNestedField(["items", id, "secondaryTitle"], v)}
                              />
                              <ImageUploadField
                                label="Main Image URL"
                                value={String(item.imageUrl ?? "")}
                                uploading={uploadingKey === `article-main-${id}`}
                                onChange={(v) => updateNestedField(["items", id, "imageUrl"], v)}
                                onUpload={async (file) => {
                                  const url = await uploadFile(file, "articles", `article-main-${id}`, "image");
                                  if (url) updateNestedField(["items", id, "imageUrl"], url);
                                }}
                                onDelete={async () => {
                                  const current = String(item.imageUrl ?? "");
                                  if (await deleteUploadedFile(current)) {
                                    updateNestedField(["items", id, "imageUrl"], "");
                                  }
                                }}
                              />
                              <ImageUploadField
                                label="Secondary Image URL"
                                value={String(item.secondaryImageUrl ?? "")}
                                uploading={uploadingKey === `article-secondary-${id}`}
                                onChange={(v) => updateNestedField(["items", id, "secondaryImageUrl"], v)}
                                onUpload={async (file) => {
                                  const url = await uploadFile(file, "articles", `article-secondary-${id}`, "image");
                                  if (url) updateNestedField(["items", id, "secondaryImageUrl"], url);
                                }}
                                onDelete={async () => {
                                  const current = String(item.secondaryImageUrl ?? "");
                                  if (await deleteUploadedFile(current)) {
                                    updateNestedField(["items", id, "secondaryImageUrl"], "");
                                  }
                                }}
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <div>
              {!canUseForm && editorMode === "form" ? (
                <p className="mb-3 rounded-lg bg-[#f5f0e8] px-3 py-2 text-sm text-[#1e3a5f]">
                  Form mode is currently available for: global, home, about, books, reviews, articles. Use JSON mode for other slugs.
                </p>
              ) : null}
              <textarea
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
                className="min-h-[420px] w-full rounded-lg border border-[#d6cfc4] p-3 font-mono text-sm outline-none focus:border-[#1e3a5f]"
                dir="ltr"
              />
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-white"
            >
              حفظ
            </button>
            {!parsed.valid ? (
              <span className="text-sm text-red-600">JSON غير صالح</span>
            ) : null}
            {message ? <span className="text-sm text-[#1e3a5f]">{message}</span> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-[#1e3a5f]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#d6cfc4] px-3 py-2 outline-none focus:border-[#1e3a5f]"
      />
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-[#1e3a5f]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24 w-full rounded-lg border border-[#d6cfc4] px-3 py-2 outline-none focus:border-[#1e3a5f]"
      />
    </label>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
  onUpload,
  onDelete,
  uploading,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  uploading?: boolean;
}) {
  return (
    <>
      <FileUploadField
        label={label}
        value={value}
        onChange={onChange}
        onUpload={onUpload}
        onDelete={onDelete}
        uploading={uploading}
        accept="image/*"
        uploadLabel="رفع صورة"
      />
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-3 h-24 rounded-md border border-[#e5e0d8] object-cover" />
      ) : null}
    </>
  );
}

function FileUploadField({
  label,
  value,
  onChange,
  onUpload,
  onDelete,
  uploading,
  accept,
  uploadLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  uploading?: boolean;
  accept: string;
  uploadLabel: string;
}) {
  return (
    <div className="rounded-lg border border-[#e5e0d8] p-3">
      <div className="mb-2">
        <span className="text-sm text-[#1e3a5f]">{label}</span>
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mb-2 w-full rounded-lg border border-[#d6cfc4] px-3 py-2 text-sm outline-none focus:border-[#1e3a5f]"
        dir="ltr"
      />

      <div
        className="mb-2 rounded-lg border-2 border-dashed border-[#d6cfc4] bg-[#faf8f5] p-3 text-center text-xs text-[#1e3a5f]/80"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (!file || uploading) return;
          void onUpload(file);
        }}
      >
        اسحب الملف وأفلته هنا
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-md border border-[#d6cfc4] px-3 py-1.5 text-sm text-[#1e3a5f]">
          {uploading ? "جاري الرفع..." : uploadLabel}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              void onUpload(file);
              e.currentTarget.value = "";
            }}
          />
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => {
              void onDelete();
            }}
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600"
          >
            حذف
          </button>
        ) : null}
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#1e3a5f] underline"
          >
            فتح الملف
          </a>
        ) : null}
      </div>
    </div>
  );
}
