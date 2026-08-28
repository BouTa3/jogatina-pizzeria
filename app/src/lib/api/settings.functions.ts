import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "../auth.server";
import { bindings } from "../bindings.server";
import { formatAlgerianPhone, phoneDigitsToE164 } from "../phone";

export interface SiteSettings {
  phoneDigits: string;
  phoneDisplay: string;
  phoneE164: string;
}

// Used whenever the D1 binding isn't available (local `bun run dev`) — mirrors
// the DEFAULT_MENU fallback in menu.functions.ts.
const DEFAULT_PHONE_DIGITS = "0550760731";

function buildSettings(phoneDigits: string): SiteSettings {
  return {
    phoneDigits,
    phoneDisplay: formatAlgerianPhone(phoneDigits),
    phoneE164: phoneDigitsToE164(phoneDigits),
  };
}

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    const { DB } = bindings();
    if (!DB) {
      return buildSettings(DEFAULT_PHONE_DIGITS);
    }

    const row = await DB.prepare("SELECT value FROM site_settings WHERE key = 'phone'").first<{
      value: string;
    }>();

    return buildSettings(row?.value ?? DEFAULT_PHONE_DIGITS);
  },
);

const phoneInput = z.object({
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((digits) => /^0[5-7]\d{8}$/.test(digits), {
      message: "Numéro algérien invalide (ex : 0550 76 07 31).",
    }),
});

export const updatePhoneNumber = createServerFn({ method: "POST" })
  .validator(phoneInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("Le numéro n'est pas modifiable pour le moment.");

    await DB.prepare(
      `INSERT INTO site_settings (key, value, updated_at) VALUES ('phone', ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
      .bind(data.phone)
      .run();

    return { success: true as const };
  });
