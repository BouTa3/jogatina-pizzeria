import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { adminLogin, adminLogout, checkAdminAuth } from "@/lib/api/auth.functions";
import {
  listReservations,
  updateReservationStatus,
  type Reservation,
} from "@/lib/api/reservations.functions";
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItem,
} from "@/lib/api/menu.functions";
import { getSiteSettings, updatePhoneNumber, type SiteSettings } from "@/lib/api/settings.functions";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const { authenticated } = await checkAdminAuth();
    if (!authenticated) {
      return { authenticated: false as const };
    }
    const [reservations, menu, settings] = await Promise.all([
      listReservations(),
      getMenu(),
      getSiteSettings(),
    ]);
    return { authenticated: true as const, reservations, menu, settings };
  },
  component: AdminPage,
});

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await adminLogin({ data: { password } });
      onSuccess();
    } catch {
      // Never surface the raw thrown error here (it can be a Zod validation
      // dump, not just a wrong-password message) — a login form should only
      // ever show one generic message.
      setError("Mot de passe incorrect.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="jog-page flex min-h-dvh items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-5">
        <h1 className="jog-display text-3xl">Espace admin</h1>
        <label className="jog-field">
          <span className="jog-field-label">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoFocus
            className="jog-input"
          />
        </label>
        {error ? (
          <p role="alert" className="text-sm" style={{ color: "var(--jog-accent)" }}>
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="jog-cta-fill inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
          style={{ background: "var(--jog-accent)", color: "var(--jog-accent-ink)" }}
        >
          {pending ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

function ReservationsPanel({
  reservations,
  onChange,
}: {
  reservations: Reservation[];
  onChange: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  async function toggleStatus(reservation: Reservation) {
    setError(null);
    try {
      const status = reservation.status === "done" ? "new" : "done";
      await updateReservationStatus({ data: { id: reservation.id, status } });
      onChange();
    } catch {
      setError("Échec de la mise à jour. Réessayez.");
    }
  }

  return (
    <section>
      <h2 className="jog-display mb-6 text-2xl">Réservations</h2>
      {error ? (
        <p role="alert" className="mb-4 text-sm" style={{ color: "var(--jog-accent)" }}>
          {error}
        </p>
      ) : null}
      {reservations.length === 0 ? (
        <p style={{ color: "var(--jog-muted)" }}>Aucune réservation pour le moment.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--jog-line)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p style={{ color: "var(--jog-ink)" }}>
                    {reservation.name} — {reservation.phone}
                  </p>
                  <p className="text-sm" style={{ color: "var(--jog-muted)" }}>
                    {reservation.partySize ? `${reservation.partySize} pers. · ` : ""}
                    {reservation.requestedAt ?? "Date non précisée"}
                  </p>
                  {reservation.message ? (
                    <p className="mt-1 text-sm" style={{ color: "var(--jog-muted)" }}>
                      {reservation.message}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs" style={{ color: "var(--jog-muted)" }}>
                    {reservation.createdAt} · {reservation.status}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStatus(reservation)}
                  className="jog-cta-outline rounded-full border px-4 py-2 text-xs font-semibold"
                  style={{ borderColor: "var(--jog-line)", color: "var(--jog-ink)" }}
                >
                  {reservation.status === "done" ? "Marquer nouveau" : "Marquer traité"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MenuItemRow({ item, onChange }: { item: MenuItem; onChange: () => void }) {
  const [category, setCategory] = useState(item.category);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [sortOrder, setSortOrder] = useState(item.sortOrder);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setPending(true);
    setError(null);
    try {
      await updateMenuItem({ data: { id: item.id, category, name, price, sortOrder } });
      onChange();
    } catch {
      setError("Échec de l'enregistrement.");
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    setPending(true);
    setError(null);
    try {
      await deleteMenuItem({ data: { id: item.id } });
      onChange();
    } catch {
      setError("Échec de la suppression.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="grid gap-2 rounded-lg border p-3 md:grid-cols-[1fr_1fr_5rem_4rem_auto_auto] md:items-center"
      style={{ borderColor: "var(--jog-line)" }}
    >
      {error ? (
        <p role="alert" className="text-xs md:col-span-6" style={{ color: "var(--jog-accent)" }}>
          {error}
        </p>
      ) : null}
      <input
        className="jog-input"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        placeholder="Catégorie"
      />
      <input
        className="jog-input"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nom"
      />
      <input
        className="jog-input"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        placeholder="Prix"
      />
      <input
        className="jog-input"
        type="number"
        value={sortOrder}
        onChange={(event) => setSortOrder(Number(event.target.value))}
      />
      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="jog-cta-fill rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-60"
        style={{ background: "var(--jog-accent)", color: "var(--jog-accent-ink)" }}
      >
        Enregistrer
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="jog-cta-outline rounded-full border px-4 py-2 text-xs font-semibold disabled:opacity-60"
        style={{ borderColor: "var(--jog-line)", color: "var(--jog-ink)" }}
      >
        Supprimer
      </button>
    </div>
  );
}

function NewMenuItemForm({ onChange }: { onChange: () => void }) {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await createMenuItem({ data: { category, name, price, sortOrder: 0 } });
      setCategory("");
      setName("");
      setPrice("");
      onChange();
    } catch {
      setError("Échec de l'ajout.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 grid gap-2 rounded-lg border p-3 md:grid-cols-[1fr_1fr_5rem_auto] md:items-center"
      style={{ borderColor: "var(--jog-line)" }}
    >
      {error ? (
        <p role="alert" className="text-xs md:col-span-4" style={{ color: "var(--jog-accent)" }}>
          {error}
        </p>
      ) : null}
      <input
        className="jog-input"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        placeholder="Catégorie"
        required
      />
      <input
        className="jog-input"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nom"
        required
      />
      <input
        className="jog-input"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        placeholder="Prix"
        required
      />
      <button
        type="submit"
        disabled={pending}
        className="jog-cta-fill rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-60"
        style={{ background: "var(--jog-accent)", color: "var(--jog-accent-ink)" }}
      >
        Ajouter
      </button>
    </form>
  );
}

function MenuPanel({ items, onChange }: { items: MenuItem[]; onChange: () => void }) {
  return (
    <section>
      <h2 className="jog-display mb-6 text-2xl">Menu</h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <MenuItemRow key={item.id} item={item} onChange={onChange} />
        ))}
      </div>
      <NewMenuItemForm onChange={onChange} />
    </section>
  );
}

function SettingsPanel({ settings, onChange }: { settings: SiteSettings; onChange: () => void }) {
  const [phone, setPhone] = useState(settings.phoneDisplay);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(false);
    try {
      await updatePhoneNumber({ data: { phone } });
      setSuccess(true);
      onChange();
    } catch {
      setError("Numéro invalide. Utilisez un numéro algérien valide (ex : 0550 76 07 31).");
    } finally {
      setPending(false);
    }
  }

  return (
    <section>
      <h2 className="jog-display mb-6 text-2xl">Coordonnées</h2>
      <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
        <label className="jog-field">
          <span className="jog-field-label">Numéro de téléphone</span>
          <input
            name="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            className="jog-input"
          />
        </label>
        {error ? (
          <p role="alert" className="text-sm" style={{ color: "var(--jog-accent)" }}>
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-sm" style={{ color: "var(--jog-ink)" }}>
            Numéro mis à jour.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="jog-cta-fill inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
          style={{ background: "var(--jog-accent)", color: "var(--jog-accent-ink)" }}
        >
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </section>
  );
}

function AdminPage() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const refresh = () => router.invalidate();

  if (!data.authenticated) {
    return <LoginForm onSuccess={refresh} />;
  }

  return (
    <div className="jog-page min-h-dvh px-5 py-10 md:px-10">
      <div className="mx-auto flex max-w-4xl items-center justify-between pb-10">
        <h1 className="jog-display text-3xl">Admin — Jogatina</h1>
        <button
          type="button"
          onClick={async () => {
            await adminLogout();
            refresh();
          }}
          className="jog-cta-outline rounded-full border px-4 py-2 text-xs font-semibold"
          style={{ borderColor: "var(--jog-line)", color: "var(--jog-ink)" }}
        >
          Déconnexion
        </button>
      </div>
      <div className="mx-auto flex max-w-4xl flex-col gap-16">
        <ReservationsPanel reservations={data.reservations} onChange={refresh} />
        <MenuPanel items={data.menu} onChange={refresh} />
        <SettingsPanel settings={data.settings} onChange={refresh} />
      </div>
    </div>
  );
}
