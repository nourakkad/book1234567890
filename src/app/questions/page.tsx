"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

const ITEMS_PER_PAGE = 6;

type QuestionItem = {
  id: number;
  question?: string;
  answer?: string;
};

type QuestionsContent = {
  title?: string;
  description?: string;
  items?: QuestionItem[];
};

const FALLBACK_ITEMS: QuestionItem[] = [
  { id: 1, question: "مثلا علي تهام", answer: "" },
  { id: 2, question: "مثلا علي تهام", answer: "" },
  { id: 3, question: "مثلا علي تهام", answer: "" },
  { id: 4, question: "مثلا علي تهام", answer: "" },
  { id: 5, question: "مثلا علي تهام", answer: "" },
  { id: 6, question: "مثلا علي تهام", answer: "" },
];

function QuestionMarkIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#0d5f84]"
    >
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export default function QuestionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [submitName, setSubmitName] = useState("");
  const [submitEmail, setSubmitEmail] = useState("");
  const [submitTitle, setSubmitTitle] = useState("");
  const [submitText, setSubmitText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const content = useContentBySlug<QuestionsContent>("questions", {
    title: "الاسئلة و الأجوبة",
    description: "ستظهر هنا الأسئلة الشائعة والإجابات الخاصة بها.",
    items: FALLBACK_ITEMS,
  });

  const allItems =
    content.items && content.items.length > 0 ? content.items : FALLBACK_ITEMS;

  const { paginatedItems, totalPages } = useMemo(() => {
    const total = allItems.length;
    const pages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const slice = allItems.slice(start, start + ITEMS_PER_PAGE);
    return { paginatedItems: slice, totalPages: pages };
  }, [allItems, currentPage]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Header />

      <main>
        {/* Top section: form */}
        <section className="px-4 pb-14 pt-10 md:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-10 text-center text-3xl font-bold text-[#1e3a5f]">
              {content.title ?? "الاسئلة و الأجوبة"}
            </h1>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#ddd2c4] bg-white p-6 shadow-sm md:p-8"
            >
              <div className="mb-4">
                <label
                  htmlFor="q-name"
                  className="mb-2 block text-right text-sm font-medium text-[#1e3a5f]"
                >
                  الاسم <span className="text-red-500">*</span>
                </label>
                <input
                  id="q-name"
                  type="text"
                  required
                  value={submitName}
                  onChange={(e) => setSubmitName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right text-[#1e3a5f] outline-none transition focus:border-[#0d5f84] focus:ring-1 focus:ring-[#0d5f84]"
                  placeholder="الاسم"
                  dir="rtl"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="q-email"
                  className="mb-2 block text-right text-sm font-medium text-[#1e3a5f]"
                >
                  البريد الالكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  id="q-email"
                  type="email"
                  required
                  value={submitEmail}
                  onChange={(e) => setSubmitEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right text-[#1e3a5f] outline-none transition focus:border-[#0d5f84] focus:ring-1 focus:ring-[#0d5f84]"
                  placeholder="البريد الالكتروني"
                  dir="rtl"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="q-title"
                  className="mb-2 block text-right text-sm font-medium text-[#1e3a5f]"
                >
                  عنوان السؤال <span className="text-red-500">*</span>
                </label>
                <input
                  id="q-title"
                  type="text"
                  required
                  value={submitTitle}
                  onChange={(e) => setSubmitTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right text-[#1e3a5f] outline-none transition focus:border-[#0d5f84] focus:ring-1 focus:ring-[#0d5f84]"
                  placeholder="عنوان السؤال"
                  dir="rtl"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="q-text"
                  className="mb-2 block text-right text-sm font-medium text-[#1e3a5f]"
                >
                  نص السؤال <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="q-text"
                  required
                  rows={6}
                  value={submitText}
                  onChange={(e) => setSubmitText(e.target.value)}
                  className="w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right text-[#1e3a5f] outline-none transition focus:border-[#0d5f84] focus:ring-1 focus:ring-[#0d5f84]"
                  placeholder="نص السؤال"
                  dir="rtl"
                />
              </div>
              {submitted ? (
                <p className="mb-4 text-center text-[#0d5f84]">
                  تم إرسال سؤالك بنجاح.
                </p>
              ) : null}
              <button
                type="submit"
                className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-[#1e3a5f] shadow-sm transition hover:bg-gray-300"
              >
                إرسال
              </button>
            </form>
          </div>
        </section>

        {/* Dark blue wave separator */}
        <section className="overflow-hidden">
          <div className="relative h-12 bg-[#0d5f84]">
            <div className="absolute inset-x-0 bottom-0 h-8 rounded-[100%] bg-[#faf8f5]" />
          </div>
        </section>

        {/* Q&A cards grid */}
        <section className="bg-[#faf8f5] px-4 pb-16 pt-10 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/questions/${item.id}`}
                  className="group relative block overflow-hidden rounded-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[linear-gradient(135deg,#f5e6a0,#e8b87a,#d97a6a,#b86a9e,#6a8bb8,#7ab89e)] p-6">
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <QuestionMarkIcon />
                    </div>
                    <div className="relative flex h-full flex-col justify-between">
                      <h3 className="text-center text-xl font-bold text-[#e6b422] drop-shadow-sm">
                        الأسئلة و الأجوبة
                      </h3>
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-sm font-medium">
                          {String(item.id).padStart(2, "0")}
                        </span>
                        <span className="text-sm">{item.question ?? "سؤال"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 ? (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d6cfc4] text-[#1e3a5f] transition hover:bg-gray-100 disabled:opacity-40"
                  aria-label="السابق"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-[#0d5f84] text-white"
                          : "bg-white text-[#1e3a5f] shadow-sm hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage >= totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d6cfc4] text-[#1e3a5f] transition hover:bg-gray-100 disabled:opacity-40"
                  aria-label="التالي"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
