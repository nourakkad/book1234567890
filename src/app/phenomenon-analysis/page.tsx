"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

const ITEMS_PER_PAGE = 6;

type PhenomenonItem = {
  id: number;
  title?: string;
  imageUrl?: string;
  description?: string;
};

type PhenomenonContent = {
  title?: string;
  description?: string;
  items?: PhenomenonItem[];
};

const FALLBACK_ITEMS: PhenomenonItem[] = [
  { id: 1, title: "قصة النبي يوسف", imageUrl: "", description: "" },
  { id: 2, title: "قصة النبي يوسف", imageUrl: "", description: "" },
  { id: 3, title: "قصة النبي يوسف", imageUrl: "", description: "" },
  { id: 4, title: "قصة النبي يوسف", imageUrl: "", description: "" },
  { id: 5, title: "قصة النبي يوسف", imageUrl: "", description: "" },
  { id: 6, title: "قصة النبي يوسف", imageUrl: "", description: "" },
];

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function PhenomenonAnalysisPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const content = useContentBySlug<PhenomenonContent>("phenomenonAnalysis", {
    title: "تحليل الظاهرة",
    description: "صفحة مخصصة لمحتوى تحليلي ودراسات مرتبطة بالظواهر المطروحة.",
    items: FALLBACK_ITEMS,
  });

  const allItems =
    content.items && content.items.length > 0 ? content.items : FALLBACK_ITEMS;

  const { paginatedItems, totalPages } = useMemo(() => {
    const total = allItems.length;
    const pages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const slice = allItems.slice(start, start + ITEMS_PER_PAGE);
    return { paginatedItems: slice, totalPages: pages };
  }, [allItems, currentPage]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Header />

      <main className="bg-[#faf8f5]">
        <section className="px-4 pb-16 pt-10 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-2 text-center text-xl font-bold text-[#1e3a5f] sm:text-2xl md:text-3xl">
              {content.title ?? "تحليل الظاهرة"}
            </h1>
            {content.description ? (
              <p className="mb-10 text-center text-[#1e3a5f]/80">
                {content.description}
              </p>
            ) : null}

            {/* Grid: 2 rows x 3 columns */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/phenomenon-analysis/${item.id}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#e5e0d8]">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title ?? ""}
                        className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#e5e0d8]" />
                    )}
                  </div>
                  <p className="mt-3 text-[#0d5f84] font-medium transition group-hover:underline">
                    {item.title ?? "تحليل الظاهرة"}
                  </p>
                </Link>
              ))}
            </div>

            {/* Pagination - dark blue bar with numbers and arrows */}
            {totalPages > 1 ? (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-1 rounded-lg bg-[#0d5f84] px-3 py-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded text-white transition hover:bg-white/20 disabled:opacity-40"
                  aria-label="الصفحة السابقة"
                >
                  <ChevronRightIcon />
                </button>
                <div className="mx-2 flex flex-wrap justify-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .reverse()
                    .map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[2.25rem] rounded px-2 py-1.5 text-sm font-medium transition ${
                          currentPage === page
                            ? "bg-[#2c7ba3] text-white"
                            : "text-white hover:bg-white/20"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded text-white transition hover:bg-white/20 disabled:opacity-40"
                  aria-label="الصفحة التالية"
                >
                  <ChevronLeftIcon />
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
