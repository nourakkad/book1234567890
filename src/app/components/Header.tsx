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
    home?: string;
    about?: string;
    books?: string;
    articles?: string;
    articleItems?: Array<{ id: string; label: string }>;
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
  const articleItems = nav?.articleItems ?? [
    { id: "1", label: "عنوان المقال 1" },
    { id: "2", label: "عنوان المقال 2" },
  ];

  return (
    <header className="px-6 py-4">
      <nav className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between rounded-full border border-[#d0c9bf] bg-white/80 px-6 py-3 shadow-sm backdrop-blur-sm">

          {/* Left end: search icon */}
          <button
            type="button"
            aria-label="بحث"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-white transition hover:bg-[#2c5282]"
          >
            <SearchIcon />
          </button>

          {/* Right side: nav links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="font-semibold text-[#1e3a5f] transition hover:opacity-70">
              {nav?.home ?? "الرئيسية"}
            </Link>
            <Link href="/about" className="text-[#1e3a5f] transition hover:opacity-70">
              {nav?.about ?? "عن الكاتب"}
            </Link>
            <Link href="/books" className="flex items-center gap-0.5 text-[#1e3a5f] transition hover:opacity-70">
              {nav?.books ?? "الكتب"}
              <DropdownArrowIcon />
            </Link>
            <span className="group relative">
              <span className="flex cursor-default items-center gap-0.5 text-[#1e3a5f]">
                {nav?.articles ?? "المنشورات"}
                <DropdownArrowIcon />
              </span>
              <div className="invisible absolute top-full right-0 z-50 mt-2 min-w-[160px] rounded-xl border border-[#e5e0d8] bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                {articleItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/articles/${item.id}`}
                    className="block px-4 py-2 text-sm text-[#1e3a5f] hover:bg-[#f5f0e8]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </span>
          </div>

        </div>
      </nav>
    </header>
  );
}
