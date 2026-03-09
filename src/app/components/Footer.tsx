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
    home?: string;
    about?: string;
    books?: string;
    articles?: string;
    contact?: string;
  };
};

type AboutContent = {
  authorImageUrl?: string;
};

export default function Footer() {
  const [content, setContent] = useState<GlobalContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    void fetch("/api/content/global")
      .then((r) => r.json())
      .then((d) => setContent((d?.data ?? null) as GlobalContent))
      .catch(() => {
        // Keep static fallback labels if content API fails.
      });
    void fetch("/api/content/about")
      .then((r) => r.json())
      .then((d) => setAbout((d?.data ?? null) as AboutContent))
      .catch(() => {
        // Keep placeholder image if content API fails.
      });
  }, []);

  const footer = content?.footer;
  const nav = content?.nav;

  return (
    <footer className="bg-[#05698e] text-white">
      <div className="relative h-24 overflow-hidden bg-[#f6f6f6]">
        <div className="absolute inset-x-[-8%] bottom-8 h-20 rounded-[100%] bg-[#d5e5ef]" />
        <div className="absolute inset-x-[-12%] bottom-2 h-24 rounded-[100%] bg-[#b6cfde]" />
        <div className="absolute inset-x-[-8%] bottom-[-24px] h-24 rounded-[100%] bg-[#e8f0f5]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-10">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-[1.2fr_1fr_1fr_220px] md:items-end">
          <div className="text-right">
            <h3 className="mb-3 text-base font-bold sm:mb-4 sm:text-lg">{content?.siteTitle ?? "اسم الكاتب"}</h3>
            <p className="max-w-sm text-sm leading-7 text-white/90">
              {content?.siteDescription ??
                "باحث وكاتب يهتم بنشر المعرفة والفكر، مع عناية بالمحتوى العربي والإسلامي في قالب واضح ومؤثر."}
            </p>
            <div className="mt-5 space-y-1 text-sm text-white/85">
              <p>تلفون: 000000000</p>
              <p>البريد: lorem@example.com</p>
              <p>العنوان: موقع افتراضي للتواصل</p>
            </div>
          </div>

          <div className="text-right">
            <h3 className="mb-4 text-base font-bold">{footer?.quickLinksTitle ?? "روابط سريعة"}</h3>
            <div className="flex flex-col gap-2 text-sm text-white/90">
              <Link href="/" className="transition hover:text-white">{nav?.home ?? "الصفحة الرئيسية"}</Link>
              <Link href="/about" className="transition hover:text-white">{nav?.about ?? "عن الكاتب"}</Link>
              <Link href="/books" className="transition hover:text-white">{nav?.books ?? "الكتب"}</Link>
              <Link href="/articles" className="transition hover:text-white">{nav?.articles ?? "المنشورات"}</Link>
              <Link href="/contact" className="transition hover:text-white">{nav?.contact ?? "تواصل معنا"}</Link>
            </div>
          </div>

          <div className="text-right text-sm text-white/90">
            <h3 className="mb-4 text-base font-bold">معلومات إضافية</h3>
            <p className="leading-7">
              هذا القسم مخصص للوصف المختصر، الروابط المهمة، أو أي بيانات إضافية تريدين ظهورها في ذيل الموقع.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center text-[10px] font-semibold text-[#05698e] shadow-md sm:h-24 sm:w-24 sm:text-xs">
              شعار
            </div>
            <div className="h-24 w-20 overflow-hidden rounded bg-white/20 shadow-md sm:h-28 sm:w-24">
              {about?.authorImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={about.authorImageUrl} alt="صورة الكاتب" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/15 text-xs text-white">
                  صورة الكاتب
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-5 sm:mt-8 md:flex-row">
          <div className="text-sm text-white/80">
            {footer?.copyright ?? "جميع الحقوق محفوظة للباحث سامر اسمويل © 2026"}
          </div>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="انستغرام" className="text-white transition hover:text-white/80">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="فيسبوك" className="text-white transition hover:text-white/80">
              <FacebookIcon />
            </a>
            <a href="#" aria-label="إكس" className="text-white transition hover:text-white/80">
              <TwitterIcon />
            </a>
            <a href="#" aria-label="يوتيوب" className="text-white transition hover:text-white/80">
              <YoutubeIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function YoutubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.5v-7L15.8 12l-6.2 3.5Z" />
    </svg>
  );
}
