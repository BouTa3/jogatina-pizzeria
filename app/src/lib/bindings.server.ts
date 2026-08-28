// Server-only access to this app's Cloudflare bindings. Each is present ONLY if
// opted into via app.manifest.json (D1 `DB`, R2 `STORAGE`, KV `KV`, and the
// container `CONTAINER`) — so the accessors are optional; guard before use.
// Import the binding types directly — NOT via the global tsconfig `types` list,
// which would clobber the DOM globals the client/SSR React code relies on.
import type {
  D1Database,
  DurableObjectNamespace,
  KVNamespace,
  R2Bucket,
} from "@cloudflare/workers-types";

// `cloudflare:workers` is the Workers-runtime module that exposes the Worker
// env (bindings) — usable inside any server-side code (server functions,
// server routes). It is NOT bundled; the runtime provides it.
//
// Resolved via a top-level dynamic import (not a static one) so a failed
// resolution can be caught: plain `vite dev` runs this SSR code in Node,
// where `cloudflare:workers` genuinely does not exist. A static import
// throws during module linking — before any caller's own `if (!DB)` guard
// gets a chance to run — which crashes the whole page the moment a route
// loader calls a D1-backed function. Dynamic import lets that failure
// resolve to `undefined` instead, so every accessor below is simply absent
// locally, exactly like an unset app.manifest.json flag.
let env: Record<string, unknown> | undefined;
try {
  ({ env } = (await import("cloudflare:workers")) as { env?: Record<string, unknown> });
} catch {
  env = undefined;
}

type AppEnv = {
  DB?: D1Database;
  STORAGE?: R2Bucket;
  KV?: KVNamespace;
  // The container's Durable Object — present only when "container" is set in
  // the manifest. Reach an instance with env.CONTAINER.getByName(id), then
  // .fetch(). See skills/containers.md.
  CONTAINER?: DurableObjectNamespace;
  HF_ENV?: string;
  APP_SLUG?: string;
};

export function bindings(): AppEnv {
  return (env ?? {}) as unknown as AppEnv;
}
