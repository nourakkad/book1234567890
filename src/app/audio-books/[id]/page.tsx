"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useContentBySlug } from "@/lib/content/useContentBySlug";

type AudioBookItem = {
  id: number;
  title?: string;
  author?: string;
  description?: string;
  imageUrl?: string;
  audioUrl?: string;
};

type AudioBooksContent = {
  title?: string;
  items?: AudioBookItem[];
};

const FALLBACK_ITEMS: AudioBookItem[] = [
  {
    id: 1,
    title: "تحرير العقل من النقل",
    author: "سامر اسلامبولی",
    description: "وقرابة القدية المجموعة من احاديث . البخاري ومسلم",
    imageUrl: "",
    audioUrl: "",
  },
];

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#0d5f84]">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

export default function AudioBookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const currentId = Number(params.id ?? 1);
  const content = useContentBySlug<AudioBooksContent>("audioBooks", {
    title: "الكتب الصوتية",
    items: FALLBACK_ITEMS,
  });

  const items = content.items && content.items.length > 0 ? content.items : FALLBACK_ITEMS;
  const book = items.find((b) => b.id === currentId) ?? items[0];

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  const displayTitle = book?.audioUrl
    ? `كتاب ${book.title ?? "صوتي"}.${book.audioUrl.split(".").pop() ?? "mp4"}`
    : `كتاب ${book?.title ?? "صوتي"}.mp4`;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onDurationChange = () => setDuration(el.duration);
    const onEnded = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("durationchange", onDurationChange);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    setDuration(el.duration);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("durationchange", onDurationChange);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [book?.audioUrl]);

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const el = audioRef.current;
    const t = Number(e.target.value);
    if (el) {
      el.currentTime = t;
      setCurrentTime(t);
    }
  }

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({
        title: book?.title ?? "كتاب صوتي",
        url: window.location.href,
        text: book?.description ?? "",
      });
    } else {
      void navigator.clipboard?.writeText(window.location.href);
    }
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#faf8f5]">
        <Header />
        <main className="px-4 py-12 text-center sm:px-6 sm:py-16">
          <p className="text-[#1e3a5f]">الكتاب غير موجود.</p>
          <button
            type="button"
            onClick={() => router.push("/audio-books")}
            className="mt-4 text-[#0d5f84] underline"
          >
            العودة للكتب الصوتية
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = volume;
  }, [volume, book?.audioUrl]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="bg-white">
        <section className="px-4 pb-16 pt-10 md:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-start md:gap-12">
            {/* Right: cover (RTL) */}
            <div className="shrink-0 md:w-[280px]">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                {book.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.imageUrl}
                    alt={book.title ?? ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col justify-end bg-[linear-gradient(135deg,#f5e6a0,#e8b87a,#d97a6a,#b86a9e,#6a8bb8,#7ab89e)] p-4">
                    <p className="text-right text-xl font-bold leading-tight text-[#8b4513]">
                      {book.title ?? "كتاب صوتي"}
                    </p>
                    <p className="mt-1 text-right text-sm text-[#5c4033]">
                      {book.author ?? ""}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Left: title, actions, player */}
            <div className="min-w-0 flex-1">
              <h1 className="mb-6 text-xl font-bold text-[#1e3a5f] sm:text-2xl md:text-3xl">
                {displayTitle}
              </h1>

              <div className="mb-8 flex flex-wrap gap-3">
                <a
                  href={book.audioUrl || "#"}
                  download={book.title ? `${book.title}.mp4` : "audio.mp4"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-5 py-3 font-medium text-[#1e3a5f] shadow-sm transition hover:bg-gray-300"
                >
                  <DownloadIcon />
                  تحميل
                </a>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-5 py-3 font-medium text-[#1e3a5f] shadow-sm transition hover:bg-gray-300"
                >
                  <ShareIcon />
                  مشاركة
                </button>
              </div>

              {/* Audio player - white box, headphone icon center, dark blue control bar at bottom */}
              <div className="overflow-hidden rounded-2xl border border-[#e5e0d8] bg-white shadow-md">
                {book.audioUrl ? (
                  <>
                    <audio ref={audioRef} src={book.audioUrl} preload="metadata" />
                    <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
                      <HeadphonesIcon />
                    </div>
                    {/* Dark blue control bar */}
                    <div className="flex flex-wrap items-center gap-3 bg-[#0d5f84] px-3 py-3 sm:gap-4 sm:px-4">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                      >
                        {playing ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          value={currentTime}
                          onChange={handleSeek}
                          className="h-1.5 flex-1 accent-white"
                        />
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="h-1.5 w-14 accent-white sm:w-20"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
                    <HeadphonesIcon />
                    <p className="mt-4 text-center text-[#1e3a5f]/70">
                      لم يتم رفع الملف الصوتي بعد. أضفه من لوحة التحكم.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
