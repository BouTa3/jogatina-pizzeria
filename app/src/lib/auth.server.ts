// Server-only admin session helpers, built on TanStack Start's sealed-cookie
// session (h3 under the hood) — no session table needed. Requires two
// secrets set via `higgsfield website secrets set` before deploy:
//   ADMIN_PASSWORD        the password the owner types to log in
//   ADMIN_SESSION_SECRET  a random string, 32+ chars, used to seal the cookie
import { clearSession, getSession, updateSession } from "@tanstack/react-start/server";

interface AdminSessionData {
  authenticated?: boolean;
}

function sessionConfig() {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set (or too short — needs 32+ characters). " +
        "Set it with: higgsfield website secrets set ADMIN_SESSION_SECRET=<random 32+ char string>",
    );
  }
  return { name: "jog_admin", password };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getSession<AdminSessionData>(sessionConfig());
  return session.data.authenticated === true;
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Not authenticated.");
  }
}

export async function checkAdminPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Set it with: higgsfield website secrets set ADMIN_PASSWORD=<your password>",
    );
  }
  return password === expected;
}

export async function startAdminSession(): Promise<void> {
  await updateSession<AdminSessionData>(sessionConfig(), { authenticated: true });
}

export async function endAdminSession(): Promise<void> {
  await clearSession(sessionConfig());
}
