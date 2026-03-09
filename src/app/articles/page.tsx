"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type ArticleItem = {
  title?: string;
  date?: string;
  secondaryTitle?: string;
  imageUrl?: string;
  categoryId?: string;
  author?: string;
};

type ArticleCategory = {
  id?: string;
  label?: string;
  featuredIds?: string[];
};

type ArticlesContent = {
  title?: string;
  description?: string;
  categories?: ArticleCategory[];
  items?: Record<string, ArticleItem>;
};

const FALLBACK_CATEGORIES: ArticleCategory[] = [
  { id: "faith", label: "عقيدة", featuredIds: ["1", "4"] },
  { id: "education", label: "تربوية", featuredIds: ["2"] },
  { id: "psychology", label: "نفسية", featuredIds: ["3"] },
  { id: "social", label: "اجتماعية", featuredIds: ["5"] },
  { id: "family", label: "أسرية", featuredIds: ["6"] },
  { id: "featured", label: "مميزة", featuredIds: ["1", "2", "3"] },
];

export default function ArticlesPage() {
  const content = useContentBySlug<ArticlesContent>("articles", {
    title: "المنشورات والمقالات",
    description: "استعرض المقالات بحسب التصنيف، مع إبراز المقالات المميزة لكل قسم.",
    categories: FALLBACK_CATEGORIES,
    items: {},
  });

  const categories =
    content.categories && content.categories.length > 0 ? content.categories : FALLBACK_CATEGORIES;
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id ?? "");

  useEffect(() => {
    if (!categories.some((category) => category.id === selectedCategoryId)) {
      setSelectedCategoryId(categories[0]?.id ?? "");
    }
  }, [categories, selectedCategoryId]);

  const items = useMemo(
    () => Object.entries(content.items ?? {}).sort(([a], [b]) => Number(a) - Number(b)),
    [content.items]
  );
  const activeCategory = categories.find((category) => category.id === selectedCategoryId) ?? categories[0];
  const filteredItems = items.filter(([, item]) => {
    if (!activeCategory?.id) return true;
    return item.categoryId === activeCategory.id;
  });
  const featuredItems = (activeCategory?.featuredIds ?? [])
    .map((id) => [id, (content.items ?? {})[id]] as const)
    .filter(([, item]) => Boolean(item));

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <main>
        <section className="overflow-hidden bg-[#56add3]">
          <div className="relative h-28">
            <div className="absolute inset-x-[-10%] top-8 h-20 rounded-[100%] bg-[#4fa4cb]" />
            <div className="absolute inset-x-[-6%] top-10 h-20 rounded-[100%] bg-[#67b7d8]" />
            <div className="absolute inset-x-[-8%] top-14 h-20 rounded-[100%] bg-[#7dc2de]" />
            <div className="absolute inset-x-[-4%] top-16 h-20 rounded-[100%] bg-[#9cd0e6]" />
            <div className="absolute inset-x-[-2%] top-20 h-20 rounded-[100%] bg-[#c7e1ee]" />
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-6 text-center text-2xl font-bold text-[#0d6f95] sm:mb-8 sm:text-3xl">
              {content.title ?? "المنشورات والمقالات"}
            </h1>

            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id ?? "")}
                  className={`rounded-md px-5 py-2 text-sm shadow ${
                    selectedCategoryId === category.id
                      ? "bg-[#0d6f95] text-white"
                      : "bg-white text-[#8d8d8d]"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {featuredItems.map(([id, item]) => (
                <Link
                  key={id}
                  href={`/articles/${id}`}
                  className="rounded-md bg-white px-5 py-2 text-sm text-[#8d8d8d] shadow"
                >
                  {item?.title ?? `مقال ${id}`}
                </Link>
              ))}
            </div>

            <div className="mb-2 text-center">
              <span className="inline-flex min-w-32 justify-center rounded-xl bg-white px-8 py-2 text-sm text-[#0d6f95] shadow">
                أبرز المقالات
              </span>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f5f5]">
          <FanDivider />
        </section>

        <section className="px-4 pb-14 pt-8 sm:px-6 sm:pt-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-center text-2xl font-bold text-[#0d6f95] sm:mb-8 sm:text-3xl">
              أحدث المنشورات
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map(([id, item]) => (
                <article key={id}>
                  <Link href={`/articles/${id}`} className="block overflow-hidden rounded-sm bg-white shadow-sm">
                    <div className="aspect-[4/3] bg-[#d7d7d7]">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.title ?? ""} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-start justify-end bg-[radial-gradient(circle_at_top_left,_#0c203f_0%,_#321d52_18%,_#5b1e55_36%,_#294f7a_62%,_#111827_100%)] p-3 text-right text-lg font-bold text-white sm:p-4 sm:text-xl md:text-2xl">
                          {item.title ?? `منشور ${id}`}
                        </div>
                      )}
                    </div>
                  </Link>
                  <p className="mt-3 text-right text-sm text-[#0d6f95]">
                    {item.author ?? "محمد النبي يوسف"}
                  </p>
                </article>
              ))}
            </div>

            {filteredItems.length === 0 ? (
              <p className="mt-8 text-center text-[#0d6f95]/70">لا توجد منشورات في هذا التصنيف حالياً.</p>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FanDivider() {
  return (
    <div className="relative h-44 overflow-hidden">
      <div className="absolute inset-0 bg-[#f5f5f5]" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[#0f5576]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 16%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-6 bg-[#255f84]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 28%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-14 bg-[#44789d]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 42%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-24 bg-[#87a9c0]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 62%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 top-36 bg-[#dae5eb]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 84%, 0 100%)" }} />
    </div>
  );
}
