import type { Metadata, Viewport } from "next";
import { Antonio, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import { site } from "@/data/site";

const display = Antonio({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display-face",
  display: "swap",
});
const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Location de voitures premium en Algérie`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    siteName: site.name,
    title: `${site.name} · Location de voitures premium`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="grain min-h-screen">
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <SmoothScroll>
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
        </SmoothScroll>
        <WhatsAppFab />
      </body>
    </html>
  );
}
