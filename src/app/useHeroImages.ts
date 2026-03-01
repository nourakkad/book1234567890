"use client";

import { useEffect, useState } from "react";

const BASE = "/images/hero";

/** Try loading an image; returns the URL that works or the first candidate. */
function useImagePath(num: 1 | 2 | 3 | 4): string {
  const names = {
    1: ["parchment-1.png", "parchment-1.jpg", "1.png", "1.jpg"],
    2: ["parchment-2.png", "parchment-2.jpg", "2.png", "2.jpg"],
    3: ["parchment-3.png", "parchment-3.jpg", "3.png", "3.jpg"],
    4: ["parchment-4.png", "parchment-4.jpg", "4.png", "4.jpg"],
  };
  const candidates = names[num].map((n) => `${BASE}/${n}`);
  const [path, setPath] = useState(candidates[0]);

  useEffect(() => {
    const tryLoad = (url: string): Promise<boolean> =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });

    (async () => {
      for (const candidate of candidates) {
        if (await tryLoad(candidate)) {
          setPath(candidate);
          return;
        }
      }
      setPath(candidates[0]);
    })();
  }, [num]); // eslint-disable-line react-hooks/exhaustive-deps

  return path;
}

export function useHeroImages() {
  const parchment1 = useImagePath(1);
  const parchment2 = useImagePath(2);
  const parchment3 = useImagePath(3);
  const parchment4 = useImagePath(4);
  return { parchment1, parchment2, parchment3, parchment4 };
}
