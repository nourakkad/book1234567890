"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useHeroImages } from "./useHeroImages";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

const BOOKS = [
  { id: 1, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", imageUrl: "", pdfUrl: "" },
  { id: 2, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", imageUrl: "", pdfUrl: "" },
  { id: 3, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", imageUrl: "", pdfUrl: "" },
  { id: 4, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", imageUrl: "", pdfUrl: "" },
  { id: 5, title: "اسم الكتاب", category: "ثقافية", desc: "وصف بسيط عن الكتاب وصف بسيط عن الكتاب وصف بسيط عن الكتاب", imageUrl: "", pdfUrl: "" },
];

type HomeContent = {
  heroBadge: string;
  heroTitle: string;
  heroText: string;
  heroSubtext?: string;
  ctaTitle: string;
  ctaSubtitle: string;
  aboutTitle?: string;
  aboutText?: string;
  aboutImageUrl?: string;
};

type ReviewItem = { text: string; likes: number; dislikes: number };
type BookItem = { id: number; title: string; category: string; desc: string; imageUrl?: string; pdfUrl?: string };
type BooksContent = {
  sectionTitle?: string;
  reviewsTitle?: string;
  bookItems?: BookItem[];
  reviews?: ReviewItem[];
};
type AboutContent = {
  stats?: Array<{ value: string; label: string }>;
  roleParagraphs?: string[];
};

export default function Home() {
  const { parchment1, parchment2, parchment3, parchment4 } = useHeroImages();
  const [activeBook, setActiveBook] = useState(2);
  const homeContent = useContentBySlug<HomeContent>("home", {
    heroBadge: "روائي وكاتب معاصر",
    heroTitle: "مرحباً بكم في عالم الأدب والإبداع",
    heroText: "استكشف مجموعة من الكتب والروايات التي تأخذك في رحلة عبر العواطف الإنسانية والتجارب الثقافية",
    heroSubtext: "كل كتاب هو نافذة على العالم",
    ctaTitle: "اكتشف مجموعتي من الروايات والكتب",
    ctaSubtitle: "يمكنك قراءة كل كتاب مباشرة أو تحميله بصيغة PDF في أي وقت",
    aboutTitle: "نبذة عنيّ",
    aboutText:
      "بدأت رحلتي مع الكتابة في سن مبكرة، حيث وجدت في الكلمات ملاذاً وطريقة لاستكشاف العالم من حولي. على مدار العقدين الماضيين، نشرت العديد من الروايات والقصص القصيرة التي لاقت صدى واسعاً لدى القراء.",
    aboutImageUrl: "",
  });
  const booksContent = useContentBySlug<BooksContent>("books", {
    sectionTitle: "الكتب الأكثر قراءة",
    reviewsTitle: "ماذا يقول القراء؟",
    bookItems: BOOKS,
    reviews: [],
  });
  const carouselBooks = booksContent.bookItems && booksContent.bookItems.length > 0 ? booksContent.bookItems : BOOKS;
  const safeActiveBook = carouselBooks.length > 0 ? activeBook % carouselBooks.length : 0;
  const aboutContent = useContentBySlug<AboutContent>("about", {
    stats: [
      { value: "+ 10 K", label: "قارئ" },
      { value: "+ 14", label: "منشور" },
      { value: "+ 3", label: "جوائز" },
    ],
    roleParagraphs: [
      "الكاتب هو شخص يعبّر عن أفكاره ومشاعره من خلال الكلمة المكتوبة بأسلوب منظم ومؤثر.",
      "يساهم في نشر المعرفة والثقافة ونقل التجارب الإنسانية بين الأجيال.",
      "يمتلك مهارات لغوية وخيالاً واسعاً وقدرة على التحليل والتأمل.",
      "ويؤدّي دوره مهماً في توعية المجتمع وإلهام القراء وصناعة التغيير.",
    ],
  });

  const prevBook = useCallback(() =>
    setActiveBook((i) => (i > 0 ? i - 1 : carouselBooks.length - 1)), [carouselBooks.length]);
  const nextBook = useCallback(() =>
    setActiveBook((i) => (i < carouselBooks.length - 1 ? i + 1 : 0)), [carouselBooks.length]);

  return (
    <div
      className="min-h-screen bg-[#faf8f5]"
      style={{
        backgroundImage: `url(${parchment2})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />

      {/* Hero — parchment image with natural torn edges */}
      <section className="relative px-4 pb-16 pt-8 md:px-8 md:pb-20 md:pt-10">
        {/* Top-left: show full image, anchor top-left, natural size via width */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={parchment1}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-[20] w-[22vw] max-w-[200px] min-w-[80px] select-none opacity-95"
          style={{ display: "block", transform: "rotate(-35deg)", transformOrigin: "top left" }}
        />

        {/* Bottom-right: same image, flip horizontally + vertically to sit in bottom-right corner */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={parchment4}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 z-[20] w-[22vw] max-w-[200px] min-w-[80px] select-none opacity-95"
          style={{ display: "block", transform: "rotate(35deg)", transformOrigin: "bottom right" }}
        />

        {/* Parchment hero box — image is the shape, grows on large screens */}
        {/* z-[10]: above page background, below decorative pieces on mobile, above them on md+ */}
        <div className="relative z-[10] mx-auto max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
          <div
            className="relative"
            style={{
              backgroundImage: `url(${parchment3})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              padding: "clamp(40px, 6vw, 90px) clamp(50px, 8vw, 120px)",
            }}
          >
            {/* Text and buttons always on top — z-[30] */}
            <div className="relative z-[30] flex flex-col items-center text-center">
              <span className="mb-5 inline-block rounded-full border border-[#8b7355]/40 bg-[#f5f0e8]/90 px-5 py-1.5 text-sm font-medium text-[#3d3020] shadow-sm">
                {homeContent.heroBadge}
              </span>
              <h1 className="mb-4 text-3xl font-bold text-[#2c2010] md:text-4xl lg:text-5xl lg:leading-snug xl:text-6xl">
                {homeContent.heroTitle}
              </h1>
              <p className="mb-2 max-w-xl text-base text-[#3d3020]/90 md:text-lg lg:max-w-2xl lg:text-xl">
                {homeContent.heroText}
              </p>
              <p className="mb-8 text-sm text-[#3d3020]/70 md:text-base">
                {homeContent.heroSubtext ?? "كل كتاب هو نافذة على العالم"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/books"
                  className="rounded-lg bg-[#1e3a5f] px-7 py-3 font-medium text-white transition hover:bg-[#2c5282]"
                >
                  تصفح الكتب
                </Link>
                <Link
                  href="/about"
                  className="rounded-lg border-2 border-[#1e3a5f] bg-white/70 px-7 py-3 font-medium text-[#1e3a5f] transition hover:bg-white"
                >
                  تعرف علي
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll-to-top button */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#1e3a5f] text-white shadow-lg transition hover:bg-[#2c5282]"
          aria-label="العودة للأعلى"
        >
          <ArrowUpIcon />
        </button>
      </section>

      {/* About Me — navy card with author image overflowing above */}
      <section className="bg-[#faf8f5] px-4 pb-16 md:px-8 md:pb-20">
        <div className="mx-auto max-w-5xl">
          {/* pt-28 reserves space so the absolute image can overflow above the card */}
          <div className="relative pt-28 md:pt-32">
            {/* Author image — absolute, top-0 of wrapper = overflows above the card */}
            <div className="absolute left-0 top-0 z-10 w-44 md:w-56 lg:w-64">
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-[#c8d8e8]">
                {homeContent.aboutImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={homeContent.aboutImageUrl}
                    alt="صورة الكاتب"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#1e3a5f]/40 text-sm">
                    صورة الكاتب
                  </div>
                )}
              </div>
            </div>

            {/* Navy card — pl keeps text clear of the image */}
            <div className="rounded-2xl bg-[#1e3a5f] py-10 pr-8 pl-48 md:py-12 md:pr-12 md:pl-64 lg:pl-72">
              <h2 className="mb-5 text-right text-3xl font-bold text-white md:text-4xl">
                {homeContent.aboutTitle ?? "نبذة عنيّ"}
              </h2>
              <p className="text-right leading-relaxed text-white/90">
                {homeContent.aboutText ??
                  "بدأت رحلتي مع الكتابة في سن مبكرة، حيث وجدت في الكلمات ملاذاً وطريقة لاستكشاف العالم من حولي."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Books CTA */}
      <section className="bg-[#faf8f5] px-4 pb-20 pt-4 md:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#d6cfc4] bg-[#f0ebe2] px-8 py-12 text-center shadow-sm">
          <p className="mb-2 text-xl font-bold text-[#1e3a5f]">
            {homeContent.ctaTitle}
          </p>
          <p className="mb-8 text-[#1e3a5f]/75">
            {homeContent.ctaSubtitle}
          </p>
          <Link
            href="/books"
            className="inline-block rounded-lg bg-[#1e3a5f] px-12 py-3 font-medium text-white transition hover:bg-[#2c5282]"
          >
            رؤية الكل
          </Link>
        </div>
      </section>

      {/* Most Read Books — spotlight carousel */}
      <section className="overflow-hidden bg-white py-16">
        <div className="mx-auto mb-10 flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
          <h2 className="text-2xl font-bold text-[#1e3a5f]">{booksContent.sectionTitle ?? "الكتب الأكثر قراءة"}</h2>
          <Link href="/books" className="text-[#1e3a5f] underline hover:no-underline">
            رؤية الكل
          </Link>
        </div>

        {/* Carousel track — overflow visible so side cards peek out */}
        <div className="relative flex items-center justify-center">
          {/* Prev arrow */}
          <button
            type="button"
            onClick={prevBook}
            aria-label="السابق"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-[#e5e0d8] text-[#1e3a5f] transition hover:bg-[#f5f0e8] md:right-8"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Cards — always 5 slots, book resolved via modulo for infinite loop */}
          <div className="flex items-end justify-center gap-4 px-16">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const index = ((safeActiveBook + offset) % carouselBooks.length + carouselBooks.length) % carouselBooks.length;
              const book = carouselBooks[index];
              const absOffset = Math.abs(offset);

              const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.87 : 0.75;
              const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.85 : 0.6;
              const zIndex = 30 - absOffset * 10;

              return (
                <article
                  key={`slot-${offset}`}
                  onClick={() => setActiveBook(index)}
                  style={{
                    transform: `scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: "transform 0.4s ease, opacity 0.4s ease",
                    transformOrigin: "bottom center",
                  }}
                  className="w-52 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-[#e5e0d8] bg-white shadow-md md:w-60"
                >
                  {/* Book cover */}
                  <div className="aspect-[4/5] bg-[#e0dbd2]">
                    {book.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={book.imageUrl} alt={book.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#1e3a5f]/40 text-xs">
                        غلاف الكتاب
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    {/* Icons + title row */}
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <div className="flex gap-2 text-[#1e3a5f]/60">
                        <button type="button" aria-label="حفظ">
                          <BookmarkIcon />
                        </button>
                        <button type="button" aria-label="إعجاب">
                          <HeartIcon />
                        </button>
                      </div>
                      <h3 className="text-right font-bold text-[#1e3a5f]">{book.title}</h3>
                    </div>
                    <p className="mb-2 text-right text-xs text-[#1e3a5f]/50">{book.category}</p>
                    <p className="mb-4 text-right text-sm leading-relaxed text-[#1e3a5f]/70 line-clamp-3">
                      {book.desc}
                    </p>
                    <a
                      href={book.pdfUrl || "#"}
                      target={book.pdfUrl ? "_blank" : undefined}
                      rel={book.pdfUrl ? "noreferrer" : undefined}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1e3a5f]/20 py-2 text-sm text-[#1e3a5f] transition hover:bg-[#f5f0e8]"
                    >
                      <DownloadIcon />
                      تحميل
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Next arrow */}
          <button
            type="button"
            onClick={nextBook}
            aria-label="التالي"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-[#e5e0d8] text-[#1e3a5f] transition hover:bg-[#f5f0e8] md:left-8"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {carouselBooks.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveBook(i)}
              aria-label={`الكتاب ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === safeActiveBook ? "w-6 bg-[#1e3a5f]" : "w-2 bg-[#1e3a5f]/25"
              }`}
            />
          ))}
        </div>
      </section>

      {/* What Do Readers Say */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">{booksContent.reviewsTitle ?? "ماذا يقول القراء؟"}</h2>
            <Link href="/reviews" className="text-[#1e3a5f] underline hover:no-underline">
              رؤية الكل
            </Link>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4">
            {(booksContent.reviews && booksContent.reviews.length > 0 ? booksContent.reviews : [
              { text: "قرأت جميع الكتب، وكل واحد يقدم منظور فريد عن الحياة والثقافة", likes: 100, dislikes: 100 },
              { text: "تجربة رائعة مع مجموعة الكتب، أسلوب الكاتب سلس ومشوّق جداً", likes: 85, dislikes: 12 },
              { text: "أسلوب الكاتب مميز ويستحق المتابعة، أنصح بقراءة جميع أعماله", likes: 74, dislikes: 8 },
            ]).map((review, i) => (
              <div
                key={i}
                className="relative min-w-[280px] max-w-[300px] flex-shrink-0 rounded-2xl bg-[#eeeae4] px-7 py-6"
              >
                {/* Large quote mark — top right */}
                <div className="mb-4 text-right">
                  <svg width="38" height="30" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 30V18.75C0 13.75 1.375 9.625 4.125 6.375C6.875 3.125 10.625 1 15.375 0L17.25 3.375C14.875 4.125 12.875 5.5 11.25 7.5C9.625 9.5 8.75 11.75 8.625 14.25H15.75V30H0ZM21.75 30V18.75C21.75 13.75 23.125 9.625 25.875 6.375C28.625 3.125 32.375 1 37.125 0L39 3.375C36.625 4.125 34.625 5.5 33 7.5C31.375 9.5 30.5 11.75 30.375 14.25H37.5V30H21.75Z" fill="#1e3a5f"/>
                  </svg>
                </div>

                {/* Quote text — centered */}
                <p className="mb-6 text-center text-[#1e3a5f] leading-relaxed">
                  {review.text}
                </p>

                {/* Like / Dislike — right-aligned, like on right, dislike on left */}
                <div className="flex items-center justify-end gap-6">
                  {/* Dislike */}
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[#1e3a5f]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 14V2" /><path d="M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-.88z" />
                    </svg>
                    {review.dislikes}
                  </span>
                  {/* Like */}
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[#1e3a5f]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Author Stats */}
      <section className="relative overflow-hidden bg-[#f5f0e8] px-6 py-16 md:py-20">
        {/* parchment-1 decoration — right edge */}
        {parchment1 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={parchment1}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-full w-48 select-none object-cover object-left opacity-40 md:w-64"
          />
        )}

        <div className="relative mx-auto flex max-w-5xl flex-col gap-12 md:flex-row md:items-center md:justify-between">
          {/* Text — first = appears on right in RTL */}
          <div className="max-w-lg text-right">
            {(aboutContent.roleParagraphs && aboutContent.roleParagraphs.length > 0
              ? aboutContent.roleParagraphs
              : [
                  "الكاتب هو شخص يعبّر عن أفكاره ومشاعره من خلال الكلمة المكتوبة بأسلوب منظم ومؤثر.",
                  "يساهم في نشر المعرفة والثقافة ونقل التجارب الإنسانية بين الأجيال.",
                  "يمتلك مهارات لغوية وخيالاً واسعاً وقدرة على التحليل والتأمل.",
                  "ويؤدّي دوره مهماً في توعية المجتمع وإلهام القراء وصناعة التغيير.",
                ]).map((line, idx) => (
              <p key={idx} className="leading-loose text-[#1e3a5f]">
                {line}
              </p>
            ))}
          </div>

          {/* Stat cards — second = appears on left in RTL */}
          <div className="flex w-full flex-col gap-4 md:w-72">
            {(aboutContent.stats && aboutContent.stats.length > 0
              ? aboutContent.stats
              : [
                  { value: "+ 10 K", label: "قارئ" },
                  { value: "+ 14", label: "منشور" },
                  { value: "+ 3", label: "جوائز" },
                ]).map((stat, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-[#d6cfc4] bg-white px-5 py-4"
              >
                {/* Icon circle — first = right in RTL */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-white">
                  {i === 0 ? <UsersIcon /> : i === 1 ? <BookIcon /> : <AwardIcon />}
                </div>
                {/* Number + label — second = left in RTL */}
                <div className="text-right">
                  <div className="text-xl font-bold text-[#1e3a5f]">{stat.value}</div>
                  <div className="text-sm text-[#1e3a5f]/60">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
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

function AwardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

