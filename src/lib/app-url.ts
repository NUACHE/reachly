/**
 * The app's canonical public URL, for building absolute URLs (OAuth redirect_uri,
 * post-OAuth redirects) that must not depend on how a given host detects its own
 * request URL. `request.url` is NOT reliable for this on every platform — on Render
 * this app has been observed reporting `https://localhost:10000/...` (the internal
 * bind address) instead of the public `reachly-tp1j.onrender.com` host, which broke
 * both the YouTube OAuth redirect_uri and the post-connect redirects back into the app.
 */
export function getAppUrl(): string {
  const url = process.env.NEXTAUTH_URL;
  if (!url) throw new Error("NEXTAUTH_URL is not set — cannot build an absolute app URL.");
  return url;
}
