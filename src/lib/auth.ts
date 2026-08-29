import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET || "aeviwork-dev-secret-change-me";
const COOKIE = "aw-token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = { userId: string; role: string; email: string; name: string };

export function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}
export function comparePassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export function signToken(u: SessionUser) {
  return jwt.sign(u, SECRET, { expiresIn: MAX_AGE });
}
export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, SECRET) as SessionUser;
  } catch {
    return null;
  }
}

/** Read the current session from the auth cookie (server components / route handlers). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(u: SessionUser) {
  const store = await cookies();
  store.set(COOKIE, signToken(u), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
