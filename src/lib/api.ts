import { NextResponse } from "next/server";
import { getSession, type SessionUser } from "@/lib/auth";

export async function requireUser(): Promise<{ session: SessionUser } | { error: NextResponse }> {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  return { session };
}

export function requireRole(session: SessionUser, roles: string[]) {
  return roles.includes(session.role);
}

/** Haversine distance in km between two lat/lng points. */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function invoiceNo() {
  return "AW-" + Math.floor(100000 + Math.random() * 899999);
}

// default per-visit price by service (fallback when no worker rate)
export const SERVICE_RATE: Record<string, number> = {
  Electrician: 299, Plumber: 249, Carpenter: 399, Painter: 499,
  Cleaner: 199, Caregiver: 599, Driver: 349, Gardener: 299,
};
