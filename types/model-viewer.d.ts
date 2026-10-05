import type * as React from "react";

type ModelViewerAttributes = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  src?: string;
  poster?: string;
  alt?: string;
  loading?: "auto" | "lazy" | "eager";
  reveal?: "auto" | "manual";
  exposure?: string;
  "camera-controls"?: string;
  "auto-rotate"?: string;
  "auto-rotate-delay"?: string;
  "rotation-per-second"?: string;
  "shadow-intensity"?: string;
  "shadow-softness"?: string;
  "environment-image"?: string;
  "camera-orbit"?: string;
  "touch-action"?: string;
  "interaction-prompt"?: string;
  "disable-zoom"?: string;
};

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}
