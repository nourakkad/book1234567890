"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function DropdownArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

type GlobalContent = {
  nav?: {
    logoText?: string;
    home?: string;
    works?: string;
    about?: string;
    books?: string;
    articles?: string;
    videos?: string;
    thoughts?: string;
    contact?: string;
    audioBooks?: string;
    bookShow?: string;
    phenomenonAnalysis?: string;
    questions?: string;
  };
};

export default function Header() {
  const [content, setContent] = useState<GlobalContent | null>(null);

  useEffect(() => {
    void fetch("/api/content/global")
      .then((r) => r.json())
      .then((d) => setContent((d?.data ?? null) as GlobalContent))
      .catch(() => {
        // Keep static fallback labels if content API fails.
      });
  }, []);

  const nav = content?.nav;

  return (
    <header className="bg-[#05698e] text-white shadow-sm">
      <nav dir="ltr" className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-6">
        <Link href="/" className="shrink-0 text-sm font-semibold tracking-wide text-white">
          {nav?.logoText ?? "LOGO HERE"}
        </Link>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <button
            type="button"
            aria-label="بحث"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-[#05698e] shadow-sm transition hover:bg-white"
          >
            <SearchIcon />
          </button>
          <Link
            href="/questions"
            className="rounded-xl bg-white px-5 py-2 text-sm font-medium text-[#5b4a3b] shadow-md transition hover:bg-[#f7f3ee]"
          >
            {nav?.questions ?? "أسئلة وأجوبة"}
          </Link>
        </div>

        <div dir="rtl" className="hidden flex-1 items-center justify-end gap-5 text-sm lg:flex xl:gap-7">
          <Link href="/" className="transition hover:opacity-80">
            {nav?.home ?? "الصفحة الرئيسية"}
          </Link>
          <Link href="/works" className="flex items-center gap-1 transition hover:opacity-80">
            {nav?.works ?? "مؤلفاتي"}
            <DropdownArrowIcon />
          </Link>
          <Link href="/articles" className="transition hover:opacity-80">
            {nav?.articles ?? "المنشورات"}
          </Link>
          <Link href="/videos" className="transition hover:opacity-80">
            {nav?.videos ?? "الفيديوهات"}
          </Link>
          <Link href="/thoughts" className="transition hover:opacity-80">
            {nav?.thoughts ?? "خواطر"}
          </Link>
          <Link href="/contact" className="transition hover:opacity-80">
            {nav?.contact ?? "تواصل معنا"}
          </Link>
          <Link href="/audio-books" className="transition hover:opacity-80">
            {nav?.audioBooks ?? "الكتب الصوتية"}
          </Link>
          <Link href="/book-show" className="transition hover:opacity-80">
            {nav?.bookShow ?? "عرض الكتاب"}
          </Link>
          <Link href="/phenomenon-analysis" className="transition hover:opacity-80">
            {nav?.phenomenonAnalysis ?? "تحليل الظاهرة"}
          </Link>
        </div>

        <div className="mr-auto flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="بحث"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-[#05698e]"
          >
            <SearchIcon />
          </button>
          <Link
            href="/questions"
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#5b4a3b]"
          >
            {nav?.questions ?? "أسئلة وأجوبة"}
          </Link>
        </div>
      </nav>
      <div dir="rtl" className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 px-4 pb-3 text-xs text-white/90 lg:hidden">
        <Link href="/">{nav?.home ?? "الصفحة الرئيسية"}</Link>
        <Link href="/works">{nav?.works ?? "مؤلفاتي"}</Link>
        <Link href="/articles">{nav?.articles ?? "المنشورات"}</Link>
        <Link href="/videos">{nav?.videos ?? "الفيديوهات"}</Link>
        <Link href="/thoughts">{nav?.thoughts ?? "خواطر"}</Link>
        <Link href="/contact">{nav?.contact ?? "تواصل معنا"}</Link>
        <Link href="/audio-books">{nav?.audioBooks ?? "الكتب الصوتية"}</Link>
        <Link href="/book-show">{nav?.bookShow ?? "عرض الكتاب"}</Link>
        <Link href="/phenomenon-analysis">{nav?.phenomenonAnalysis ?? "تحليل الظاهرة"}</Link>
      </div>
    </header>
  );
}
