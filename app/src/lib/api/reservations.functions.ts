import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "../auth.server";
import { bindings } from "../bindings.server";

export interface Reservation {
  id: number;
  name: string;
  phone: string;
  partySize: number | null;
  requestedAt: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

const reservationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  partySize: z.coerce.number().int().min(1).max(50).optional(),
  requestedAt: z.string().trim().max(120).optional(),
  message: z.string().trim().max(1000).optional(),
  // Honeypot: hidden from real visitors via CSS, never via display:none (which
  // some bots skip). Any value here means a script filled every field —
  // pretend success without touching the database.
  website: z.string().max(200).optional(),
  // Page-render timestamp (ms), echoed back on submit. A human takes at least
  // a couple seconds to fill this form; a near-instant submit is scripted.
  renderedAt: z.number(),
});

export const submitReservation = createServerFn({ method: "POST" })
  .validator(reservationSchema)
  .handler(async ({ data }) => {
    if (data.website || Date.now() - data.renderedAt < 1500) {
      return { success: true as const };
    }

    const { DB } = bindings();
    if (!DB) {
      throw new Error("Reservations are not available right now.");
    }

    await DB.prepare(
      `INSERT INTO reservations (name, phone, party_size, requested_at, message)
       VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(
        data.name,
        data.phone,
        data.partySize ?? null,
        data.requestedAt ?? null,
        data.message ?? null,
      )
      .run();

    return { success: true as const };
  });

export const listReservations = createServerFn({ method: "GET" }).handler(
  async (): Promise<Reservation[]> => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) return [];

    const { results } = await DB.prepare(
      `SELECT id, name, phone, party_size AS partySize, requested_at AS requestedAt,
              message, status, created_at AS createdAt
       FROM reservations ORDER BY created_at DESC`,
    ).all<Reservation>();

    return results ?? [];
  },
);

export const updateReservationStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.coerce.number().int().positive(),
      status: z.enum(["new", "done"]),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("Non disponible pour le moment.");

    await DB.prepare("UPDATE reservations SET status = ? WHERE id = ?")
      .bind(data.status, data.id)
      .run();

    return { success: true as const };
  });
