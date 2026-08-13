import crypto from "node:crypto";

const TOKEN_TTL_MS = 10 * 60 * 1000;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set.");
  return secret;
}

function sign(encoded: string) {
  return crypto.createHmac("sha256", getSecret()).update(encoded).digest("base64url");
}

/** Short-lived, tamper-proof token carrying a not-yet-authenticated Google email through the signup-completion redirect. */
export function signGoogleSignupToken(email: string, name: string) {
  const encoded = Buffer.from(JSON.stringify({ email, name, exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyGoogleSignupToken(token: string): { email: string; name: string } | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (typeof payload.email !== "string") return null;
    return { email: payload.email, name: typeof payload.name === "string" ? payload.name : "" };
  } catch {
    return null;
  }
}
