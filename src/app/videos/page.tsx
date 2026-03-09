"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

export default function VideosPage() {
  const content = useContentBySlug<{
    title?: string;
    description?: string;
    items?: Array<{
      title?: string;
      sourceLabel?: string;
      videoUrl?: string;
      thumbnailUrl?: string;
    }>;
  }>("videos", {
    title: "الفيديوهات",
    description: "هنا ستظهر الفيديوهات والمواد المرئية الخاصة بالكاتب.",
    items: [
      {
        title: "عنوان الفيديو عنوان الفيديو عنوان الفيديو",
        sourceLabel: "مشاهدة على اليوتيوب",
        videoUrl: "",
        thumbnailUrl: "",
      },
      {
        title: "عنوان الفيديو عنوان الفيديو عنوان الفيديو",
        sourceLabel: "مشاهدة على اليوتيوب",
        videoUrl: "",
        thumbnailUrl: "",
      },
      {
        title: "عنوان الفيديو عنوان الفيديو عنوان الفيديو",
        sourceLabel: "مشاهدة على اليوتيوب",
        videoUrl: "",
        thumbnailUrl: "",
      },
      {
        title: "عنوان الفيديو عنوان الفيديو عنوان الفيديو",
        sourceLabel: "مشاهدة على اليوتيوب",
        videoUrl: "",
        thumbnailUrl: "",
      },
    ],
  });

  const items = content.items && content.items.length > 0 ? content.items : [];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <main>
        <section className="bg-[#f5f5f5]">
          <FanDivider />
        </section>

        <section className="px-4 pb-14 pt-8 sm:px-6 sm:pt-10">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-6 text-center text-2xl font-bold text-[#0d6f95] sm:mb-8 sm:text-3xl">
              {content.title ?? "الفيديوهات"}
            </h1>

            <div className="grid gap-5 md:grid-cols-2">
              {items.map((item, index) => (
                <article key={index} className="overflow-hidden bg-[#dddddd] shadow-sm">
                  <div className="flex items-center justify-between px-3 pt-3 text-[#0d6f95]">
                    <div className="flex items-center gap-2 text-xs">
                      <ShareIcon />
                      <span>مشاركة فعالة</span>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-black" />
                  </div>
                  <p className="px-4 pb-2 pt-1 text-right text-sm font-medium text-[#0d6f95]">
                    {item.title ?? "عنوان الفيديو عنوان الفيديو عنوان الفيديو"}
                  </p>
                  <a
                    href={item.videoUrl || "#"}
                    target={item.videoUrl ? "_blank" : undefined}
                    rel={item.videoUrl ? "noreferrer" : undefined}
                    className="flex aspect-[16/9] items-center justify-center bg-[#dcdcdc]"
                  >
                    {item.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumbnailUrl} alt={item.title ?? ""} className="h-full w-full object-cover" />
                    ) : (
                      <PlayIcon />
                    )}
                  </a>
                  <div className="flex justify-end px-3 pb-3">
                    <span className="rounded bg-[#7b8ca0] px-2 py-1 text-[10px] text-white">
                      {item.sourceLabel ?? "مشاهدة على اليوتيوب"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FanDivider() {
  return (
    <div className="relative h-44 overflow-hidden bg-[#f5f5f5]">
      <div className="absolute inset-0 bg-[#f5f5f5]" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[#0f5576]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 16%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-6 bg-[#255f84]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 28%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-14 bg-[#44789d]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 42%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-24 bg-[#87a9c0]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 62%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-36 bg-[#dae5eb]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 84%, 0 100%)" }} />
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="46" height="32" viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="46" height="32" rx="8" fill="#FF0000" />
      <path d="M19 10.5L30 16L19 21.5V10.5Z" fill="white" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51 15.42 17.49" />
      <path d="M15.41 6.51 8.59 10.49" />
    </svg>
  );
}
