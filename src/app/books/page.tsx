"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

const ITEMS_PER_PAGE = 6;

type ReviewItem = { text: string; likes: number; dislikes: number };
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
  reviewsTitle?: string;
  bookItems?: BookItem[];
  reviews?: ReviewItem[];
  authorRoleText?: string;
  stats?: Array<{ value: string; label: string }>;
};

export default function BooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const booksContent = useContentBySlug<BooksContent>("books", {
    reviewsTitle: "ماذا يقول القراء؟",
    bookItems: [
      { id: 1, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", pdfUrl: "" },
      { id: 2, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", pdfUrl: "" },
      { id: 3, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", pdfUrl: "" },
      { id: 4, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", pdfUrl: "" },
      { id: 5, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", pdfUrl: "" },
      { id: 6, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", pdfUrl: "" },
    ],
    reviews: [],
    authorRoleText:
      "الكاتب هو شخص يعبر عن أفكاره ومشاعره من خلال الكلمة المكتوبة بأسلوب منظم ومؤثر. يساهم في نشر المعرفة والثقافة ونقل التجارب الإنسانية بين الأجيال. يمتلك مهارات لغوية وخيالاً واسعاً وقدرة على التحليل والتأمل. ويعد دوراً مهماً في توعية المجتمع وإلهام القراء وصناعة التغيير.",
    stats: [
      { value: "+10 K", label: "قراء" },
      { value: "+14", label: "منشور" },
      { value: "+3", label: "جوائز" },
    ],
  });

  const allBooks =
    booksContent.bookItems && booksContent.bookItems.length > 0
      ? booksContent.bookItems
      : [];

  const { paginatedBooks, totalPages } = useMemo(() => {
    const total = allBooks.length;
    const pages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const slice = allBooks.slice(start, start + ITEMS_PER_PAGE);
    return { paginatedBooks: slice, totalPages: pages };
  }, [allBooks, currentPage]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Header />

      {/* Book grid */}
      <section className="px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedBooks.map((book) => (
                <article
                key={book.id}
                className="flex flex-col items-center rounded-xl border border-[#e5e0d8] bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4"
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
                        <div className="flex h-full w-full flex-col justify-end bg-[linear-gradient(135deg,#f5e6a0,#e8b87a,#d97a6a,#b86a9e,#6a8bb8,#7ab89e)] p-3 sm:p-4">
                          <p className="text-right text-base font-bold leading-tight text-[#8b4513] sm:text-lg">
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
                  className="mt-2 inline-block w-full rounded-lg bg-[#0d5f84] px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-[#0a4d6d] sm:w-auto sm:px-6"
                >
                  انقر هنا لعرض الكتاب
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
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

      {/* What do readers say */}
      <section className="bg-[#faf8f5] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
            <h2 className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">
              {booksContent.reviewsTitle ?? "ماذا يقول القراء؟"}
            </h2>
            <Link
              href="/reviews"
              className="text-[#1e3a5f] underline hover:no-underline"
            >
              رؤية الكل
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(booksContent.reviews && booksContent.reviews.length > 0 ? booksContent.reviews : [
              { text: "قرأت جميع الكتب، وكل واحد يقدم منظور فريد عن الحياة والثقافة", likes: 100, dislikes: 100 },
              { text: "تجربة رائعة مع مجموعة الكتب، أسلوب الكاتب سلس ومشوّق جداً", likes: 85, dislikes: 12 },
              { text: "أسلوب الكاتب مميز ويستحق المتابعة، أنصح بقراءة جميع أعماله", likes: 74, dislikes: 8 },
              { text: "كتب رائعة تلامس الوجدان وتفتح آفاقاً جديدة في التفكير", likes: 63, dislikes: 5 },
            ]).map((review, i) => (
              <div key={i} className="rounded-2xl bg-[#eeeae4] px-4 py-5 sm:px-7 sm:py-6">
                {/* Large quote mark */}
                <div className="mb-4 text-right">
                  <svg width="34" height="27" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 30V18.75C0 13.75 1.375 9.625 4.125 6.375C6.875 3.125 10.625 1 15.375 0L17.25 3.375C14.875 4.125 12.875 5.5 11.25 7.5C9.625 9.5 8.75 11.75 8.625 14.25H15.75V30H0ZM21.75 30V18.75C21.75 13.75 23.125 9.625 25.875 6.375C28.625 3.125 32.375 1 37.125 0L39 3.375C36.625 4.125 34.625 5.5 33 7.5C31.375 9.5 30.5 11.75 30.375 14.25H37.5V30H21.75Z" fill="#1e3a5f"/>
                  </svg>
                </div>
                {/* Quote text */}
                <p className="mb-6 text-center text-sm text-[#1e3a5f] leading-relaxed">
                  {review.text}
                </p>
                {/* Like / Dislike */}
                <div className="flex items-center justify-end gap-5">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[#1e3a5f]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 14V2" /><path d="M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-.88z" />
                    </svg>
                    {review.dislikes}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[#1e3a5f]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 10v12" /><path d="M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 .88z" />
                    </svg>
                    {review.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Author info + stats */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="leading-relaxed text-[#1e3a5f]">
              {booksContent.authorRoleText ??
                "الكاتب هو شخص يعبر عن أفكاره ومشاعره من خلال الكلمة المكتوبة بأسلوب منظم ومؤثر."}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {(
              booksContent.stats && booksContent.stats.length > 0
                ? booksContent.stats
                : [
                    { value: "+10 K", label: "قراء" },
                    { value: "+14", label: "منشور" },
                    { value: "+3", label: "جوائز" },
                  ]
            ).map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl bg-[#f5f0e8] px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] sm:h-12 sm:w-12">
                {idx === 0 ? <UsersIcon /> : idx === 1 ? <BookIcon /> : <MedalIcon />}
              </div>
              <div>
                <span className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">{stat.value}</span>
                <p className="text-sm text-[#1e3a5f]/80">{stat.label}</p>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 15c3.866 0 7-3.224 7-7s-3.134-7-7-7-7 3.224-7 7 3.134 7 7 7z" />
      <path d="M12 22v-4" />
      <path d="M8 18l2 2 2-2 2 2" />
      <path d="M12 2v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

