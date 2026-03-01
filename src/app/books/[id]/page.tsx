"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type BookReview = { text: string; likes: number; views: number };
type BookItem = {
  id: number;
  title: string;
  category: string;
  desc: string;
  imageUrl?: string;
  pdfUrl?: string;
  longDesc?: string;
  reviews?: BookReview[];
  relatedIds?: number[];
};

type BooksContent = {
  bookDetailReviewsTitle?: string;
  relatedTitle?: string;
  bookItems?: BookItem[];
};

const FALLBACK_ITEMS: BookItem[] = [
  {
    id: 1,
    title: "اسم الكتاب",
    category: "ثقافية",
    desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب",
    pdfUrl: "",
    longDesc:
      "وصف الكتاب وصف الكتاب وصف الكتاب وصف الكتاب وصف الكتاب وصف الكتاب وصف الكتاب وصف الكتاب وصف الكتاب.",
    reviews: [{ text: "هذا الكتاب رائع يتحدث عن الثقافة والوعي", likes: 455, views: 45 }],
    relatedIds: [2, 3, 4],
  },
  {
    id: 2,
    title: "اسم الكتاب",
    category: "ثقافية",
    desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب",
    pdfUrl: "",
    longDesc:
      "الكتاب يقدم أفكاراً جديدة ويعالج قضايا إنسانية بعمق وسلاسة في السرد والتعبير.",
    reviews: [{ text: "كتاب ممتع وأسلوبه سلس", likes: 220, views: 31 }],
    relatedIds: [1, 3, 5],
  },
];

export default function BookDetailPage() {
  const params = useParams();
  const currentId = Number(params.id ?? 1);
  const booksContent = useContentBySlug<BooksContent>("books", {
    bookDetailReviewsTitle: "آراء عن هذا الكتاب",
    relatedTitle: "كتب ذات صلة",
    bookItems: FALLBACK_ITEMS,
  });

  const items = booksContent.bookItems && booksContent.bookItems.length > 0
    ? booksContent.bookItems
    : FALLBACK_ITEMS;

  const book = items.find((b) => b.id === currentId) ?? items[0];
  const reviews = book?.reviews && book.reviews.length > 0
    ? book.reviews
    : [{ text: "هذا الكتاب رائع يتحدث عن الثقافة والوعي", likes: 455, views: 45 }];
  const related = items
    .filter((b) =>
      (book?.relatedIds && book.relatedIds.length > 0
        ? book.relatedIds.includes(b.id)
        : b.id !== book?.id))
    .filter((b) => b.id !== book?.id)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main book details */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-sm">
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-[#e5e0d8]">
                  {book?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={book.imageUrl} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#1e3a5f]/50 text-sm">
                      غلاف الكتاب
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h1 className="mb-4 text-3xl font-bold text-[#1e3a5f] md:text-4xl">
                {book?.title ?? "اسم الكتاب"}
              </h1>
              <p className="mb-6 leading-relaxed text-[#1e3a5f]/90">
                {book?.longDesc ?? book?.desc ?? "وصف الكتاب"}
              </p>

              <div className="mb-6 flex gap-3">
                <button
                  type="button"
                  className="rounded-lg p-2 text-[#1e3a5f] hover:bg-[#f5f0e8]"
                  aria-label="حفظ"
                >
                  <BookmarkIcon />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-[#1e3a5f] hover:bg-[#f5f0e8]"
                  aria-label="إعجاب"
                >
                  <HeartIcon />
                </button>
              </div>

              <div className="mb-6 flex flex-wrap gap-4">
                <a
                  href={book?.pdfUrl || "#"}
                  target={book?.pdfUrl ? "_blank" : undefined}
                  rel={book?.pdfUrl ? "noreferrer" : undefined}
                  className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-3 text-white transition hover:bg-[#2c5282]"
                >
                  <DownloadIcon />
                  تحميل
                </a>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-[#1e3a5f]/30 bg-white px-6 py-3 text-[#1e3a5f] transition hover:bg-[#f5f0e8]"
                >
                  <ReadIcon />
                  قراءة
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ماذا تريد أن تكتب؟"
                  className="flex-1 rounded-lg border border-[#e5e0d8] bg-[#faf8f5] px-4 py-3 text-[#1e3a5f] placeholder:text-[#1e3a5f]/50 focus:border-[#1e3a5f]/50 focus:outline-none"
                  aria-label="تعليق"
                />
                <button
                  type="button"
                  className="rounded-lg bg-[#1e3a5f] p-3 text-white transition hover:bg-[#2c5282]"
                  aria-label="إرسال"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User reviews */}
      <section className="bg-[#faf8f5] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-bold text-[#1e3a5f]">
            {booksContent.bookDetailReviewsTitle ?? "آراء عن هذا الكتاب"}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#e5e0d8] bg-white p-6"
              >
                <div className="mb-4 text-3xl text-[#1e3a5f]/40">&ldquo;</div>
                <p className="mb-4 text-[#1e3a5f]">{review.text}</p>
                <div className="flex gap-4 text-sm text-[#1e3a5f]/80">
                  <span className="flex items-center gap-1">
                    <HeartIcon className="size-4" /> {review.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <EyeIcon /> {review.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/reviews"
              className="text-[#1e3a5f] underline hover:no-underline"
            >
              رؤية الكل
            </Link>
          </div>
        </div>
      </section>

      {/* Related books */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-bold text-[#1e3a5f]">
            {booksContent.relatedTitle ?? "كتب ذات صلة"}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[#e5e0d8] bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <Link href={`/books/${item.id}`} className="block">
                  <div className="relative mb-4">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#e5e0d8]">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#1e3a5f]/50 text-sm">
                          غلاف الكتاب
                        </div>
                      )}
                    </div>
                    <div className="absolute left-2 top-2 flex gap-2">
                      <span className="rounded bg-white/90 p-1.5 text-[#1e3a5f]">
                        <BookmarkIcon className="size-4" />
                      </span>
                      <span className="rounded bg-white/90 p-1.5 text-[#1e3a5f]">
                        <HeartIcon className="size-4" />
                      </span>
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-[#1e3a5f]">
                    {item.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-[#1e3a5f]/80">
                    {item.desc}
                  </p>
                </Link>
                <a
                  href={item.pdfUrl || "#"}
                  target={item.pdfUrl ? "_blank" : undefined}
                  rel={item.pdfUrl ? "noreferrer" : undefined}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1e3a5f]/30 py-2 text-sm text-[#1e3a5f] transition hover:bg-[#f5f0e8]"
                >
                  <DownloadIcon className="size-4" />
                  تحميل
                </a>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/books"
              className="text-[#1e3a5f] underline hover:no-underline"
            >
              رؤية الكل
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ReadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m22 2-7 20-4-9-9-4L22 2Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
