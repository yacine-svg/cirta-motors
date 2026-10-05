# Cirta Motors · premium car rental demo

Frontend-only demo website for a premium car rental agency based in Algeria
(Constantine, Alger, Oran). No backend: the fleet is mock data and bookings are
simulated with a confirmation screen.

Built by **Nova Web Dz** (@nova_webdz).

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Lenis smooth scrolling (`lenis/react`, `ReactLenis` on the root), driven by the GSAP ticker and synced with ScrollTrigger
- GSAP + ScrollTrigger (scroll reveals, pinned horizontal fleet, counters) + Flip (animated fleet filtering)
- Google `<model-viewer>` for the 3D car viewer (loaded lazily from jsDelivr)
- Unicorn Studio for the hero background (loaded lazily, desktop only)

## Run it

Requires Node.js 18.18 or newer (20+ recommended).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production build
```

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com: **Add New → Project → Import** the repository. Leave the defaults (Framework: Next.js).
3. Optional: add the environment variables below in **Settings → Environment Variables**, then redeploy.

## What to replace

| What | Where |
| --- | --- |
| Brand name, phone, WhatsApp, e-mail, social links | `data/site.ts` |
| Accent color (amber by default) | `app/globals.css` → `--color-accent` (one line) |
| Agencies (cities, addresses, hours) | `data/site.ts` → `cities` |
| Cars, prices (DZD), specs, colors | `data/cars.ts` |
| Car photos | `data/cars.ts` → `images` (Unsplash placeholders; use the agency's own photos) |
| 3D models | `public/models/<slug>.glb` (see `public/models/README.md`) |
| Unicorn Studio scene | `NEXT_PUBLIC_UNICORN_PROJECT_ID` env var, or `data/site.ts` → `unicornProjectId` |
| Static hero image | `public/hero-fallback.jpg` |
| Social preview image | `public/og.jpg` |

### Unicorn Studio

Set `NEXT_PUBLIC_UNICORN_PROJECT_ID` to your project's embed ID (Unicorn Studio → Export → Embed).
While the value is the placeholder `[UNICORN_PROJECT_ID]`, the hero shows the static image only.
The scene is never loaded on screens narrower than 768px or when the visitor prefers reduced motion.

### 3D models

Each car points to `/models/<slug>.glb`. If the file is missing or fails to load, the car page
shows the photo gallery instead. For the color swatches to repaint the car, the body material in
the GLB must be named with "paint", "body" or "exterior" (e.g. `CarPaint`). Only use models whose
license allows commercial use.

## Environment variables

```
NEXT_PUBLIC_UNICORN_PROJECT_ID=[UNICORN_PROJECT_ID]
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Structure

```
app/
  layout.tsx            fonts, Lenis provider, header, footer, WhatsApp button
  page.tsx              home
  fleet/page.tsx        fleet grid + filters
  fleet/[slug]/page.tsx car detail (3D viewer, specs, sticky booking card)
  booking/page.tsx      multi-step booking + confirmation
  contact/page.tsx      contact form + agencies + map placeholder
components/
  BookingWidget.tsx     search widget (hero and fleet page)
  CarCard.tsx           reusable car card
  ui/SectionHeading.tsx reusable section heading
  ui/Reveal.tsx         scroll reveal wrapper (GSAP)
  home/ fleet/ car/ booking/ contact/ layout/ providers/
data/
  cars.ts               mock fleet
  site.ts               brand, cities, extras, stats, steps, testimonials
lib/
  pricing.ts            rental days, weekly rate, extras, deposit
  format.ts             DZD and date formatting
  gsap.ts               GSAP plugin registration
```

## Accessibility and motion

- Semantic landmarks, labelled form fields, visible focus states, skip link, keyboard-usable filters and steps.
- `prefers-reduced-motion`: Lenis smoothing off, no Unicorn Studio (WebGL), no auto-loaded 3D model, no reveal/pinning animations.

## Notes

- Testimonials and statistics are fictional demo content.
- Booking and contact forms do not send anything; they simulate a submission.
