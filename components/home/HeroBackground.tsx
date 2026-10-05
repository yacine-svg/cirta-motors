"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

const UNICORN_SRC = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.12/dist/unicornStudio.umd.js";

function loadUnicorn(): Promise<void> {
  if (window.UnicornStudio) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-unicorn]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unicorn Studio failed to load")), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = UNICORN_SRC;
    s.async = true;
    s.dataset.unicorn = "true";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Unicorn Studio failed to load"));
    document.head.appendChild(s);
  });
}

const projectId = site.unicornProjectId;
const hasProject = Boolean(projectId) && !projectId.startsWith("[");

/**
 * Full-screen hero background.
 * Static image first (fast paint, mobile, reduced motion), then the Unicorn Studio
 * WebGL scene fades in on desktop once the browser is idle.
 */
export default function HeroBackground() {
  const [useScene, setUseScene] = useState(false);
  const [ready, setReady] = useState(false);
  const scenes = useRef<UnicornScene[]>([]);

  useEffect(() => {
    if (!hasProject) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduce || !desktop) return;
    const start = () => setUseScene(true);
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) {
      const id = ric(start, { timeout: 1500 });
      return () => (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(start, 800);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!useScene) return;
    let cancelled = false;
    loadUnicorn()
      .then(() => window.UnicornStudio?.init())
      .then((list) => {
        if (cancelled) {
          list?.forEach((s) => s.destroy?.());
          return;
        }
        scenes.current = list ?? [];
        setReady(true);
      })
      .catch(() => setUseScene(false));
    return () => {
      cancelled = true;
      scenes.current.forEach((s) => s.destroy?.());
      scenes.current = [];
    };
  }, [useScene]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Image src="/hero-fallback.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      {useScene ? (
        <div
          data-us-project={projectId}
          data-us-production="true"
          className={`absolute inset-0 transition-opacity duration-[1800ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
        />
      ) : null}
    </div>
  );
}
