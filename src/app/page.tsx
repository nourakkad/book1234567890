"use client";

import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

const BOOKS = [
  { id: 1, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب", imageUrl: "", pdfUrl: "" },
  { id: 2, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب", imageUrl: "", pdfUrl: "" },
  { id: 3, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب", imageUrl: "", pdfUrl: "" },
  { id: 4, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب", imageUrl: "", pdfUrl: "" },
  { id: 5, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب", imageUrl: "", pdfUrl: "" },
];

type HomeContent = {
  heroTitle?: string;
  heroText?: string;
  articlesTitle?: string;
  thoughtsTitle?: string;
  videosTitle?: string;
  featuredBooksTitle?: string;
};

type BookItem = { id: number; title: string; category: string; desc: string; imageUrl?: string; pdfUrl?: string };
type BooksContent = {
  sectionTitle?: string;
  bookItems?: BookItem[];
};
type ArticleItem = {
  title?: string;
  date?: string;
  secondaryTitle?: string;
  imageUrl?: string;
};
type ArticlesContent = {
  items?: Record<string, ArticleItem>;
};
type SimpleContent = {
  title?: string;
  description?: string;
};

export default function Home() {
  const homeContent = useContentBySlug<HomeContent>("home", {
    heroTitle: "مرحباً بك في موقع الباحث سامر اسمويل",
    heroText:
      "موقع يهتم بنشر العلم والمعرفة في قالب مميز وقديم مؤثر قابل للتطبيق، بغرض إيصال المعلومة وفهمها مع الالتزام بأصول العمل، والأخذ من التراث الفكري العربي والإسلامي، والانفتاح من خلال فهم العلم والأخلاق أساس التنمية والعمران.",
    articlesTitle: "أحدث المقالات",
    thoughtsTitle: "أحدث الخواطر",
    videosTitle: "أحدث الفيديوهات",
    featuredBooksTitle: "أبرز كتب الباحث سامر اسمويل",
  });
  const booksContent = useContentBySlug<BooksContent>("books", {
    sectionTitle: "أبرز كتب الباحث سامر اسمويل",
    bookItems: BOOKS,
  });
  const articlesContent = useContentBySlug<ArticlesContent>("articles", {
    items: {},
  });
  const thoughtsContent = useContentBySlug<SimpleContent>("thoughts", {
    title: "أحدث الخواطر",
    description:
      "النزوة والعيب، عندما يكون العمل وتضيع الآمال ولا يوجد الإنسان فيصير بعد مضي سنوات عديدة، وعي الإنسان ذاته كاتباً له لا فقط بداية ليروق، ولكن همم القراءة لا تظهر، بينما النزاع أمامك ويحولك كبرك وهو النمو والنور والعلم يزكو بعقله ويسعد بروحه وحياته.",
  });
  const videosContent = useContentBySlug<SimpleContent>("videos", {
    title: "أحدث الفيديوهات",
    description: "عنوان الفيديو عنوان الفيديو عنوان الفيديو",
  });

  const rawArticles = Object.entries(articlesContent.items ?? {}).sort(([a], [b]) => Number(a) - Number(b));
  const articleCards = Array.from({ length: 6 }, (_, index) => {
    const current = rawArticles[index % Math.max(rawArticles.length, 1)]?.[1];
    return {
      id: index + 1,
      title: current?.title ?? "منشورات قرآنية",
      imageUrl: current?.imageUrl ?? "",
      author: "قصة النبي يوسف",
    };
  });
  const thoughtCards = Array.from({ length: 3 }, (_, index) => ({
    id: index + 1,
    text:
      thoughtsContent.description ??
      "النزوة والعيب، عندما يكون العمل وتضيع الآمال ولا يوجد الإنسان فيصير بعد مضي سنوات عديدة، وعي الإنسان ذاته كاتباً له لا فقط بداية ليروق، ولكن همم القراءة لا تظهر، بينما النزاع أمامك ويحولك كبرك وهو النمو والنور والعلم يزكو بعقله ويسعد بروحه وحياته.",
  }));
  const videoCards = Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    title: videosContent.description ?? "عنوان الفيديو عنوان الفيديو عنوان الفيديو",
  }));
  const featuredBooks = (booksContent.bookItems && booksContent.bookItems.length > 0 ? booksContent.bookItems : BOOKS).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <Header />

      <section className="bg-[#e8e8e8]">
        <div className="mx-auto h-[340px] max-w-7xl sm:h-[420px] lg:h-[500px]" />
      </section>

      <section className="relative overflow-hidden bg-[#05698e] px-6 pb-24 pt-10 text-center text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-3 text-2xl font-bold md:text-3xl">
            {homeContent.heroTitle ?? "مرحباً بك في موقع الباحث سامر اسمويل"}
          </h1>
          <p className="mx-auto max-w-5xl text-sm leading-8 text-white/95 md:text-base">
            {homeContent.heroText ??
              "موقع يهتم بنشر العلم والمعرفة في قالب مميز وقديم مؤثر قابل للتطبيق، بغرض إيصال المعلومة وفهمها مع الالتزام بأصول العمل، والأخذ من التراث الفكري العربي والإسلامي، والانفتاح من خلال فهم العلم والأخلاق أساس التنمية والعمران."}
          </p>
        </div>
        <LayeredWave />
      </section>

      <section className="bg-[#f6f6f6] px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionTitle>{homeContent.articlesTitle ?? "أحدث المقالات"}</SectionTitle>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articleCards.map((article) => (
              <article key={article.id}>
                <div className="overflow-hidden rounded-sm bg-white shadow-sm">
                  <div className="aspect-[4/3] bg-[#d7d7d7]">
                    {article.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-start justify-end bg-[radial-gradient(circle_at_top_left,_#c44_0%,_#8f2b1e_25%,_#7b5b2b_55%,_#2e2a1f_100%)] p-4 text-right text-2xl font-bold text-white">
                        {article.title}
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-right text-sm text-[#0d6f95]">{article.author}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/articles" className="inline-flex min-w-32 justify-center rounded-xl bg-white px-8 py-2 text-sm text-[#0d6f95] shadow">
              جميع المقالات
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f6f6] px-5 pb-0 pt-4">
        <div className="mx-auto max-w-6xl">
          <SectionTitle>{homeContent.thoughtsTitle ?? thoughtsContent.title ?? "أحدث الخواطر"}</SectionTitle>
          <div className="grid gap-5 md:grid-cols-3">
            {thoughtCards.map((item) => (
              <article key={item.id} className="rounded-lg bg-white p-6 text-right shadow-md">
                <p className="text-base leading-8 text-[#0f6b8e]">{item.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/thoughts" className="inline-flex min-w-32 justify-center rounded-xl bg-white px-8 py-2 text-sm text-[#0d6f95] shadow">
              جميع الخواطر
            </Link>
          </div>
        </div>
        <FanDivider />
      </section>

      <section className="bg-[#f6f6f6] px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionTitle>{homeContent.videosTitle ?? videosContent.title ?? "أحدث الفيديوهات"}</SectionTitle>
          <div className="grid gap-5 md:grid-cols-2">
            {videoCards.map((item) => (
              <article key={item.id} className="overflow-hidden bg-[#dddddd] shadow-sm">
                <div className="flex items-center justify-between px-3 pt-3 text-[#0d6f95]">
                  <div className="flex items-center gap-2 text-xs">
                    <ShareIcon />
                    <span>مشاركة فعالة</span>
                  </div>
                  <div className="h-4 w-4 rounded-full bg-black" />
                </div>
                <p className="px-4 pb-2 pt-1 text-right text-sm font-medium text-[#0d6f95]">
                  {item.title}
                </p>
                <div className="flex aspect-[16/9] items-center justify-center">
                  <PlayIcon />
                </div>
                <div className="flex justify-end px-3 pb-3">
                  <span className="rounded bg-[#7b8ca0] px-2 py-1 text-[10px] text-white">مشاهدة على اليوتيوب</span>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              type="button"
              className="inline-flex min-w-32 justify-center rounded-xl bg-white px-8 py-2 text-sm text-[#0d6f95] shadow"
            >
              التالي
            </button>
            <div className="mt-1 text-xs text-[#0d6f95]/70">السابق</div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f6f6]">
        <div className="h-10 bg-[#045f84]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
      </section>

      <section className="bg-[#f6f6f6] px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionTitle>{homeContent.featuredBooksTitle ?? booksContent.sectionTitle ?? "أبرز كتب الباحث سامر اسمويل"}</SectionTitle>
          <div className="relative flex items-center justify-center gap-6 overflow-hidden px-8">
            <button type="button" aria-label="السابق" className="absolute right-0 text-2xl text-[#0d6f95]">
              ›
            </button>
            <div className="flex flex-wrap items-end justify-center gap-6">
              {featuredBooks.map((book, index) => (
                <Link key={book.id} href={`/books/${book.id}`} className="block">
                  <div className={`w-28 md:w-36 ${index % 2 === 0 ? "translate-y-2" : ""}`}>
                    <div className="aspect-[3/4] overflow-hidden bg-white shadow-md">
                      {book.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={book.imageUrl} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#3d8b6e,#1f3f66)] text-center text-sm font-bold text-white">
                          {book.title}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button type="button" aria-label="التالي" className="absolute left-0 text-2xl text-[#0d6f95]">
              ‹
            </button>
          </div>
          <div className="mt-8 text-center">
            <Link href="/books" className="inline-flex min-w-32 justify-center rounded-xl bg-white px-8 py-2 text-sm text-[#0d6f95] shadow">
              جميع الكتب
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-8 text-center text-3xl font-bold text-[#0d6f95]">
      {children}
    </h2>
  );
}

function LayeredWave() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 overflow-hidden">
      <div className="absolute inset-x-[-8%] bottom-10 h-20 rounded-[100%] bg-[#0c5f84]" />
      <div className="absolute inset-x-[-12%] bottom-4 h-24 rounded-[100%] bg-[#176f95]" />
      <div className="absolute inset-x-[-10%] bottom-[-18px] h-24 rounded-[100%] bg-[#3b87ab]" />
      <div className="absolute inset-x-[-6%] bottom-[-40px] h-24 rounded-[100%] bg-[#6ea6c2]" />
    </div>
  );
}

function FanDivider() {
  return (
    <div className="relative mt-10 h-44 overflow-hidden">
      <div className="absolute inset-0 bg-[#f6f6f6]" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[#dfe8ee]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-8 bg-[#a6bfd0]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-14 bg-[#5d8aaa]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-20 bg-[#2d6b92]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-28 bg-[#045f84]" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)" }} />
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

