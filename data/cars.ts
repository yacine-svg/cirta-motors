// Mock fleet for the demo. Replace images with real photos of the agency's cars
// and drop a .glb file per car in /public/models/<slug>.glb to enable the 3D viewer.

export type Category = "economy" | "suv" | "luxury" | "van";
export type Transmission = "Automatique" | "Manuelle";
export type Fuel = "Essence" | "Diesel" | "Hybride";

export interface CarImage {
  src: string;
  alt: string;
}

export interface CarColor {
  name: string;
  hex: string;
}

export interface Car {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  year: number;
  seats: number;
  doors: number;
  bags: number;
  transmission: Transmission;
  fuel: Fuel;
  power: string;
  consumption: string;
  pricePerDay: number;
  pricePerWeek: number;
  deposit: number;
  minAge: number;
  tagline: string;
  description: string;
  features: string[];
  colors: CarColor[];
  images: CarImage[];
  model: string;
  featured: boolean;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  economy: "Économique",
  suv: "SUV",
  luxury: "Luxe",
  van: "Van",
};

export const CATEGORIES: Category[] = ["economy", "suv", "luxury", "van"];

const unsplash = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const COMMON = ["300 km inclus par jour", "Assurance tous risques de base", "Assistance routière 24/7"];

export const cars: Car[] = [
  {
    slug: "volkswagen-golf-8",
    name: "Volkswagen Golf 8",
    brand: "Volkswagen",
    category: "economy",
    year: 2024,
    seats: 5,
    doors: 5,
    bags: 3,
    transmission: "Automatique",
    fuel: "Essence",
    power: "150 ch",
    consumption: "5,8 L/100 km",
    pricePerDay: 8500,
    pricePerWeek: 51000,
    deposit: 80000,
    minAge: 21,
    tagline: "La compacte qui fait tout bien.",
    description:
      "Boîte DSG, conduite souple et coffre généreux : la Golf est parfaite pour la ville comme pour un aller-retour Alger – Constantine.",
    features: ["Apple CarPlay & Android Auto", "Climatisation automatique", "Caméra de recul", "Régulateur de vitesse", ...COMMON],
    colors: [
      { name: "Blanc Oryx", hex: "#ECECE8" },
      { name: "Gris Moonstone", hex: "#7C8086" },
      { name: "Noir Intense", hex: "#141518" },
      { name: "Bleu Atlantique", hex: "#24476B" },
    ],
    images: [
      { src: unsplash("photo-1630019499081-50ed7838a1cd"), alt: "Volkswagen blanche sur la route en plein jour" },
      { src: unsplash("photo-1634690218629-16ffd0a7ae5d"), alt: "Volkswagen blanche roulant sur une route" },
    ],
    model: "/models/volkswagen-golf-8.glb",
    featured: true,
  },
  {
    slug: "renault-clio-5",
    name: "Renault Clio 5",
    brand: "Renault",
    category: "economy",
    year: 2024,
    seats: 5,
    doors: 5,
    bags: 2,
    transmission: "Manuelle",
    fuel: "Diesel",
    power: "100 ch",
    consumption: "4,1 L/100 km",
    pricePerDay: 6500,
    pricePerWeek: 39000,
    deposit: 60000,
    minAge: 21,
    tagline: "Économe, agile, facile à garer.",
    description:
      "La citadine idéale pour circuler en ville et faire de longues distances sans se ruiner en carburant.",
    features: ["Écran tactile 9,3\"", "Climatisation", "Aide au stationnement arrière", "Bluetooth", ...COMMON],
    colors: [
      { name: "Rouge Flamme", hex: "#B3262B" },
      { name: "Blanc Glacier", hex: "#F1F1EE" },
      { name: "Gris Titanium", hex: "#6B6F75" },
    ],
    images: [{ src: unsplash("photo-1565786089437-496904c48734"), alt: "Citadine rouge 5 portes" }],
    model: "/models/renault-clio-5.glb",
    featured: false,
  },
  {
    slug: "peugeot-208-gt",
    name: "Peugeot 208 GT",
    brand: "Peugeot",
    category: "economy",
    year: 2024,
    seats: 5,
    doors: 5,
    bags: 2,
    transmission: "Automatique",
    fuel: "Essence",
    power: "130 ch",
    consumption: "5,4 L/100 km",
    pricePerDay: 7500,
    pricePerWeek: 45000,
    deposit: 70000,
    minAge: 21,
    tagline: "Le style en finition GT.",
    description:
      "i-Cockpit 3D, boîte automatique et finition GT : une citadine qui a du caractère.",
    features: ["i-Cockpit 3D", "Boîte automatique EAT8", "Caméra de recul", "Recharge sans fil", ...COMMON],
    colors: [
      { name: "Gris Artense", hex: "#8A8D90" },
      { name: "Bleu Vertigo", hex: "#2B4FA0" },
      { name: "Noir Perla", hex: "#121315" },
    ],
    images: [
      { src: unsplash("photo-1571388429034-9ce53dbf0047"), alt: "Citadine argentée garée au milieu de la route" },
      { src: unsplash("photo-1563456162079-bdcab0fe5f2f"), alt: "Citadine grise sur la route" },
    ],
    model: "/models/peugeot-208-gt.glb",
    featured: false,
  },
  {
    slug: "hyundai-tucson-hybrid",
    name: "Hyundai Tucson",
    brand: "Hyundai",
    category: "suv",
    year: 2024,
    seats: 5,
    doors: 5,
    bags: 4,
    transmission: "Automatique",
    fuel: "Hybride",
    power: "230 ch",
    consumption: "6,0 L/100 km",
    pricePerDay: 14000,
    pricePerWeek: 84000,
    deposit: 150000,
    minAge: 23,
    tagline: "Le SUV familial, en version hybride.",
    description:
      "Spacieux, silencieux et sobre : le Tucson hybride avale les kilomètres en famille, de Tipaza aux Aurès.",
    features: ["Toit panoramique", "Sièges chauffants", "Régulateur adaptatif", "Caméra 360°", ...COMMON],
    colors: [
      { name: "Blanc Pur", hex: "#F2F2EF" },
      { name: "Vert Amazonie", hex: "#3B4A3A" },
      { name: "Noir Phantom", hex: "#111214" },
    ],
    images: [{ src: unsplash("photo-1603094543704-64cdce2d2532"), alt: "SUV blanc sur la route en journée" }],
    model: "/models/hyundai-tucson-hybrid.glb",
    featured: true,
  },
  {
    slug: "toyota-land-cruiser-prado",
    name: "Land Cruiser Prado",
    brand: "Toyota",
    category: "suv",
    year: 2024,
    seats: 7,
    doors: 5,
    bags: 5,
    transmission: "Automatique",
    fuel: "Diesel",
    power: "204 ch",
    consumption: "8,7 L/100 km",
    pricePerDay: 22000,
    pricePerWeek: 132000,
    deposit: 250000,
    minAge: 25,
    tagline: "Taillé pour le Grand Sud.",
    description:
      "Quatre roues motrices, sept places et une fiabilité légendaire : le partenaire idéal pour Ghardaïa, Djanet ou Tamanrasset.",
    features: ["4x4 permanent", "7 places", "Blocage de différentiel", "Climatisation tri-zone", ...COMMON],
    colors: [
      { name: "Noir Attitude", hex: "#151618" },
      { name: "Argent Métal", hex: "#A9ADB1" },
      { name: "Sable Dune", hex: "#C9B48D" },
    ],
    images: [
      { src: unsplash("photo-1650530579355-7ad9d4766043"), alt: "Toyota Land Cruiser noir garé devant un bâtiment" },
      { src: unsplash("photo-1554841649-de947c4b954a"), alt: "Toyota Land Cruiser argenté garé en plein jour" },
      { src: unsplash("photo-1637189315455-3e7e629a05b9"), alt: "SUV roulant dans le désert" },
    ],
    model: "/models/toyota-land-cruiser-prado.glb",
    featured: true,
  },
  {
    slug: "range-rover-sport",
    name: "Range Rover Sport",
    brand: "Land Rover",
    category: "suv",
    year: 2024,
    seats: 5,
    doors: 5,
    bags: 4,
    transmission: "Automatique",
    fuel: "Hybride",
    power: "400 ch",
    consumption: "7,9 L/100 km",
    pricePerDay: 45000,
    pricePerWeek: 270000,
    deposit: 500000,
    minAge: 27,
    tagline: "Le luxe, partout.",
    description:
      "Puissance, confort de salon et présence imposante : le Range Rover Sport pour les grandes occasions et les déplacements d'affaires.",
    features: ["Suspension pneumatique", "Sièges massants", "Son Meridian", "Affichage tête haute", ...COMMON],
    colors: [
      { name: "Noir Santorini", hex: "#121315" },
      { name: "Gris Eiger", hex: "#5C6064" },
      { name: "Blanc Fuji", hex: "#EFEFEC" },
    ],
    images: [
      { src: unsplash("photo-1563458563737-e60b1f1b345f"), alt: "Range Rover noir" },
      { src: unsplash("photo-1602013871952-8379f19a15f1"), alt: "Range Rover Sport noir vu de l'arrière" },
      { src: unsplash("photo-1740695600568-a7e54e7d3614"), alt: "Range Rover noir garé dans une rue sombre" },
    ],
    model: "/models/range-rover-sport.glb",
    featured: true,
  },
  {
    slug: "mercedes-classe-c",
    name: "Mercedes Classe C",
    brand: "Mercedes-Benz",
    category: "luxury",
    year: 2024,
    seats: 5,
    doors: 4,
    bags: 3,
    transmission: "Automatique",
    fuel: "Diesel",
    power: "200 ch",
    consumption: "5,2 L/100 km",
    pricePerDay: 18000,
    pricePerWeek: 108000,
    deposit: 250000,
    minAge: 25,
    tagline: "L'élégance au quotidien.",
    description:
      "Intérieur raffiné, technologie MBUX et confort de grande routière : la référence pour les rendez-vous d'affaires.",
    features: ["MBUX avec écran 11,9\"", "Sièges cuir", "Éclairage d'ambiance", "Aide au maintien de voie", ...COMMON],
    colors: [
      { name: "Blanc Polaire", hex: "#F1F1EE" },
      { name: "Argent Iridium", hex: "#A7AAAE" },
      { name: "Noir Obsidienne", hex: "#101113" },
    ],
    images: [
      { src: unsplash("photo-1605556816125-d752c226247b"), alt: "Mercedes-Benz blanche sur la route en journée" },
      { src: unsplash("photo-1551836989-b4622a17a792"), alt: "Mercedes-Benz argentée" },
      { src: unsplash("photo-1625690180114-5530b1304127"), alt: "Intérieur noir d'une Mercedes-Benz" },
    ],
    model: "/models/mercedes-classe-c.glb",
    featured: true,
  },
  {
    slug: "mercedes-classe-e",
    name: "Mercedes Classe E",
    brand: "Mercedes-Benz",
    category: "luxury",
    year: 2025,
    seats: 5,
    doors: 4,
    bags: 4,
    transmission: "Automatique",
    fuel: "Hybride",
    power: "313 ch",
    consumption: "1,4 L/100 km",
    pricePerDay: 26000,
    pricePerWeek: 156000,
    deposit: 350000,
    minAge: 25,
    tagline: "La berline de direction.",
    description:
      "Silence de fonctionnement, sièges massants et finitions d'exception : la Classe E pour vos invités et vos événements.",
    features: ["Superscreen MBUX", "Sièges massants", "Son Burmester", "Pack Night", ...COMMON],
    colors: [
      { name: "Noir Obsidienne", hex: "#101113" },
      { name: "Bleu Nautique", hex: "#1D2A40" },
      { name: "Gris Graphite", hex: "#45484C" },
    ],
    images: [
      { src: unsplash("photo-1618373444305-3a77b7719a59"), alt: "Mercedes-Benz noire, phares allumés, sur une route mouillée" },
      { src: unsplash("photo-1542230387-bfc77d26903e"), alt: "Mercedes-Benz noire sur la route" },
    ],
    model: "/models/mercedes-classe-e.glb",
    featured: true,
  },
  {
    slug: "bmw-m3-competition",
    name: "BMW M3 Competition",
    brand: "BMW",
    category: "luxury",
    year: 2024,
    seats: 4,
    doors: 4,
    bags: 2,
    transmission: "Automatique",
    fuel: "Essence",
    power: "510 ch",
    consumption: "10,2 L/100 km",
    pricePerDay: 40000,
    pricePerWeek: 240000,
    deposit: 500000,
    minAge: 28,
    tagline: "Quand le trajet devient l'événement.",
    description:
      "510 chevaux, propulsion et sièges baquets : réservée aux conducteurs expérimentés, sur présentation de 5 ans de permis.",
    features: ["Sièges baquets M Carbon", "Échappement M Sport", "Mode M Drive", "Affichage tête haute", ...COMMON],
    colors: [
      { name: "Noir Saphir", hex: "#0F1012" },
      { name: "Blanc Alpin", hex: "#F3F3F0" },
      { name: "Vert Isle of Man", hex: "#1F5A45" },
    ],
    images: [
      { src: unsplash("photo-1625690096555-a0a4d190901c"), alt: "BMW M3 noire garée sur un sol en béton gris" },
      { src: unsplash("photo-1584936684506-c3a7086e8212"), alt: "BMW M3 blanche" },
    ],
    model: "/models/bmw-m3-competition.glb",
    featured: true,
  },
  {
    slug: "audi-a6",
    name: "Audi A6",
    brand: "Audi",
    category: "luxury",
    year: 2024,
    seats: 5,
    doors: 4,
    bags: 4,
    transmission: "Automatique",
    fuel: "Diesel",
    power: "204 ch",
    consumption: "5,4 L/100 km",
    pricePerDay: 22000,
    pricePerWeek: 132000,
    deposit: 300000,
    minAge: 25,
    tagline: "La grande routière discrète.",
    description:
      "Quattro, Virtual Cockpit et insonorisation soignée : pour avaler Alger – Oran sans fatigue.",
    features: ["Transmission quattro", "Virtual Cockpit", "Matrix LED", "Sièges chauffants", ...COMMON],
    colors: [
      { name: "Gris Daytona", hex: "#3E4044" },
      { name: "Argent Fleuret", hex: "#B5B8BB" },
      { name: "Blanc Glacier", hex: "#F0F0ED" },
    ],
    images: [
      { src: unsplash("photo-1556391362-d3d11d98e510"), alt: "Berline Audi grise" },
      { src: unsplash("photo-1540066019607-e5f69323a8dc"), alt: "Berline Audi argentée garée dans la rue" },
    ],
    model: "/models/audi-a6.glb",
    featured: false,
  },
  {
    slug: "mercedes-classe-v",
    name: "Mercedes Classe V",
    brand: "Mercedes-Benz",
    category: "van",
    year: 2024,
    seats: 7,
    doors: 5,
    bags: 6,
    transmission: "Automatique",
    fuel: "Diesel",
    power: "190 ch",
    consumption: "7,1 L/100 km",
    pricePerDay: 28000,
    pricePerWeek: 168000,
    deposit: 300000,
    minAge: 25,
    tagline: "Le salon roulant.",
    description:
      "Sièges capitaine face à face, portes coulissantes électriques : parfait pour les mariages, les délégations et les transferts aéroport. Chauffeur disponible.",
    features: ["Sièges capitaine en cuir", "Portes coulissantes électriques", "Tablette centrale", "Chauffeur sur demande", ...COMMON],
    colors: [
      { name: "Noir Obsidienne", hex: "#101113" },
      { name: "Gris Sélénite", hex: "#7A7D81" },
    ],
    images: [{ src: unsplash("photo-1765461734605-34657fa04db2"), alt: "Van Mercedes sombre, phares allumés" }],
    model: "/models/mercedes-classe-v.glb",
    featured: true,
  },
  {
    slug: "volkswagen-transporter",
    name: "Volkswagen Transporter",
    brand: "Volkswagen",
    category: "van",
    year: 2023,
    seats: 9,
    doors: 4,
    bags: 8,
    transmission: "Manuelle",
    fuel: "Diesel",
    power: "150 ch",
    consumption: "7,8 L/100 km",
    pricePerDay: 15000,
    pricePerWeek: 90000,
    deposit: 150000,
    minAge: 25,
    tagline: "Neuf places, zéro compromis.",
    description:
      "La solution pour les familles nombreuses, les équipes sportives et les voyages en groupe.",
    features: ["9 places", "Climatisation arrière", "Grand coffre", "Bluetooth", ...COMMON],
    colors: [
      { name: "Bleu Ravenna", hex: "#2E4D7A" },
      { name: "Blanc Candy", hex: "#F2F2EF" },
    ],
    images: [{ src: unsplash("photo-1638313929075-07b292785dd7"), alt: "Van bleu roulant sur une piste de terre" }],
    model: "/models/volkswagen-transporter.glb",
    featured: false,
  },
];

export function getCar(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

export const featuredCars = cars.filter((c) => c.featured);

export const PRICE_MIN = Math.min(...cars.map((c) => c.pricePerDay));
export const PRICE_MAX = Math.max(...cars.map((c) => c.pricePerDay));
