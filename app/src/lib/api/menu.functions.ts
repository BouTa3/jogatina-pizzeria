import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "../auth.server";
import { bindings } from "../bindings.server";

export interface MenuItem {
  id: number;
  category: string;
  name: string;
  price: string;
  sortOrder: number;
}

// Used whenever the D1 binding isn't available (local `bun run dev`) or the
// table is empty — keeps the site's menu section non-empty in both cases.
const DEFAULT_MENU: MenuItem[] = [
  { id: 1, category: "Mini pizze", name: "Fromage", price: "200", sortOrder: 0 },
  { id: 2, category: "Mini pizze", name: "Poulet", price: "300", sortOrder: 1 },
  { id: 3, category: "Mini pizze", name: "Viande", price: "300", sortOrder: 2 },
  { id: 4, category: "Mini pizze", name: "Thon", price: "300", sortOrder: 3 },
  { id: 5, category: "Mini pizze", name: "Poulet fumé", price: "300", sortOrder: 4 },
  { id: 6, category: "Panuozzo", name: "Viande", price: "450", sortOrder: 0 },
  { id: 7, category: "Panuozzo", name: "Poulet", price: "450", sortOrder: 1 },
  { id: 8, category: "Panuozzo", name: "Légumes grillés", price: "350", sortOrder: 2 },
  { id: 9, category: "Panuozzo", name: "Poulet, lait fumé", price: "500", sortOrder: 3 },
  { id: 10, category: "Panuozzo", name: "3 fromages", price: "450", sortOrder: 4 },
  { id: 11, category: "Panuozzo", name: "Thon", price: "400", sortOrder: 5 },
  { id: 12, category: "Panuozzo", name: "Champignons", price: "400", sortOrder: 6 },
];

export const getMenu = createServerFn({ method: "GET" }).handler(async (): Promise<MenuItem[]> => {
  const { DB } = bindings();
  if (!DB) {
    return DEFAULT_MENU;
  }

  const { results } = await DB.prepare(
    "SELECT id, category, name, price, sort_order AS sortOrder FROM menu_items ORDER BY category, sort_order, id",
  ).all<MenuItem>();

  return results && results.length > 0 ? results : DEFAULT_MENU;
});

const menuItemInput = z.object({
  category: z.string().trim().min(1).max(60),
  name: z.string().trim().min(1).max(100),
  price: z.string().trim().min(1).max(20),
  sortOrder: z.coerce.number().int().min(0).max(1000).default(0),
});

export const createMenuItem = createServerFn({ method: "POST" })
  .validator(menuItemInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("Le menu n'est pas modifiable pour le moment.");

    await DB.prepare(
      `INSERT INTO menu_items (category, name, price, sort_order, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
    )
      .bind(data.category, data.name, data.price, data.sortOrder)
      .run();

    return { success: true as const };
  });

export const updateMenuItem = createServerFn({ method: "POST" })
  .validator(menuItemInput.extend({ id: z.coerce.number().int().positive() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("Le menu n'est pas modifiable pour le moment.");

    await DB.prepare(
      `UPDATE menu_items
       SET category = ?, name = ?, price = ?, sort_order = ?, updated_at = datetime('now')
       WHERE id = ?`,
    )
      .bind(data.category, data.name, data.price, data.sortOrder, data.id)
      .run();

    return { success: true as const };
  });

export const deleteMenuItem = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.coerce.number().int().positive() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("Le menu n'est pas modifiable pour le moment.");

    await DB.prepare("DELETE FROM menu_items WHERE id = ?").bind(data.id).run();

    return { success: true as const };
  });
