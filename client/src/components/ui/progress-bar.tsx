"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    // This is to handle back/forward navigation
    const handleAnchorClick = (event: MouseEvent) => {
      const targetUrl = (event.currentTarget as HTMLAnchorElement).href;
      const currentUrl = window.location.href;
      if (targetUrl !== currentUrl) {
        NProgress.start();
      }
    };

    const handleMutation = () => {
      const anchorElements = document.querySelectorAll("a");
      anchorElements.forEach((anchor) =>
        anchor.addEventListener("click", handleAnchorClick)
      );
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document, { childList: true, subtree: true });

    // Initial setup
    handleMutation();

    return () => {
      mutationObserver.disconnect();
      const anchorElements = document.querySelectorAll("a");
      anchorElements.forEach((anchor) =>
        anchor.removeEventListener("click", handleAnchorClick)
      );
    };
  }, []);

  return null; // This component doesn't render anything itself
}
