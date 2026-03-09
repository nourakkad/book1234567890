"use client";

import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type AudioBookItem = {
  id: number;
  title?: string;
  author?: string;
  description?: string;
  imageUrl?: string;
  audioUrl?: string;
};

type AudioBooksContent = {
  title?: string;
  description?: string;
  items?: AudioBookItem[];
};

const FALLBACK_ITEMS: AudioBookItem[] = [
  {
    id: 1,
    title: "تحرير العقل من النقل",
    author: "سامر اسلامبولی",
    description: "وقرابة القدية المجموعة من احاديث . البخاري ومسلم",
    imageUrl: "",
    audioUrl: "",
  },
];

export default function AudioBooksPage() {
  const content = useContentBySlug<AudioBooksContent>("audioBooks", {
    title: "الكتب الصوتية",
    description: "هنا ستظهر الكتب الصوتية المتاحة للاستماع أو التحميل.",
    items: FALLBACK_ITEMS,
  });

  const items =
    content.items && content.items.length > 0 ? content.items : FALLBACK_ITEMS;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="bg-white">
        <section className="px-4 pb-16 pt-10 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-2 text-center text-xl font-bold text-[#1e3a5f] sm:text-2xl md:text-3xl">
              {content.title ?? "الكتب الصوتية"}
            </h1>
            {content.description ? (
              <p className="mb-10 text-center text-[#1e3a5f]/80">
                {content.description}
              </p>
            ) : null}

            {/* Grid: 2 rows x 3 columns */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((book) => (
                <article
                  key={book.id}
                  className="flex flex-col items-center"
                >
                  <Link href={`/audio-books/${book.id}`} className="block w-full">
                    <div className="overflow-hidden rounded-lg bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                      <div className="aspect-[3/4] overflow-hidden">
                        {book.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={book.imageUrl}
                            alt={book.title ?? ""}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col justify-between bg-[linear-gradient(135deg,#f5e6a0,#e8b87a,#d97a6a,#b86a9e,#6a8bb8,#7ab89e)] p-3 sm:p-4">
                            <p className="text-right text-sm font-medium text-[#0d5f84]">
                              {book.author ?? "سامر اسلامبولی"}
                            </p>
                            <div className="flex-1" />
                            <p className="text-right text-base font-bold leading-tight text-[#c45c3e] sm:text-xl">
                              {book.title ?? "كتاب صوتي"}
                            </p>
                            <p className="mt-2 text-right text-xs leading-relaxed text-[#5c4033]/90">
                              {book.description ?? ""}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  <Link
                    href={`/audio-books/${book.id}`}
                    className="mt-4 text-[#0d5f84] font-medium underline transition hover:text-[#1e3a5f]"
                  >
                    انقر هنا للاستماع لهذا الكتاب
                  </Link>
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
