"use client";

import { useState, type FormEvent } from "react";
import { cities } from "@/data/site";
import { IconArrow, IconCheck } from "@/components/ui/Icons";

type Fields = { name: string; phone: string; email: string; city: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const SUBJECTS = ["Réservation", "Location longue durée", "Mariage ou événement", "Entreprise", "Autre"];

export default function ContactForm() {
  const [f, setF] = useState<Fields>({ name: "", phone: "", email: "", city: cities[0].id, subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof Fields, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err: Errors = {};
    if (f.name.trim().length < 2) err.name = "Indiquez votre nom.";
    const phone = f.phone.replace(/[\s.-]/g, "").replace(/^\+213/, "0");
    if (!/^0[567]\d{8}$/.test(phone)) err.phone = "Numéro mobile : 10 chiffres commençant par 05, 06 ou 07.";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) err.email = "Adresse e-mail invalide.";
    if (f.message.trim().length < 10) err.message = "Écrivez au moins quelques mots.";
    setErrors(err);
    if (Object.keys(err).length) {
      const first = Object.keys(err)[0];
      document.getElementById(`ct-${first}`)?.focus();
      return;
    }
    setSending(true);
    // Demo only: no backend.
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1100);
  }

  if (sent) {
    return (
      <div className="rounded-[3px] border border-line bg-coal p-8 md:p-12" role="status">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-accent text-2xl text-accent">
          <IconCheck />
        </span>
        <h2 className="mt-8 font-display text-5xl font-semibold uppercase leading-none">Message envoyé.</h2>
        <p className="mt-4 max-w-md text-bone/80">Merci {f.name.split(" ")[0]}. Nous vous répondons dans la journée, généralement en moins d&apos;une heure.</p>
        <p className="mt-6 text-xs text-mute">Démonstration : aucun message réel n&apos;a été envoyé.</p>
        <button type="button" className="btn btn-ghost mt-8" onClick={() => { setSent(false); setF((p) => ({ ...p, message: "" })); }}>
          Envoyer un autre message
        </button>
      </div>
    );
  }

  const inv = (k: keyof Fields) => ({
    id: `ct-${k}`,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `ct-${k}-error` : undefined,
  });
  const Err = ({ k }: { k: keyof Fields }) =>
    errors[k] ? (
      <p id={`ct-${k}-error`} className="field-error" role="alert">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 rounded-[3px] border border-line bg-coal p-6 md:grid-cols-2 md:p-10">
      <div>
        <label htmlFor="ct-name" className="label">Nom et prénom</label>
        <input {...inv("name")} className="field" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} />
        <Err k="name" />
      </div>
      <div>
        <label htmlFor="ct-phone" className="label">Téléphone</label>
        <input {...inv("phone")} type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="05 / 06 / 07 …" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        <Err k="phone" />
      </div>
      <div>
        <label htmlFor="ct-email" className="label">E-mail (facultatif)</label>
        <input {...inv("email")} type="email" className="field" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
        <Err k="email" />
      </div>
      <div>
        <label htmlFor="ct-city" className="label">Agence</label>
        <select {...inv("city")} className="field" value={f.city} onChange={(e) => set("city", e.target.value)}>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="ct-subject" className="label">Sujet</label>
        <select {...inv("subject")} className="field" value={f.subject} onChange={(e) => set("subject", e.target.value)}>
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="ct-message" className="label">Message</label>
        <textarea {...inv("message")} rows={5} className="field" value={f.message} onChange={(e) => set("message", e.target.value)} />
        <Err k="message" />
      </div>
      <div className="md:col-span-2">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "Envoi…" : (<>Envoyer le message <IconArrow /></>)}
        </button>
      </div>
    </form>
  );
}
