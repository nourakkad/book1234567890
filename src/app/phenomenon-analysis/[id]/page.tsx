"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type PhenomenonItem = {
  id: number;
  title?: string;
  imageUrl?: string;
  description?: string;
};

type PhenomenonContent = {
  title?: string;
  items?: PhenomenonItem[];
};

const FALLBACK_ITEMS: PhenomenonItem[] = [
  {
    id: 1,
    title: "مرض السعار الفكري والديني",
    imageUrl: "",
    description:
      "## السعار الفكري طبيعة العدوى وآلية الانتشار\n\nنص توضيحي عن طبيعة العدوى وآلية الانتشار.\n\n## أعراض السعار الفكري\n\n- تغييب التفكير النقدي\n- التقليد الأعمى\n- التعصب والتطرف",
  },
];

function renderDescription(text: string) {
  const blocks = text.split(/\n\n+/);
  return blocks.map((block, i) => {
    const lines = block.split("\n").filter(Boolean);
    if (lines.length === 0) return null;

    // Subheading: line starting with ##
    if (lines.length === 1 && lines[0].startsWith("## ")) {
      return (
        <h2
          key={i}
          className="mb-4 mt-8 text-xl font-bold text-[#1e3a5f] first:mt-0"
        >
          {lines[0].replace(/^##\s*/, "")}
        </h2>
      );
    }

    // Bullet list: all lines start with - or •
    const bulletMatch = lines.every(
      (l) => l.startsWith("- ") || l.startsWith("• ")
    );
    if (bulletMatch && lines.length > 0) {
      return (
        <ul key={i} className="mb-6 list-none space-y-2 pr-6">
          {lines.map((line, j) => (
            <li
              key={j}
              className="relative text-justify leading-relaxed text-[#1e3a5f] before:absolute before:right-0 before:content-['–']"
            >
              {line.replace(/^[-•]\s*/, "")}
            </li>
          ))}
        </ul>
      );
    }

    // Subheading without ##: single short line
    if (lines.length === 1 && lines[0].length < 80) {
      return (
        <h2
          key={i}
          className="mb-4 mt-8 text-xl font-bold text-[#1e3a5f] first:mt-0"
        >
          {lines[0]}
        </h2>
      );
    }

    // Paragraph(s)
    return (
      <div key={i} className="mb-6">
        {lines.map((line, j) => (
          <p
            key={j}
            className="mb-4 text-justify leading-8 text-[#1e3a5f] last:mb-0"
          >
            {line}
          </p>
        ))}
      </div>
    );
  });
}

export default function PhenomenonDetailPage() {
  const params = useParams();
  const currentId = Number(params.id ?? 1);
  const content = useContentBySlug<PhenomenonContent>("phenomenonAnalysis", {
    title: "تحليل الظاهرة",
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
          <p className="text-[#1e3a5f]">التحليل غير موجود.</p>
          <Link
            href="/phenomenon-analysis"
            className="mt-4 inline-block text-[#0d5f84] underline"
          >
            العودة لتحليل الظاهرة
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
            href="/phenomenon-analysis"
            className="mb-6 inline-block text-[#0d5f84] underline hover:no-underline"
          >
            ← العودة لتحليل الظاهرة
          </Link>

          <h1 className="mb-10 text-2xl font-bold text-[#1e3a5f] md:text-3xl">
            {item.title ?? "تحليل الظاهرة"}
          </h1>

          {item.imageUrl ? (
            <div className="mb-10 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title ?? ""}
                className="h-auto w-full object-cover"
              />
            </div>
          ) : null}

          {item.description ? (
            <article className="text-[#1e3a5f]">
              {renderDescription(item.description)}
            </article>
          ) : (
            <p className="text-[#1e3a5f]/70">
              المحتوى قيد الإعداد. أضف الوصف من لوحة التحكم.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
