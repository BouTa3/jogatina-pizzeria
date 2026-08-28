import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  checkAdminPassword,
  endAdminSession,
  isAdminAuthenticated,
  startAdminSession,
} from "../auth.server";

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    const valid = await checkAdminPassword(data.password);
    if (!valid) {
      throw new Error("Mot de passe incorrect.");
    }
    await startAdminSession();
    return { success: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  await endAdminSession();
  return { success: true as const };
});

export const checkAdminAuth = createServerFn({ method: "GET" }).handler(async () => {
  return { authenticated: await isAdminAuthenticated() };
});
