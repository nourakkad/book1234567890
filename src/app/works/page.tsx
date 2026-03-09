"use client";

import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type BookItem = {
  id: number;
  title: string;
  category: string;
  desc: string;
  imageUrl?: string;
};

type BooksContent = {
  bookItems?: BookItem[];
};

const FALLBACK_BOOKS: BookItem[] = [
  { id: 1, title: "العبودية القهرية في دنيا الإنسان", category: "فكر", desc: "وصف مختصر", imageUrl: "" },
  { id: 2, title: "العمران بين السلم والخراب", category: "فكر", desc: "وصف مختصر", imageUrl: "" },
  { id: 3, title: "المنظومة وتكامل الشعور", category: "فكر", desc: "وصف مختصر", imageUrl: "" },
];

export default function WorksPage() {
  const booksContent = useContentBySlug<BooksContent>("books", {
    bookItems: FALLBACK_BOOKS,
  });

  const sourceBooks =
    booksContent.bookItems && booksContent.bookItems.length > 0
      ? booksContent.bookItems
      : FALLBACK_BOOKS;

  const gridBooks = Array.from({ length: 12 }, (_, index) => {
    const item = sourceBooks[index % sourceBooks.length] ?? FALLBACK_BOOKS[0];
    return {
      ...item,
      gridKey: `${item.id}-${index}`,
    };
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main>
        <section className="bg-[#f5f5f5]">
          <div className="relative h-36 overflow-hidden bg-[#045f84]">
            <div
              className="absolute inset-x-0 top-0 h-full bg-[#0d6289]"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 18%, 0 100%)" }}
            />
            <div
              className="absolute inset-x-0 top-0 h-full bg-[#2c7399]"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 28%, 0 100%)" }}
            />
            <div
              className="absolute inset-x-0 top-0 h-full bg-[#5d8faa]"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 40%, 0 100%)" }}
            />
            <div
              className="absolute inset-x-0 top-0 h-full bg-[#d0dde5]"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 54%, 0 100%)" }}
            />
            <div
              className="absolute inset-x-0 top-0 h-full bg-[#f5f5f5]"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 70%, 0 100%)" }}
            />
          </div>
        </section>

        <section className="px-4 pb-16 pt-10 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-8 text-center text-2xl font-bold text-[#0b6d92] md:text-3xl">
              الكتب والروايات
            </h1>

            <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              {gridBooks.map((book) => (
                <Link
                  key={book.gridKey}
                  href={`/books/${book.id}`}
                  className="group rounded-sm bg-[#f8f8f8] px-4 py-3 transition hover:bg-white"
                >
                  <div className="flex items-end justify-center gap-3">
                    <BookStack />
                    <div className="w-[122px] shrink-0">
                      <div className="aspect-[3/4] overflow-hidden rounded-[2px] bg-white shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
                        {book.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={book.imageUrl} alt={book.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#d8d8d8,#efefef)] px-3 text-center text-sm font-semibold text-[#0b6d92]">
                            {book.title}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-center text-sm font-medium text-[#0b6d92] group-hover:underline">
                    {book.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function BookStack() {
  return (
    <div className="relative h-[108px] w-[92px] shrink-0">
      <div className="absolute bottom-0 right-0 h-[88px] w-[68px] rounded-[2px] bg-[linear-gradient(180deg,#dadada,#bfbfbf)] shadow-[0_5px_12px_rgba(0,0,0,0.12)]" />
      <div className="absolute bottom-2 right-3 h-[88px] w-[68px] rounded-[2px] bg-[linear-gradient(180deg,#ececec,#cfcfcf)] shadow-[0_5px_12px_rgba(0,0,0,0.12)]" />
      <div className="absolute bottom-4 right-6 h-[88px] w-[68px] rounded-[2px] bg-[linear-gradient(180deg,#f6f6f6,#d9d9d9)] shadow-[0_5px_12px_rgba(0,0,0,0.12)]" />
      <div className="absolute bottom-4 right-6 h-[88px] w-[68px]">
        <div className="absolute inset-y-0 left-2 right-2 flex flex-col justify-evenly">
          <span className="h-px bg-[#b8b8b8]" />
          <span className="h-px bg-[#b8b8b8]" />
          <span className="h-px bg-[#b8b8b8]" />
          <span className="h-px bg-[#b8b8b8]" />
          <span className="h-px bg-[#b8b8b8]" />
        </div>
      </div>
    </div>
  );
}
