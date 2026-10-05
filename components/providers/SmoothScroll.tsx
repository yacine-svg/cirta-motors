"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Keeps ScrollTrigger in sync with Lenis and resets the scroll on route change. */
function LenisSync() {
  const pathname = usePathname();
  const lenis = useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let configured = false;

    function update(time: number) {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;
      if (!configured) {
        configured = true;
        // Reduced motion: keep Lenis for API calls but let the browser scroll natively.
        if (reduce) lenis.options.smoothWheel = false;
      }
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.085, smoothWheel: true, wheelMultiplier: 1 }}>
      <LenisSync />
      {children}
    </ReactLenis>
  );
}
