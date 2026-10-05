import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconArrow = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);
export const IconArrowLeft = (p: P) => (
  <Base {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </Base>
);
export const IconSeat = (p: P) => (
  <Base {...p}>
    <path d="M7 4h4l1 9h6v6H8z" />
    <path d="M8 19v2M18 19v2" />
  </Base>
);
export const IconGear = (p: P) => (
  <Base {...p}>
    <path d="M6 4v16M12 4v8M18 4v8M6 12h12" />
  </Base>
);
export const IconFuel = (p: P) => (
  <Base {...p}>
    <path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M4 10h10" />
    <path d="M14 8l3 2v8a1.5 1.5 0 0 0 3 0V9l-3-3" />
  </Base>
);
export const IconBag = (p: P) => (
  <Base {...p}>
    <rect x="4" y="7" width="16" height="13" rx="1" />
    <path d="M9 7V4h6v3" />
  </Base>
);
export const IconDoor = (p: P) => (
  <Base {...p}>
    <path d="M5 21V8l7-5h7v18zM14 13h2" />
  </Base>
);
export const IconBolt = (p: P) => (
  <Base {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </Base>
);
export const IconGauge = (p: P) => (
  <Base {...p}>
    <path d="M4 18a8 8 0 1 1 16 0" />
    <path d="M12 18l4-6" />
  </Base>
);
export const IconCalendar = (p: P) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="16" rx="1" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Base>
);
export const IconCancel = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8" />
  </Base>
);
export const IconPlane = (p: P) => (
  <Base {...p}>
    <path d="M2 16l20-8-7 13-3-6z" />
    <path d="M12 15l-4 4" />
  </Base>
);
export const IconSupport = (p: P) => (
  <Base {...p}>
    <path d="M4 13a8 8 0 0 1 16 0" />
    <rect x="3" y="13" width="4" height="6" rx="1" />
    <rect x="17" y="13" width="4" height="6" rx="1" />
    <path d="M19 19c0 1.5-2 2-5 2" />
  </Base>
);
export const IconTag = (p: P) => (
  <Base {...p}>
    <path d="M3 12V3h9l9 9-9 9z" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </Base>
);
export const IconCheck = (p: P) => (
  <Base {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </Base>
);
export const IconPin = (p: P) => (
  <Base {...p}>
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </Base>
);
export const IconPhone = (p: P) => (
  <Base {...p}>
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />
  </Base>
);
export const IconMail = (p: P) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="M3 7l9 6 9-6" />
  </Base>
);
export const IconClose = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);
export const Icon3D = (p: P) => (
  <Base {...p}>
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
    <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
  </Base>
);
export const IconWhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M12.04 2a9.93 9.93 0 0 0-8.5 15.05L2 22l5.08-1.5A9.93 9.93 0 1 0 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.02.9.9-2.94-.2-.3a8.18 8.18 0 1 1 6.8 3.67zm4.5-6.12c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.28.19-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04c0 1.2.88 2.37 1 2.53.12.17 1.73 2.64 4.2 3.7 1.56.67 2.17.73 2.95.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.17-.47-.29z" />
  </svg>
);
export const IconInstagram = (p: P) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </Base>
);
export const IconFacebook = (p: P) => (
  <Base {...p}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
  </Base>
);
export const IconTikTok = (p: P) => (
  <Base {...p}>
    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c.5 2.5 2.5 4.5 5 5" />
  </Base>
);
export const IconMenu = (p: P) => (
  <Base {...p}>
    <path d="M4 8h16M4 16h16" />
  </Base>
);
