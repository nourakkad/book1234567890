"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

const ITEMS_PER_PAGE = 6;

type BookItem = {
  id: number;
  title: string;
  author?: string;
  category: string;
  desc: string;
  imageUrl?: string;
  pdfUrl?: string;
};

type BooksContent = {
  bookItems?: BookItem[];
};

type BookShowContent = {
  title?: string;
  description?: string;
  selectedBookIds?: number[];
};

const FALLBACK_BOOKS: BookItem[] = [
  { id: 1, title: "تحرير العقل من النقل", author: "سامر اسلامبولی", category: "ثقافية", desc: "وقرابة القدية المجموعة من احاديث . البخاري ومسلم", imageUrl: "", pdfUrl: "" },
  { id: 2, title: "اسم الكتاب", author: "سامر اسلامبولی", category: "ثقافية", desc: "وصف بسيط", imageUrl: "", pdfUrl: "" },
  { id: 3, title: "اسم الكتاب", author: "سامر اسلامبولی", category: "ثقافية", desc: "وصف بسيط", imageUrl: "", pdfUrl: "" },
  { id: 4, title: "اسم الكتاب", author: "سامر اسلامبولی", category: "ثقافية", desc: "وصف بسيط", imageUrl: "", pdfUrl: "" },
  { id: 5, title: "اسم الكتاب", author: "سامر اسلامبولی", category: "ثقافية", desc: "وصف بسيط", imageUrl: "", pdfUrl: "" },
  { id: 6, title: "اسم الكتاب", author: "سامر اسلامبولی", category: "ثقافية", desc: "وصف بسيط", imageUrl: "", pdfUrl: "" },
];

export default function BookShowPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const booksContent = useContentBySlug<BooksContent>("books", {
    bookItems: FALLBACK_BOOKS,
  });
  const bookShowContent = useContentBySlug<BookShowContent>("bookShow", {
    title: "عرض الكتاب",
    description: "صفحة مخصصة لعرض تقديمي عن الكتب وأبرز محتواها.",
    selectedBookIds: [1, 2, 3, 4, 5, 6],
  });

  const allBooks = booksContent.bookItems ?? FALLBACK_BOOKS;
  const selectedIds = bookShowContent.selectedBookIds ?? [];
  const selectedBooks = useMemo(() => {
    if (selectedIds.length === 0) return allBooks;
    const idSet = new Set(selectedIds);
    return allBooks.filter((b) => idSet.has(b.id));
  }, [allBooks, selectedIds]);

  const { paginatedBooks, totalPages } = useMemo(() => {
    const total = selectedBooks.length;
    const pages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const slice = selectedBooks.slice(start, start + ITEMS_PER_PAGE);
    return { paginatedBooks: slice, totalPages: pages };
  }, [selectedBooks, currentPage]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Header />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-center text-2xl font-bold text-[#1e3a5f] md:text-3xl">
            {bookShowContent.title ?? "عرض الكتاب"}
          </h1>
          {bookShowContent.description ? (
            <p className="mb-10 text-center text-[#1e3a5f]/80">
              {bookShowContent.description}
            </p>
          ) : null}

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedBooks.map((book) => (
              <article
                key={book.id}
                className="flex flex-col items-center rounded-xl border border-[#e5e0d8] bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <Link href={`/books/${book.id}`} className="block w-full">
                  <div className="relative mb-4">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#e5e0d8]">
                      {book.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col justify-end bg-[linear-gradient(135deg,#f5e6a0,#e8b87a,#d97a6a,#b86a9e,#6a8bb8,#7ab89e)] p-4">
                          <p className="text-right text-lg font-bold leading-tight text-[#8b4513]">
                            {book.title}
                          </p>
                          {book.author ? (
                            <p className="mt-1 text-right text-sm text-[#5c4033]">
                              {book.author}
                            </p>
                          ) : null}
                          <p className="mt-1 line-clamp-2 text-right text-xs text-[#5c4033]/90">
                            {book.desc}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                <Link
                  href={`/books/${book.id}`}
                  className="mt-2 inline-block rounded-lg bg-[#0d5f84] px-6 py-2.5 text-center text-sm font-medium text-white transition hover:bg-[#0a4d6d]"
                >
                  انقر هنا لعرض الكتاب
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-[#0d5f84] text-white"
                        : "bg-gray-200 text-[#1e3a5f] hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </div>
  );
}
