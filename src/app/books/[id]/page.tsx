"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type BookItem = {
  id: number;
  title: string;
  author?: string;
  category: string;
  desc: string;
  imageUrl?: string;
  pdfUrl?: string;
  longDesc?: string;
  relatedIds?: number[];
};

type BooksContent = {
  bookItems?: BookItem[];
};

type ArticleItem = {
  title?: string;
  imageUrl?: string;
};

type ArticlesContent = {
  items?: Record<string, ArticleItem>;
};

const FALLBACK_ITEMS: BookItem[] = [
  {
    id: 1,
    title: "أسطورة نزول المسيح أو شبهه أو ظهور المهدي",
    category: "ثقافية",
    desc: "كتاب يناقش عدداً من المفاهيم الشائعة.",
    pdfUrl: "",
    longDesc:
      "يتناول هذا الكتاب ما يلي:\nمفهوم نزول المسيح إلى السماء.\nمفهوم عودة النبي عيسى عند النصارى.\nبقاء روح النبي الميت وليس النوم.\nالنبي ليس كأي شيء مخلوق مثل سائر الناس.\nهل رفع المسيح كان ذات الغيب بعينه؟\nهل هو الآن في السماء أم في الأرض؟",
    relatedIds: [2, 3, 4],
  },
  {
    id: 2,
    title: "العمران بين السلم والخراب",
    category: "ثقافية",
    desc: "قراءة فكرية في بنية العمران.",
    pdfUrl: "",
    longDesc:
      "الكتاب يقدم أفكاراً جديدة ويعالج قضايا إنسانية بعمق وسلاسة في السرد والتعبير.",
    relatedIds: [1, 3, 5],
  },
];

export default function BookDetailPage() {
  const params = useParams();
  const currentId = Number(params.id ?? 1);
  const booksContent = useContentBySlug<BooksContent>("books", {
    bookItems: FALLBACK_ITEMS,
  });
  const articlesContent = useContentBySlug<ArticlesContent>("articles", {
    items: {},
  });

  const items = booksContent.bookItems && booksContent.bookItems.length > 0
    ? booksContent.bookItems
    : FALLBACK_ITEMS;

  const book = items.find((b) => b.id === currentId) ?? items[0];
  const detailLines = (book?.longDesc ?? book?.desc ?? "وصف الكتاب")
    .split(/[\n\r]+|[.،]/)
    .map((line) => line.trim())
    .filter(Boolean);
  const articleEntries = Object.entries(articlesContent.items ?? {}).sort(([a], [b]) => Number(a) - Number(b));
  const relatedPosts = Array.from({ length: 6 }, (_, index) => {
    const item = articleEntries[index % Math.max(articleEntries.length, 1)]?.[1];
    return {
      id: index + 1,
      title: item?.title ?? "منشورات قرآنية",
      imageUrl: item?.imageUrl ?? "",
      author: "قصة النبي يوسف",
    };
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <section className="px-4 py-8 sm:px-6 sm:py-10 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[360px_1fr] lg:items-start lg:gap-10">
          <div className="mx-auto w-full max-w-[300px]">
            <div className="aspect-[3/4] overflow-hidden rounded-[2px] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.2)]">
              {book?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={book.imageUrl} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#5f79b5,#c6cde2)] px-4 text-center text-lg font-bold text-white sm:px-6 sm:text-xl md:px-8">
                  {book?.title ?? "اسم الكتاب"}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 rounded-xl bg-white px-4 py-5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:px-6 md:px-8">
            <h1 className="mb-5 text-right text-2xl font-bold text-[#0d6f95] sm:text-3xl md:text-4xl">
              {book?.title ?? "اسم الكتاب"}
            </h1>

            <div className="mb-5 flex flex-wrap justify-end gap-3 gap-y-2">
              <a
                href={book?.pdfUrl || "#"}
                target={book?.pdfUrl ? "_blank" : undefined}
                rel={book?.pdfUrl ? "noreferrer" : undefined}
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#f1f1f1] px-4 py-2 text-sm text-[#0d6f95] shadow sm:min-w-[10rem] sm:flex-none"
              >
                <ReadIcon className="size-4" />
                تصفح الكتاب
              </a>
              <a
                href={book?.pdfUrl || "#"}
                target={book?.pdfUrl ? "_blank" : undefined}
                rel={book?.pdfUrl ? "noreferrer" : undefined}
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#f1f1f1] px-4 py-2 text-sm text-[#0d6f95] shadow sm:min-w-[10rem] sm:flex-none"
              >
                <DownloadIcon className="size-4" />
                تحميل الكتاب
              </a>
            </div>

            <ul className="space-y-3 text-right text-base leading-8 text-[#0d6f95]">
              {detailLines.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5]">
        <FanDivider />
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#0d6f95] sm:mb-8 sm:text-3xl">
            منشورات ذات صلة
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((item) => (
              <article key={item.id}>
                <div className="overflow-hidden rounded-sm bg-white shadow-sm">
                  <div className="aspect-[4/3] bg-[#d7d7d7]">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-start justify-end bg-[radial-gradient(circle_at_top_left,_#c44_0%,_#8f2b1e_25%,_#7b5b2b_55%,_#2e2a1f_100%)] p-4 text-right text-2xl font-bold text-white">
                        {item.title}
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-right text-sm text-[#0d6f95]">{item.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 pt-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-right text-sm text-[#0d6f95]">أضف تعليقاً</p>
          <form className="space-y-5">
            <textarea
              className="h-40 w-full rounded-sm border-none bg-[#ededed] p-4 text-right text-[#0d6f95] outline-none"
            />
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="text"
                placeholder="الاسم"
                className="rounded-sm border-none bg-[#ededed] px-4 py-3 text-right text-[#0d6f95] outline-none"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="rounded-sm border-none bg-[#ededed] px-4 py-3 text-right text-[#0d6f95] outline-none"
              />
              <input
                type="text"
                placeholder="الموقع (اختياري)"
                className="rounded-sm border-none bg-[#ededed] px-4 py-3 text-right text-[#0d6f95] outline-none"
              />
            </div>
            <div className="text-right">
              <button
                type="button"
                className="inline-flex min-w-32 justify-center rounded-xl bg-[#f1f1f1] px-6 py-2 text-sm text-[#0d6f95] shadow"
              >
                نشر تعليقك
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FanDivider() {
  return (
    <div className="relative h-44 overflow-hidden">
      <div className="absolute inset-0 bg-[#f5f5f5]" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[#dfe8ee]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-8 bg-[#a6bfd0]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-14 bg-[#5d8aaa]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-20 bg-[#2d6b92]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-28 bg-[#045f84]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
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

function ReadIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
