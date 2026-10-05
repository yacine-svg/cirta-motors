import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[80svh] flex-col justify-center pb-24 pt-40">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-5 font-display text-[clamp(4rem,14vw,11rem)] font-semibold uppercase leading-[0.85]">
        Mauvaise sortie<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-md text-mute">Cette page n&apos;existe pas ou a été déplacée.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">Retour à l&apos;accueil</Link>
        <Link href="/fleet" className="btn btn-ghost">Voir la flotte</Link>
      </div>
    </div>
  );
}
