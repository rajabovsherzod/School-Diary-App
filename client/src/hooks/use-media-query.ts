"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Bu kod faqat brauzerda (client-side) ishlashini ta'minlaydi
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      const updateMatches = () => setMatches(media.matches);

      // Boshlang'ich tekshiruv
      updateMatches();

      // O'lcham o'zgarganda tinglash
      media.addEventListener("change", updateMatches);

      // Komponent o'chirilganda event listener'ni tozalash
      return () => media.removeEventListener("change", updateMatches);
    }
  }, [query]);

  return matches;
}
