"use client";

import { useEffect, useState } from "react";

export function useContentBySlug<T>(slug: string, fallback: T) {
  const [content, setContent] = useState<T>(fallback);

  useEffect(() => {
    let mounted = true;
    void fetch(`/api/content/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        if (typeof d?.data !== "undefined" && d?.data !== null) {
          setContent(d.data as T);
        }
      })
      .catch(() => {
        // Keep fallback content if API/database is unavailable.
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  return content;
}
