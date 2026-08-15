/**
 * The app's canonical public URL, for building absolute URLs (OAuth redirect_uri,
 * post-OAuth redirects) that must not depend on how a given host detects its own
 * request URL. `request.url` is NOT reliable for this on every platform — on Render
 * this app has been observed reporting `https://localhost:10000/...` (the internal
 * bind address from PORT) instead of the public host, which broke YouTube OAuth.
 *
 * Prefer AUTH_URL (Auth.js v5) then NEXTAUTH_URL. Never fall back to request.url.
 */
export function getAppUrl(): string {
  const raw = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!raw) {
    throw new Error("AUTH_URL or NEXTAUTH_URL must be set — cannot build an absolute app URL.");
  }

  const url = raw.replace(/\/$/, "");
  const host = new URL(url).hostname;
  // Render binds on localhost:PORT internally — never use that as the public OAuth origin.
  if (process.env.NODE_ENV === "production" && (host === "localhost" || host === "127.0.0.1")) {
    throw new Error(
      `App URL is set to an internal host (${url}). Set AUTH_URL/NEXTAUTH_URL to the public https://…onrender.com origin.`,
    );
  }

  return url;
}
