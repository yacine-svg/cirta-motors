"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Car } from "@/data/cars";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Icon3D } from "@/components/ui/Icons";

const MODEL_VIEWER_SRC = "https://cdn.jsdelivr.net/npm/@google/model-viewer@4.1.0/dist/model-viewer.min.js";

interface MVMaterial {
  name: string;
  pbrMetallicRoughness: { setBaseColorFactor: (color: string | number[]) => void };
}
interface ModelViewerElement extends HTMLElement {
  model?: { materials: readonly MVMaterial[] };
}

let mvPromise: Promise<void> | null = null;
function loadModelViewer(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.customElements.get("model-viewer")) return Promise.resolve();
  if (!mvPromise) {
    mvPromise = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.type = "module";
      s.src = MODEL_VIEWER_SRC;
      s.onload = () => window.customElements.whenDefined("model-viewer").then(() => resolve());
      s.onerror = () => {
        mvPromise = null;
        reject(new Error("model-viewer failed to load"));
      };
      document.head.appendChild(s);
    });
  }
  return mvPromise;
}

type Status = "idle" | "loading" | "ready" | "failed";

// Material names that usually hold the body paint in car GLB files.
const PAINT_NAMES = /paint|body|carpaint|car_paint|exterior|lack|shell/i;

interface CarViewerProps {
  car: Car;
  colorIndex: number;
  onColorChange: (index: number) => void;
}

export default function CarViewer({ car, colorIndex, onColorChange }: CarViewerProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const mv = useRef<ModelViewerElement | null>(null);
  const paint = useRef<MVMaterial | null>(null);
  const [want3D, setWant3D] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [paintSupported, setPaintSupported] = useState(false);
  const [photo, setPhoto] = useState(0);

  // Lazy: only start loading the 3D viewer when it scrolls near the viewport (and not with reduced motion).
  useEffect(() => {
    if (reduced) return;
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setWant3D(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!want3D) return;
    let cancelled = false;
    setStatus("loading");
    loadModelViewer().catch(() => {
      if (!cancelled) setStatus("failed");
    });
    // Give up gracefully if the model never answers.
    const timeout = window.setTimeout(() => {
      if (!cancelled) setStatus((s) => (s === "ready" ? s : "failed"));
    }, 15000);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [want3D]);

  const onLoad = useCallback(() => {
    const materials = mv.current?.model?.materials ?? [];
    const found = materials.find((m) => PAINT_NAMES.test(m.name)) ?? null;
    paint.current = found;
    setPaintSupported(Boolean(found));
    setStatus("ready");
  }, []);

  const onError = useCallback(() => setStatus("failed"), []);

  // Callback ref: (re)binds model-viewer's load/error events.
  const attach = useCallback(
    (node: HTMLElement | null) => {
      if (mv.current) {
        mv.current.removeEventListener("load", onLoad);
        mv.current.removeEventListener("error", onError);
      }
      mv.current = node as ModelViewerElement | null;
      if (node) {
        node.addEventListener("load", onLoad);
        node.addEventListener("error", onError);
      }
    },
    [onLoad, onError],
  );

  // Apply the selected paint color to the 3D model when it supports it.
  useEffect(() => {
    if (status === "ready" && paint.current) {
      paint.current.pbrMetallicRoughness.setBaseColorFactor(car.colors[colorIndex].hex);
    }
  }, [colorIndex, status, car.colors]);

  const show3D = want3D && status !== "failed";

  return (
    <div>
      <div ref={box} className="relative aspect-[16/10] overflow-hidden rounded-[3px] border border-line bg-[radial-gradient(ellipse_at_50%_70%,#1f1f23_0%,#0a0a0b_70%)]">
        {show3D ? (
          <>
            <model-viewer
              ref={attach}
              src={car.model}
              poster={car.images[0].src}
              alt={`Modèle 3D interactif : ${car.name}`}
              camera-controls="true"
              {...(reduced ? {} : { "auto-rotate": "true" })}
              auto-rotate-delay="0"
              rotation-per-second="18deg"
              shadow-intensity="1"
              shadow-softness="0.8"
              exposure="1"
              environment-image="neutral"
              touch-action="pan-y"
              interaction-prompt="none"
              style={{ width: "100%", height: "100%", background: "transparent", "--poster-color": "transparent" } as React.CSSProperties}
            />
            {status !== "ready" ? (
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <span className="flex items-center gap-3 rounded-full border border-line bg-night/70 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mute backdrop-blur-md">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Chargement du modèle 3D
                </span>
              </div>
            ) : (
              <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-line bg-night/60 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-bone/80 backdrop-blur-md">
                <Icon3D className="text-sm text-accent" /> Glissez pour tourner
              </span>
            )}
          </>
        ) : (
          <>
            <Image
              key={car.images[photo].src}
              src={car.images[photo].src}
              alt={car.images[photo].alt}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
            {status === "failed" ? (
              <span className="absolute left-4 top-4 rounded-full border border-line bg-night/60 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-bone/80 backdrop-blur-md">
                Galerie photo · 3D bientôt disponible
              </span>
            ) : null}
            {reduced ? (
              <button type="button" onClick={() => setWant3D(true)} className="btn btn-ghost absolute bottom-4 right-4 h-10 bg-night/60 px-4 backdrop-blur-md">
                <Icon3D /> Voir en 3D
              </button>
            ) : null}
          </>
        )}
      </div>

      {!show3D && car.images.length > 1 ? (
        <div className="mt-3 flex gap-3" role="group" aria-label="Photos">
          {car.images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setPhoto(i)}
              aria-label={`Photo ${i + 1} : ${img.alt}`}
              aria-pressed={photo === i}
              className={`relative aspect-[16/10] w-24 overflow-hidden rounded-[2px] border transition-colors md:w-32 ${photo === i ? "border-accent" : "border-line hover:border-bone/40"}`}
            >
              <Image src={img.src} alt="" fill sizes="128px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className="label mb-0">Couleur</span>
        <div className="flex gap-3" role="radiogroup" aria-label="Couleur de la voiture">
          {car.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={colorIndex === i}
              aria-label={c.name}
              title={c.name}
              onClick={() => onColorChange(i)}
              className={`h-9 w-9 rounded-full border-2 transition-transform duration-300 hover:scale-110 ${colorIndex === i ? "border-accent" : "border-line"}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <span className="text-sm text-bone">{car.colors[colorIndex].name}</span>
        {status === "ready" && !paintSupported ? <span className="text-xs text-mute">Ce modèle 3D ne permet pas de changer la peinture.</span> : null}
        {status !== "ready" ? <span className="text-xs text-mute">Couleur notée dans votre réservation, selon disponibilité.</span> : null}
      </div>
    </div>
  );
}
