-- D1 schema. Applied by the platform on deploy (only when app.manifest.json
-- sets "db": true). ONE database is shared by preview + prod — keep every
-- change additive (CREATE TABLE IF NOT EXISTS / ADD COLUMN); a destructive
-- change hits production data. Bound as env.DB (see src/lib/bindings.server.ts).

CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  party_size INTEGER,
  requested_at TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed the menu once — guarded so re-running migrations never duplicates rows.
INSERT INTO menu_items (category, name, price, sort_order)
SELECT * FROM (VALUES
  ('Mini pizze', 'Fromage', '200', 0),
  ('Mini pizze', 'Poulet', '300', 1),
  ('Mini pizze', 'Viande', '300', 2),
  ('Mini pizze', 'Thon', '300', 3),
  ('Mini pizze', 'Poulet fumé', '300', 4),
  ('Panuozzo', 'Viande', '450', 0),
  ('Panuozzo', 'Poulet', '450', 1),
  ('Panuozzo', 'Légumes grillés', '350', 2),
  ('Panuozzo', 'Poulet, lait fumé', '500', 3),
  ('Panuozzo', '3 fromages', '450', 4),
  ('Panuozzo', 'Thon', '400', 5),
  ('Panuozzo', 'Champignons', '400', 6)
)
WHERE NOT EXISTS (SELECT 1 FROM menu_items);
