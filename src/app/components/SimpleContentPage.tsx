"use client";

import Header from "./Header";
import Footer from "./Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type SimpleContent = {
  title?: string;
  description?: string;
};

export default function SimpleContentPage({
  slug,
  fallbackTitle,
  fallbackDescription,
}: {
  slug: string;
  fallbackTitle: string;
  fallbackDescription: string;
}) {
  const content = useContentBySlug<SimpleContent>(slug, {
    title: fallbackTitle,
    description: fallbackDescription,
  });

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Header />
      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#ddd2c4] bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-8 md:p-12">
          <span className="mb-4 inline-flex rounded-full bg-[#e8f0f4] px-4 py-2 text-sm text-[#05698e]">
            صفحة جديدة
          </span>
          <h1 className="mb-4 text-2xl font-bold text-[#1e3a5f] sm:text-3xl md:text-4xl">
            {content.title ?? fallbackTitle}
          </h1>
          <p className="max-w-3xl leading-8 text-[#1e3a5f]/80">
            {content.description ?? fallbackDescription}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
