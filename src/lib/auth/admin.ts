import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL || "admin@leafsandlines.com";
  const password = process.env.ADMIN_PASSWORD || "hmpx9Ul89aS6YEfc";
  const secret = process.env.ADMIN_SESSION_SECRET || "leafs-and-lines-secret";
  return { email, password, secret };
}

export function isValidAdminToken(token: string) {
  const { email, secret } = getAdminCredentials();
  const expectedToken = Buffer.from(`${email}:${secret}`).toString("base64");
  return token === expectedToken;
}

export function generateAdminToken() {
  const { email, secret } = getAdminCredentials();
  return Buffer.from(`${email}:${secret}`).toString("base64");
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie?.value) {
    return false;
  }
  return isValidAdminToken(sessionCookie.value);
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const token = generateAdminToken();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
