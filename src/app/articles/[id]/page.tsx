"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type ArticleItem = {
  title: string;
  date: string;
  secondaryTitle: string;
  imageUrl?: string;
  secondaryImageUrl?: string;
};

const FALLBACK_ARTICLES: Record<string, ArticleItem> = {
  "1": {
    title: "عنوان المقال 1",
    date: "1-1-2025",
    secondaryTitle: "كتابة الكلية رحلة العمرة إلى الداري",
    imageUrl: "",
    secondaryImageUrl: "",
  },
  "2": {
    title: "عنوان المقال 2",
    date: "1-1-2026",
    secondaryTitle: "كتابة الكتب رحلة الفكرة إلى القاري",
    imageUrl: "",
    secondaryImageUrl: "",
  },
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) ?? "1";
  const [articles, setArticles] = useState<Record<string, ArticleItem>>(FALLBACK_ARTICLES);
  const articleIds = useMemo(() => Object.keys(articles), [articles]);
  const total = articleIds.length;
  const article = articles[id] ?? articles[articleIds[0] ?? "1"];
  const currentIndex = Math.max(0, articleIds.indexOf(id));

  useEffect(() => {
    void fetch("/api/content/articles")
      .then((r) => r.json())
      .then((d) => {
        const items = d?.data?.items as Record<string, ArticleItem> | undefined;
        if (items && typeof items === "object" && Object.keys(items).length > 0) {
          setArticles(items);
        }
      })
      .catch(() => {
        // Keep fallback content if DB fetch fails.
      });
  }, []);

  function goTo(index: number) {
    const targetId = articleIds[index];
    if (targetId) router.push(`/articles/${targetId}`);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - light gray */}
      <Header />

      {/* Article header: title, date, thumbs */}
      <section className="border-b border-[#e5e0d8] bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-[#1e3a5f] md:text-4xl">
                {article.title}
              </h1>
              <p className="text-[#1e3a5f]/80">{article.date}</p>
            </div>
            <div className="flex items-center gap-4 text-[#1e3a5f]">
              <span className="flex items-center gap-1">
                <ThumbsUpIcon /> 9100
              </span>
              <span className="flex items-center gap-1">
                <ThumbsDownIcon /> 0
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main article content: image left, text right (RTL so image is on right in layout) */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#e5e0d8]">
                {article.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#1e3a5f]/50 text-sm">
                    صورة المقال
                  </div>
                )}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="leading-relaxed text-[#1e3a5f]">
                الكتابة رحلة من الفكرة إلى القارئ، ومن التجربة إلى الكلمة. نستكشف
                من خلال الكتب عالم المعرفة والثقافة، ونتشارك الأفكار والمشاعر
                عبر السطور. كل مقال وكل كتاب يفتح نافذة على حياة أخرى، ويساهم
                في إثراء الفكر الإنساني وبناء جسور بين الثقافات.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary section: text left, image right */}
      <section className="bg-[#faf8f5] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-4 text-xl font-bold text-[#1e3a5f]">
                {article.secondaryTitle}
              </h2>
              <p className="mb-6 leading-relaxed text-[#1e3a5f]">
                رحلة الكتابة تبدأ بفكرة وتنتهي عند القارئ. ننسج الكلمات لنقل
                التجارب والمعارف، ونساهم في نشر الثقافة وتوثيق الإبداع الإنساني.
                كل قلم يترك أثراً، وكل كتاب يبني جسراً بين الماضي والحاضر
                والمستقبل.
              </p>
              {/* Article navigation slider */}
              <div className="flex items-center gap-2" dir="ltr">
                <button
                  type="button"
                  disabled={currentIndex <= 0}
                  onClick={() => goTo(currentIndex - 1)}
                  aria-label="المقال السابق"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e0d8] bg-white text-[#1e3a5f] transition hover:bg-[#f5f0e8] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {articleIds.map((aid, idx) => (
                  <button
                    key={aid}
                    type="button"
                    onClick={() => goTo(idx)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition ${
                      idx === currentIndex
                        ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                        : "border-[#e5e0d8] bg-white text-[#1e3a5f] hover:bg-[#f5f0e8]"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentIndex >= total - 1}
                  onClick={() => goTo(currentIndex + 1)}
                  aria-label="المقال التالي"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e0d8] bg-white text-[#1e3a5f] transition hover:bg-[#f5f0e8] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#e5e0d8]">
                {article.secondaryImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.secondaryImageUrl}
                    alt={article.secondaryTitle}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#1e3a5f]/50 text-sm">
                    صورة ثانوية
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function ThumbsUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function ThumbsDownIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
  );
}

