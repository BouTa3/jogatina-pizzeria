import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";
import { submitReservation } from "@/lib/api/reservations.functions";
import { getMenu, type MenuItem } from "@/lib/api/menu.functions";
import { getSiteSettings, type SiteSettings } from "@/lib/api/settings.functions";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [menu, settings] = await Promise.all([getMenu(), getSiteSettings()]);
    return { menu, settings };
  },
  component: Index,
});

const REVIEWS = [
  {
    quote:
      "Franchement une pizza au feu de bois savoureuse avec des ingrédients frais, un service chaleureux et l'hygiène est irréprochable. Merci Walid.",
    author: "Avis Google",
  },
  {
    quote:
      "My husband and I have slowly become regulars at this locally owned business. Pizza is wood fire and the ingredients are fresh.",
    author: "Melissa G., Local Guide",
  },
  {
    quote:
      "يعطيكم الصحة، بيتزا بنينة ما شاء الله، وحتى le service نعمة التربية. ربي يقدركم، bravo.",
    author: "Hakim Azzouz",
  },
];

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Pizzeria+Jogatina+Baraki+Alger";

function CallButton({ phone, className = "" }: { phone: SiteSettings; className?: string }) {
  return (
    <a
      href={`tel:${phone.phoneE164}`}
      className={`jog-cta-fill inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform active:-translate-y-px active:scale-[0.98] ${className}`}
      style={{ background: "var(--jog-accent)", color: "var(--jog-accent-ink)" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
          fill="currentColor"
        />
      </svg>
      Appeler
    </a>
  );
}

function WhatsAppButton({ phone, className = "" }: { phone: SiteSettings; className?: string }) {
  const href = `https://wa.me/${phone.phoneE164.replace("+", "")}?text=${encodeURIComponent(
    "Bonjour, je voudrais passer une commande chez Jogatina.",
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`jog-cta-outline inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-transform active:-translate-y-px active:scale-[0.98] ${className}`}
      style={{ borderColor: "var(--jog-line)", color: "var(--jog-ink)" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.2L2 22l4.9-1.3C8.4 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm5.4 14.2c-.2.6-1.3 1.2-1.9 1.3-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.7.8 1.9.1.2.1.4 0 .6-.1.2-.2.3-.4.5-.2.2-.4.4-.5.6-.2.2-.4.4-.2.7.2.4.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.8.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.3.7-.2.3.1 1.7.8 2 1 .3.1.5.2.6.3.1.2.1.9-.1 1.5z"
          fill="currentColor"
        />
      </svg>
      WhatsApp
    </a>
  );
}

function DirectionsButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={MAPS_URL}
      target="_blank"
      rel="noreferrer"
      className={`jog-cta-outline inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-transform active:-translate-y-px active:scale-[0.98] ${className}`}
      style={{ borderColor: "var(--jog-line)", color: "var(--jog-ink)" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"
          fill="currentColor"
        />
      </svg>
      Itinéraire
    </a>
  );
}

function Nav({ phone }: { phone: SiteSettings }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10">
      <a href="#top" className="jog-display text-lg font-bold" style={{ color: "var(--jog-ink)" }}>
        Jogatina
      </a>
      <nav
        className="hidden items-center gap-6 text-sm md:flex"
        style={{ color: "var(--jog-muted)" }}
      >
        <a href="#apropos" className="jog-nav-link">
          À propos
        </a>
        <a href="#menu" className="jog-nav-link">
          Menu
        </a>
        <a href="#reservation" className="jog-nav-link">
          Réserver
        </a>
        <a href="#avis" className="jog-nav-link">
          Avis
        </a>
        <a href="#infos" className="jog-nav-link">
          Infos
        </a>
      </nav>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex">
          <WhatsAppButton phone={phone} className="text-xs md:text-sm" />
        </span>
        <CallButton phone={phone} className="text-xs md:text-sm" />
      </div>
    </header>
  );
}

function About() {
  return (
    <section
      id="apropos"
      className="jog-page grid gap-10 px-5 py-24 md:grid-cols-2 md:gap-16 md:px-10 md:py-32"
    >
      <div className="flex flex-col justify-center gap-5">
        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--jog-accent)" }}>
          À Baraki depuis toujours
        </span>
        <h2 className="jog-display text-4xl md:text-6xl">
          Une pizzeria de quartier, un vrai four à bois.
        </h2>
        <p className="max-w-[60ch] text-base leading-relaxed" style={{ color: "var(--jog-muted)" }}>
          Chez Jogatina, la pâte est étirée à la main et chaque pizza cuit face aux flammes. C'est
          ce feu de bois qui donne à la croûte son croustillant et sa fumée, pizza après pizza.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <span className="jog-display text-2xl">4.2</span>
          <div className="flex flex-col text-xs" style={{ color: "var(--jog-muted)" }}>
            <span>★★★★☆</span>
            <span>141 avis Google</span>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl">
        <img
          src="/assets/gallery/interior.jpg"
          alt="Salle de la pizzeria Jogatina, ambiance chaleureuse"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </section>
  );
}

function PriceRow({ name, price }: { name: string; price: string }) {
  return (
    <div
      className="jog-price-row flex items-baseline justify-between gap-4 border-b py-3"
      style={{ borderColor: "var(--jog-line)" }}
    >
      <span className="text-base" style={{ color: "var(--jog-ink)" }}>
        {name}
      </span>
      <span className="jog-display shrink-0 text-lg" style={{ color: "var(--jog-accent)" }}>
        {price} DA
      </span>
    </div>
  );
}

function groupByCategory(items: MenuItem[]) {
  const groups = new Map<string, MenuItem[]>();
  for (const item of items) {
    const group = groups.get(item.category);
    if (group) {
      group.push(item);
    } else {
      groups.set(item.category, [item]);
    }
  }
  return [...groups.entries()];
}

function Menu({ items, phone }: { items: MenuItem[]; phone: SiteSettings }) {
  const categories = groupByCategory(items);

  return (
    <section
      id="menu"
      className="px-5 py-24 md:px-10 md:py-32"
      style={{ background: "var(--jog-surface)" }}
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="jog-display mb-14 text-4xl md:text-6xl">Notre carte</h2>
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          {categories.map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="jog-display mb-4 text-xl" style={{ color: "var(--jog-accent)" }}>
                {category}
              </h3>
              {categoryItems.map((item) => (
                <PriceRow key={item.id} name={item.name} price={item.price} />
              ))}
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm" style={{ color: "var(--jog-muted)" }}>
          Egalement au menu : Pizza 4 Fromages, Pizza Vegetariano et nos pizzas napolitaines
          classiques. Demandez la carte complète sur place.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppButton phone={phone} />
          <CallButton phone={phone} />
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="grid gap-1 px-1 py-1 md:grid-cols-5">
      <div className="md:col-span-3">
        <img
          src="/assets/gallery/hero-plate.jpg"
          alt="Pizza au feu de bois fraîchement sortie du four"
          className="h-[320px] w-full object-cover md:h-[520px]"
          loading="lazy"
        />
      </div>
      <div className="md:col-span-2">
        <img
          src="/assets/gallery/burrata.jpg"
          alt="Pizza gourmande à la burrata"
          className="h-[320px] w-full object-cover md:h-[520px]"
          loading="lazy"
        />
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section
      id="avis"
      className="px-5 py-24 md:px-10 md:py-32"
      style={{ background: "var(--jog-bg)" }}
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="jog-display mb-14 text-4xl md:text-6xl">Ce qu'on en dit</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <blockquote key={review.author} className="flex flex-col gap-4">
              <p className="text-base leading-relaxed" style={{ color: "var(--jog-ink)" }}>
                "{review.quote}"
              </p>
              <cite className="not-italic text-sm" style={{ color: "var(--jog-muted)" }}>
                {review.author}
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reservation({ phone }: { phone: SiteSettings }) {
  const [renderedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const data = new FormData(form);
    const partySizeRaw = data.get("partySize");

    try {
      await submitReservation({
        data: {
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          partySize: partySizeRaw ? Number(partySizeRaw) : undefined,
          requestedAt: String(data.get("requestedAt") ?? "") || undefined,
          message: String(data.get("message") ?? "") || undefined,
          website: String(data.get("website") ?? ""),
          renderedAt,
        },
      });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="reservation"
      className="px-5 py-24 md:px-10 md:py-32"
      style={{ background: "var(--jog-bg)" }}
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="jog-display mb-4 text-4xl md:text-6xl">Réserver une table</h2>
        <p className="mb-10 text-base" style={{ color: "var(--jog-muted)" }}>
          Laissez-nous vos coordonnées, on vous rappelle pour confirmer. Pour une réponse immédiate,
          appelez-nous ou écrivez sur WhatsApp.
        </p>

        {status === "success" ? (
          <p className="text-base" style={{ color: "var(--jog-ink)" }}>
            Merci ! Votre demande a bien été envoyée, on vous recontacte vite au numéro indiqué.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="jog-honeypot"
            />
            <div className="grid gap-5 md:grid-cols-2">
              <label className="jog-field">
                <span className="jog-field-label">Nom *</span>
                <input
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  className="jog-input"
                />
              </label>
              <label className="jog-field">
                <span className="jog-field-label">Téléphone *</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  minLength={8}
                  maxLength={20}
                  className="jog-input"
                />
              </label>
              <label className="jog-field">
                <span className="jog-field-label">Nombre de personnes</span>
                <input name="partySize" type="number" min={1} max={50} className="jog-input" />
              </label>
              <label className="jog-field">
                <span className="jog-field-label">Date et heure souhaitées</span>
                <input
                  name="requestedAt"
                  type="text"
                  placeholder="Ex : vendredi soir vers 20h"
                  maxLength={120}
                  className="jog-input"
                />
              </label>
            </div>
            <label className="jog-field">
              <span className="jog-field-label">Message (optionnel)</span>
              <textarea name="message" rows={3} maxLength={1000} className="jog-textarea" />
            </label>

            {status === "error" ? (
              <p role="alert" className="text-sm" style={{ color: "var(--jog-accent)" }}>
                Une erreur est survenue. Vous pouvez aussi nous appeler directement au{" "}
                {phone.phoneDisplay}.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="jog-cta-fill inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform active:-translate-y-px active:scale-[0.98] disabled:opacity-60"
              style={{ background: "var(--jog-accent)", color: "var(--jog-accent-ink)" }}
            >
              {status === "submitting" ? "Envoi..." : "Envoyer la demande"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function InfoFooter({ phone }: { phone: SiteSettings }) {
  return (
    <footer
      id="infos"
      className="px-5 py-24 md:px-10 md:py-32"
      style={{ background: "var(--jog-surface)" }}
    >
      <div className="mx-auto grid max-w-4xl gap-14 md:grid-cols-3">
        <div>
          <h3 className="jog-display mb-3 text-xl">Horaires</h3>
          <p className="text-base" style={{ color: "var(--jog-muted)" }}>
            Ouvert tous les jours à partir de 16h.
          </p>
        </div>
        <div>
          <h3 className="jog-display mb-3 text-xl">Adresse</h3>
          <p className="text-base" style={{ color: "var(--jog-muted)" }}>
            Lot 607, Baraki, Alger
          </p>
          <DirectionsButton className="mt-4" />
        </div>
        <div>
          <h3 className="jog-display mb-3 text-xl">Contact</h3>
          <p className="text-base" style={{ color: "var(--jog-muted)" }}>
            {phone.phoneDisplay}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <CallButton phone={phone} />
            <WhatsAppButton phone={phone} />
          </div>
        </div>
      </div>
      <p className="mx-auto mt-20 max-w-4xl text-xs" style={{ color: "var(--jog-muted)" }}>
        © {new Date().getFullYear()} Pizzeria Jogatina, Baraki.
      </p>
    </footer>
  );
}

const STRUCTURED_DATA_BASE = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Pizzeria Jogatina",
  servesCuisine: "Pizza",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lot 607",
    addressLocality: "Baraki, Alger",
    addressCountry: "DZ",
  },
  url: MAPS_URL,
  openingHours: "Mo-Su 16:00-23:59",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.2",
    reviewCount: "141",
  },
};

function Index() {
  const { menu, settings } = Route.useLoaderData();
  const structuredData = { ...STRUCTURED_DATA_BASE, telephone: settings.phoneE164 };

  return (
    <main id="top" className="jog-page">
      {/* JSON-LD built from the module-level constant plus the admin-editable
          phone number — no free-form user input reaches this. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav phone={settings} />
      <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />
      <About />
      <Menu items={menu} phone={settings} />
      <Gallery />
      <Reviews />
      <Reservation phone={settings} />
      <InfoFooter phone={settings} />
    </main>
  );
}
