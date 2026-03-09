"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type QuestionItem = {
  id: number;
  question?: string;
  answer?: string;
};

type QuestionsContent = {
  title?: string;
  items?: QuestionItem[];
};

const FALLBACK_ITEMS: QuestionItem[] = [
  { id: 1, question: "مثلا علي تهام", answer: "إجابة السؤال." },
];

export default function QuestionDetailPage() {
  const params = useParams();
  const currentId = Number(params.id ?? 1);
  const content = useContentBySlug<QuestionsContent>("questions", {
    title: "الاسئلة و الأجوبة",
    items: FALLBACK_ITEMS,
  });

  const items =
    content.items && content.items.length > 0 ? content.items : FALLBACK_ITEMS;
  const item = items.find((x) => x.id === currentId) ?? items[0];

  if (!item) {
    return (
      <div className="min-h-screen bg-[#faf8f5]">
        <Header />
        <main className="px-6 py-16 text-center">
          <p className="text-[#1e3a5f]">السؤال غير موجود.</p>
          <Link
            href="/questions"
            className="mt-4 inline-block text-[#0d5f84] underline"
          >
            العودة للأسئلة والأجوبة
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Header />

      <main className="bg-white px-4 pb-16 pt-10 md:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/questions"
            className="mb-6 inline-block text-[#0d5f84] underline hover:no-underline"
          >
            ← العودة للأسئلة والأجوبة
          </Link>

          <h1 className="mb-8 text-2xl font-bold text-[#1e3a5f] md:text-3xl">
            {item.question ?? "سؤال"}
          </h1>

          {item.answer ? (
            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap leading-8 text-justify text-[#1e3a5f]">
                {item.answer}
              </p>
            </div>
          ) : (
            <p className="text-[#1e3a5f]/70">
              الإجابة قيد الإعداد. أضفها من لوحة التحكم.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
