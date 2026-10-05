// Brand settings. Change the name, contacts and cities here.
// The accent color lives in app/globals.css (--color-accent).

export const site = {
  name: "Cirta Motors",
  wordmark: "CIRTA",
  suffix: "MOTORS",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cirta-motors.vercel.app",
  description:
    "Location de voitures premium à Constantine, Alger et Oran. Berlines, SUV et vans haut de gamme, livrés à l'aéroport. Annulation gratuite, assistance 24/7.",
  whatsapp: "213561913869",
  phone: "+213 561 91 38 69",
  email: "contact@cirta-motors.dz",
  // Unicorn Studio embed ID for the hero background.
  // Set NEXT_PUBLIC_UNICORN_PROJECT_ID in Vercel, or replace the placeholder below.
  unicornProjectId: process.env.NEXT_PUBLIC_UNICORN_PROJECT_ID ?? "[UNICORN_PROJECT_ID]",
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
  },
};

export interface City {
  id: string;
  name: string;
  airport: string;
  address: string;
  hours: string;
  phone: string;
  mapQuery: string;
}

export const cities: City[] = [
  {
    id: "constantine",
    name: "Constantine",
    airport: "Aéroport Mohamed Boudiaf",
    address: "Boulevard de l'Indépendance, Constantine",
    hours: "7j/7 · 07:00 – 23:00",
    phone: "+213 31 00 00 01",
    mapQuery: "Aéroport Mohamed Boudiaf Constantine",
  },
  {
    id: "alger",
    name: "Alger",
    airport: "Aéroport Houari Boumediene",
    address: "Chemin Doudou Mokhtar, Hydra, Alger",
    hours: "24h/24 · 7j/7",
    phone: "+213 21 00 00 02",
    mapQuery: "Aéroport Houari Boumediene Alger",
  },
  {
    id: "oran",
    name: "Oran",
    airport: "Aéroport Ahmed Ben Bella",
    address: "Boulevard du Front de Mer, Oran",
    hours: "7j/7 · 07:00 – 23:00",
    phone: "+213 41 00 00 03",
    mapQuery: "Aéroport Ahmed Ben Bella Oran",
  },
];

export const cityName = (id: string) => cities.find((c) => c.id === id)?.name ?? id;

export interface Extra {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
}

export const extras: Extra[] = [
  { id: "child-seat", name: "Siège enfant", description: "Siège ou réhausseur adapté à l'âge de l'enfant.", pricePerDay: 600 },
  { id: "gps", name: "GPS", description: "Cartes de l'Algérie à jour, en français et en arabe.", pricePerDay: 500 },
  { id: "extra-driver", name: "Conducteur additionnel", description: "Un deuxième conducteur couvert par l'assurance.", pricePerDay: 1000 },
  { id: "insurance", name: "Assurance Sérénité", description: "Franchise à 0 DA et caution réduite de moitié.", pricePerDay: 3000 },
];

export const ONE_WAY_FEE = 8000;

export const benefits = [
  { icon: "cancel", title: "Annulation gratuite", text: "Changez d'avis jusqu'à 48 heures avant le départ, sans frais." },
  { icon: "plane", title: "Livraison à l'aéroport", text: "Votre voiture vous attend à l'arrivée, à Alger, Constantine ou Oran." },
  { icon: "support", title: "Assistance 24/7", text: "Une vraie personne au téléphone, de jour comme de nuit, partout en Algérie." },
  { icon: "tag", title: "Aucun frais caché", text: "Le prix affiché est le prix payé. Caution et kilométrage annoncés à l'avance." },
] as const;

export const stats = [
  { value: 86, suffix: "", label: "véhicules premium" },
  { value: 3, suffix: "", label: "villes et aéroports" },
  { value: 12400, suffix: "+", label: "locations réalisées" },
  { value: 24, suffix: "/7", label: "assistance routière" },
];

export const steps = [
  { title: "Choisir", text: "Vos dates, votre ville et la voiture qui vous ressemble. Le prix total s'affiche immédiatement." },
  { title: "Réserver", text: "Quelques informations, aucune avance demandée en ligne. Un conseiller confirme sous une heure." },
  { title: "Conduire", text: "Récupérez les clés à l'agence, à l'aéroport ou à votre porte. Bonne route." },
];

// Fictional testimonials for the demo.
export const testimonials = [
  { name: "Yanis B.", city: "Constantine", car: "Mercedes Classe E", quote: "Voiture livrée à l'aéroport à minuit, impeccable. Le conseiller m'a appelé pour vérifier que tout allait bien le lendemain." },
  { name: "Sarah M.", city: "Alger", car: "Classe V avec chauffeur", quote: "Nous l'avons prise pour le mariage de ma sœur. Ponctuel, élégant, et le prix était exactement celui annoncé." },
  { name: "Karim H.", city: "Oran", car: "Land Cruiser Prado", quote: "Dix jours dans le Sud sans le moindre souci. On sent que les voitures sont vraiment entretenues." },
];
