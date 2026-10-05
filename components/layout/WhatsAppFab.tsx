import { site } from "@/data/site";
import { IconWhatsApp } from "@/components/ui/Icons";

export default function WhatsAppFab() {
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Bonjour ${site.name}, j'ai une question sur une location.`)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire sur WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-[1.7rem] text-night shadow-[0_12px_30px_-10px_rgba(37,211,102,0.6)] transition-transform duration-500 hover:scale-105 md:bottom-7 md:right-7"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <IconWhatsApp />
    </a>
  );
}
