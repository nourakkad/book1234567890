"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type GlobalContent = {
  siteTitle?: string;
  siteDescription?: string;
  footer?: {
    quickLinksTitle?: string;
    followTitle?: string;
    copyright?: string;
  };
  nav?: {
    about?: string;
    books?: string;
    articles?: string;
  };
};

export default function Footer() {
  const [content, setContent] = useState<GlobalContent | null>(null);

  useEffect(() => {
    void fetch("/api/content/global")
      .then((r) => r.json())
      .then((d) => setContent((d?.data ?? null) as GlobalContent))
      .catch(() => {
        // Keep static fallback labels if content API fails.
      });
  }, []);

  const footer = content?.footer;
  const nav = content?.nav;

  return (
    <footer className="bg-[#1a2f52] px-6 pt-14 pb-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* Col 1 — right in RTL: author name + description */}
          <div className="text-right">
            <h3 className="mb-3 text-lg font-bold text-white">{content?.siteTitle ?? "اسم الكاتب"}</h3>
            <p className="text-sm leading-relaxed text-white/70">
              {content?.siteDescription ??
                "كاتب معاصر يستكشف التجربة الإنسانية من خلال القصص والروايات التي تلامس القلب والعقل."}
            </p>
          </div>

          {/* Col 2 — center: quick links */}
          <div className="text-center">
            <h3 className="mb-4 text-lg font-bold text-white">{footer?.quickLinksTitle ?? "روابط سريعة"}</h3>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-white/70 transition hover:text-white">{nav?.about ?? "عن الكاتب"}</Link>
              <Link href="/books" className="text-white/70 transition hover:text-white">{nav?.books ?? "الكتب"}</Link>
              <Link href="/articles/1" className="text-white/70 transition hover:text-white">{nav?.articles ?? "المنشورات"}</Link>
            </div>
          </div>

          {/* Col 3 — left in RTL: social icons */}
          <div className="text-center md:text-left">
            <h3 className="mb-4 text-lg font-bold text-white">{footer?.followTitle ?? "تابعني"}</h3>
            <div className="flex justify-center gap-3 md:justify-start">
              <a href="#" aria-label="انستغرام"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-white hover:bg-white/10">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="فيسبوك"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-white hover:bg-white/10">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="إكس"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-white hover:bg-white/10">
                <TwitterIcon />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/15 pt-5 text-center text-sm text-white/50">
          {footer?.copyright ?? "جميع الحقوق محفوظة © 2026"}
        </div>
      </div>
    </footer>
  );
}
