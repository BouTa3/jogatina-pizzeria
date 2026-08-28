-- Additive: adds a generic key/value settings table, seeded with the current
-- phone number so existing deployments keep displaying the same number until
-- an admin changes it. See migrations/0001_init.sql for the shared-DB rules.

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO site_settings (key, value)
SELECT 'phone', '0550760731'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'phone');
