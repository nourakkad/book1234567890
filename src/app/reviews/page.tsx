"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

const REVIEWS = [
  { text: "قرأت جميع الكتب، وكل واحد يقدم منظور فريد عن الحياة والثقافة", likes: 100, dislikes: 100 },
  { text: "تجربة رائعة مع مجموعة الكتب، أسلوب الكاتب سلس ومشوّق جداً", likes: 85, dislikes: 12 },
  { text: "أسلوب الكاتب مميز ويستحق المتابعة، أنصح بقراءة جميع أعماله", likes: 74, dislikes: 8 },
  { text: "كتب رائعة تلامس الوجدان وتفتح آفاقاً جديدة في التفكير والإبداع", likes: 63, dislikes: 5 },
];

type ReviewContent = {
  title?: string;
  items?: Array<{ text: string; likes: number; dislikes: number }>;
};

export default function ReviewsPage() {
  const reviewsContent = useContentBySlug<ReviewContent>("reviews", {
    title: "ماذا يقول القراء؟",
    items: REVIEWS,
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-center text-2xl font-bold text-[#1e3a5f] sm:mb-10 sm:text-3xl md:text-4xl">
            {reviewsContent.title ?? "ماذا يقول القراء؟"}
          </h1>

          <div className="flex flex-col gap-5">
            {(reviewsContent.items && reviewsContent.items.length > 0
              ? reviewsContent.items
              : REVIEWS).map((review, i) => (
              <div key={i} className="rounded-2xl bg-[#eeeae4] px-4 py-5 sm:px-7 sm:py-6">
                {/* Large quote mark */}
                <div className="mb-4 text-right">
                  <svg width="34" height="27" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 30V18.75C0 13.75 1.375 9.625 4.125 6.375C6.875 3.125 10.625 1 15.375 0L17.25 3.375C14.875 4.125 12.875 5.5 11.25 7.5C9.625 9.5 8.75 11.75 8.625 14.25H15.75V30H0ZM21.75 30V18.75C21.75 13.75 23.125 9.625 25.875 6.375C28.625 3.125 32.375 1 37.125 0L39 3.375C36.625 4.125 34.625 5.5 33 7.5C31.375 9.5 30.5 11.75 30.375 14.25H37.5V30H21.75Z" fill="#1e3a5f"/>
                  </svg>
                </div>

                {/* Quote text */}
                <p className="mb-6 text-center text-[#1e3a5f] leading-relaxed">
                  {review.text}
                </p>

                {/* Like / Dislike */}
                <div className="flex items-center justify-end gap-6">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[#1e3a5f]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 14V2" /><path d="M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-.88z" />
                    </svg>
                    {review.dislikes}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[#1e3a5f]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

      <Footer />
    </div>
  );
}
