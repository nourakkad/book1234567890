"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

export default function ThoughtsPage() {
  const content = useContentBySlug<{
    title?: string;
    description?: string;
    items?: Array<{ text?: string }>;
  }>("thoughts", {
    title: "خواطر علمية",
    description: "مجموعة من الخواطر والكتابات القصيرة التي سيتم عرضها هنا.",
    items: [
      {
        text: "النزوة والعيب، عندما يكون العمل وتضيع الآمال ولا يوجد الإنسان فيصير بعد مضي سنوات عديدة، وعي الإنسان ذاته كاتباً له لا فقط بداية ليروق، ولكن همم القراءة لا تظهر، بينما النزاع أمامك ويحولك كبرك وهو النمو والنور والعلم يزكو بعقله ويسعد بروحه وحياته.",
      },
    ],
  });

  const items = content.items && content.items.length > 0 ? content.items : [];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <main>
        <section className="overflow-hidden bg-[#f5f5f5]">
          <div className="relative h-16 bg-[#0d5f84]">
            <div className="absolute inset-x-0 bottom-0 h-10 rounded-[100%] bg-[#f5f5f5]" />
          </div>
        </section>

        <section className="px-6 pb-14 pt-10">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-8 text-center text-3xl font-bold text-[#0d6f95]">
              {content.title ?? "خواطر علمية"}
            </h1>

            <div className="grid gap-5 md:grid-cols-2">
              {items.map((item, index) => (
                <article key={index} className="rounded-lg bg-white p-5 text-right shadow-md">
                  <p className="text-base leading-8 text-[#0f6b8e]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
