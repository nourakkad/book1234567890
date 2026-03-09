"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type AboutContent = {
  badge?: string;
  title?: string;
  intro?: string;
  authorImageUrl?: string;
  stats?: Array<{ value: string; label: string }>;
  roleParagraphs?: string[];
};

export default function AboutWriterPage() {
  const aboutContent = useContentBySlug<AboutContent>("about", {
    badge: "روائي وكاتب معاصر",
    title: "نبذة عنيّ",
    intro:
      "بدأت رحلتي مع الكتابة في سن مبكرة، حيث وجدت في الكلمات ملاذاً وطريقة لاستكشاف العالم من حولي. على مدار العقدين الماضيين، نشرت العديد من الروايات والقصص القصيرة التي لاقت صدى واسعاً لدى القراء.",
    authorImageUrl: "",
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* About Me — image left floating on bg, content right */}
      {/* dir="ltr" so image stays LEFT and text stays RIGHT visually */}
      <section className="relative bg-white min-h-[85vh]" dir="ltr">
        <div className="mx-auto flex max-w-6xl h-full flex-col md:flex-row md:items-stretch">

          {/* Author image — LEFT */}
          <div className="relative flex-shrink-0 self-end md:w-[40%]">
            <div
              className="relative mx-auto w-64 md:w-full"
              style={{ aspectRatio: "3/4" }}
            >
              {aboutContent.authorImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={aboutContent.authorImageUrl}
                  alt="صورة الكاتب"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#1e3a5f]/30 text-sm">
                  صورة الكاتب
                </div>
              )}
            </div>
          </div>

          {/* Text — RIGHT, restore rtl for Arabic content */}
          <div className="flex flex-1 flex-col justify-center px-4 pb-12 pt-8 text-right sm:px-6 sm:pb-16 sm:pt-12 md:px-16 md:py-24" dir="rtl">

            {/* Pill badge */}
            <div className="mb-8 flex justify-start">
              <span className="rounded-full border border-[#ccc5bb] bg-white/70 px-6 py-2 text-sm text-[#1e3a5f]">
                {aboutContent.badge ?? "روائي وكاتب معاصر"}
              </span>
            </div>

            <h1 className="mb-5 text-3xl font-bold text-[#1e3a5f] leading-snug sm:mb-7 sm:text-4xl md:text-5xl">
              {aboutContent.title ?? "نبذة عنيّ"}
            </h1>

            <p className="leading-loose text-[#1e3a5f]/85">
              {aboutContent.intro ??
                "بدأت رحلتي مع الكتابة في سن مبكرة، حيث وجدت في الكلمات ملاذاً وطريقة لاستكشاف العالم من حولي."}
            </p>

          </div>
        </div>
      </section>

      {/* Scroll-to-top — fixed bottom-RIGHT */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#1e3a5f] text-white shadow-lg transition hover:bg-[#2c5282] sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
        aria-label="العودة للأعلى"
      >
        <ArrowUpIcon />
      </button>

      {/* Statistics and writer role */}
      <section className="bg-[#f5f3ef] px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Use ltr here so we can control left/right visually regardless of page dir */}
          <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16" dir="ltr">

            {/* Stat cards — visually LEFT */}
            <div className="flex w-full shrink-0 flex-col gap-4 md:w-72">
              {(aboutContent.stats && aboutContent.stats.length > 0
                ? aboutContent.stats
                : [
                    { value: "+ 10 K", label: "قارئ" },
                    { value: "+ 14", label: "منشور" },
                    { value: "+ 3", label: "جوائز" },
                  ]).map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-end gap-3 rounded-2xl border border-[#d6cfc4] bg-white px-4 py-3 sm:gap-4 sm:px-5 sm:py-4"
                >
                  {/* Number + label — visually to the left of icon */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#1e3a5f]">{stat.value}</div>
                    <div className="text-sm text-[#1e3a5f]/60">{stat.label}</div>
                  </div>
                  {/* Icon circle — visually RIGHT inside card */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-white">
                    {i === 0 ? <UsersIcon /> : i === 1 ? <BookIcon /> : <MedalIcon />}
                  </div>
                </div>
              ))}
            </div>

            {/* Description text — visually RIGHT */}
            <div className="max-w-md text-right" dir="rtl">
              {(aboutContent.roleParagraphs && aboutContent.roleParagraphs.length > 0
                ? aboutContent.roleParagraphs
                : [
                    "الكاتب هو شخص يعبّر عن أفكاره ومشاعره من خلال الكلمة المكتوبة بأسلوب منظم ومؤثر.",
                    "يساهم في نشر المعرفة والثقافة ونقل التجارب الإنسانية بين الأجيال.",
                    "يمتلك مهارات لغوية وخيالاً واسعاً وقدرة على التحليل والتأمل.",
                    "ويؤدّي دوره مهماً في توعية المجتمع وإلهام القراء وصناعة التغيير.",
                  ]).map((line, idx) => (
                <p key={idx} className="mb-2 leading-loose text-[#1e3a5f]">
                  {line}
                </p>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
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

function UsersIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 15c3.866 0 7-3.224 7-7s-3.134-7-7-7-7 3.224-7 7 3.134 7 7 7z" />
      <path d="M12 22v-4" />
      <path d="M8 18l2 2 2-2 2 2" />
      <path d="M12 2v2" />
    </svg>
  );
}

