import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}

export default function SectionHeading({ eyebrow, title, intro, className = "", as = "h2" }: SectionHeadingProps) {
  const Tag = as;
  return (
    <Reveal className={`max-w-3xl ${className}`} stagger={0.08}>
      <p data-reveal className="eyebrow flex items-center gap-3">
        <span className="h-px w-8 bg-accent" aria-hidden="true" />
        {eyebrow}
      </p>
      <Tag
        data-reveal
        className={`mt-5 font-display font-semibold uppercase leading-[0.92] tracking-[0.01em] ${
          as === "h1" ? "text-[clamp(3.2rem,9vw,7.5rem)]" : "text-[clamp(2.6rem,6.5vw,5.5rem)]"
        }`}
      >
        {title}
      </Tag>
      {intro ? (
        <p data-reveal className="mt-6 max-w-xl text-base leading-relaxed text-mute md:text-lg">
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
