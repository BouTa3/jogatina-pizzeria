import { createFileRoute } from "@tanstack/react-router";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  component: Index,
});

const MINI_PIZZE = [
  { name: "Fromage", price: "200" },
  { name: "Poulet", price: "300" },
  { name: "Viande", price: "300" },
  { name: "Thon", price: "300" },
  { name: "Poulet fumé", price: "300" },
];

const PANUOZZO = [
  { name: "Viande", price: "450" },
  { name: "Poulet", price: "450" },
  { name: "Légumes grillés", price: "350" },
  { name: "Poulet, lait fumé", price: "500" },
  { name: "3 fromages", price: "450" },
  { name: "Thon", price: "400" },
  { name: "Champignons", price: "400" },
];

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

const PHONE_DISPLAY = "0550 76 07 31";
const PHONE_TEL = "tel:+213550760731";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Pizzeria+Jogatina+Baraki+Alger";

function CallButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={PHONE_TEL}
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

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10">
      <a href="#top" className="jog-display text-lg font-bold" style={{ color: "var(--jog-ink)" }}>
        Jogatina
      </a>
      <nav className="hidden items-center gap-6 text-sm md:flex" style={{ color: "var(--jog-muted)" }}>
        <a href="#apropos" className="jog-nav-link">À propos</a>
        <a href="#menu" className="jog-nav-link">Menu</a>
        <a href="#avis" className="jog-nav-link">Avis</a>
        <a href="#infos" className="jog-nav-link">Infos</a>
      </nav>
      <CallButton className="text-xs md:text-sm" />
    </header>
  );
}

function About() {
  return (
    <section id="apropos" className="jog-page grid gap-10 px-5 py-24 md:grid-cols-2 md:gap-16 md:px-10 md:py-32">
      <div className="flex flex-col justify-center gap-5">
        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--jog-accent)" }}>
          À Baraki depuis toujours
        </span>
        <h2 className="jog-display text-4xl md:text-6xl">
          Une pizzeria de quartier, un vrai four à bois.
        </h2>
        <p className="max-w-[60ch] text-base leading-relaxed" style={{ color: "var(--jog-muted)" }}>
          Chez Jogatina, la pâte est étirée à la main et chaque pizza cuit face
          aux flammes. C'est ce feu de bois qui donne à la croûte son
          croustillant et sa fumée, pizza après pizza.
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
    <div className="jog-price-row flex items-baseline justify-between gap-4 border-b py-3" style={{ borderColor: "var(--jog-line)" }}>
      <span className="text-base" style={{ color: "var(--jog-ink)" }}>{name}</span>
      <span
        className="jog-display shrink-0 text-lg"
        style={{ color: "var(--jog-accent)" }}
      >
        {price} DA
      </span>
    </div>
  );
}

function Menu() {
  return (
    <section id="menu" className="px-5 py-24 md:px-10 md:py-32" style={{ background: "var(--jog-surface)" }}>
      <div className="mx-auto max-w-4xl">
        <h2 className="jog-display mb-14 text-4xl md:text-6xl">Notre carte</h2>
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h3 className="jog-display mb-4 text-xl" style={{ color: "var(--jog-accent)" }}>
              Mini pizze
            </h3>
            {MINI_PIZZE.map((item) => (
              <PriceRow key={item.name} name={item.name} price={item.price} />
            ))}
          </div>
          <div>
            <h3 className="jog-display mb-4 text-xl" style={{ color: "var(--jog-accent)" }}>
              Panuozzo
            </h3>
            {PANUOZZO.map((item) => (
              <PriceRow key={item.name} name={item.name} price={item.price} />
            ))}
          </div>
        </div>
        <p className="mt-10 text-sm" style={{ color: "var(--jog-muted)" }}>
          Egalement au menu : Pizza 4 Fromages, Pizza Vegetariano et nos pizzas
          napolitaines classiques. Demandez la carte complète sur place.
        </p>
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
    <section id="avis" className="px-5 py-24 md:px-10 md:py-32" style={{ background: "var(--jog-bg)" }}>
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

function InfoFooter() {
  return (
    <footer id="infos" className="px-5 py-24 md:px-10 md:py-32" style={{ background: "var(--jog-surface)" }}>
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
            {PHONE_DISPLAY}
          </p>
          <CallButton className="mt-4" />
        </div>
      </div>
      <p className="mx-auto mt-20 max-w-4xl text-xs" style={{ color: "var(--jog-muted)" }}>
        © {new Date().getFullYear()} Pizzeria Jogatina, Baraki.
      </p>
    </footer>
  );
}

function Index() {
  return (
    <main id="top" className="jog-page">
      <Nav />
      <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />
      <About />
      <Menu />
      <Gallery />
      <Reviews />
      <InfoFooter />
    </main>
  );
}
