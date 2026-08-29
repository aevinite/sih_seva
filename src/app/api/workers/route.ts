import { NextResponse } from "next/server";
import { supabaseAdmin, T } from "@/lib/supabase";
import { distanceKm } from "@/lib/api";

// GET /api/workers?service=Electrician&lat=..&lng=..&verifiedOnly=1
export async function GET(req: Request) {
  const url = new URL(req.url);
  const service = url.searchParams.get("service");
  const lat = parseFloat(url.searchParams.get("lat") || "");
  const lng = parseFloat(url.searchParams.get("lng") || "");
  const verifiedOnly = url.searchParams.get("verifiedOnly") !== "0";

  let q = supabaseAdmin
    .from(T.workers)
    .select("id, skills, society, city, lat, lng, rate_per_visit, verification_status, available, rating_avg, rating_count, jobs_done, experience_years, user:aw_users(name, city)");
  if (verifiedOnly) q = q.eq("verification_status", "verified");
  if (service) q = q.contains("skills", [service]);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  type Row = {
    id: string; skills: string[]; society: string | null; city: string | null;
    lat: number | null; lng: number | null; rate_per_visit: number; verification_status: string;
    available: boolean; rating_avg: number; rating_count: number; jobs_done: number; experience_years: number;
    user: { name: string; city: string | null } | { name: string; city: string | null }[] | null;
  };
  const hasGeo = !Number.isNaN(lat) && !Number.isNaN(lng);
  const workers = (data as Row[]).map((w) => {
    const u = Array.isArray(w.user) ? w.user[0] : w.user;
    const dist = hasGeo && w.lat != null && w.lng != null ? distanceKm(lat, lng, w.lat, w.lng) : null;
    return {
      id: w.id,
      name: u?.name || "Worker",
      skill: w.skills?.[0] || "General",
      skills: w.skills || [],
      society: w.society,
      city: w.city || u?.city || null,
      rate: w.rate_per_visit,
      rating: w.rating_avg,
      ratingCount: w.rating_count,
      jobs: w.jobs_done,
      experience: w.experience_years,
      verified: w.verification_status === "verified",
      distanceKm: dist == null ? null : Math.round(dist * 10) / 10,
    };
  });
  if (hasGeo) workers.sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
  return NextResponse.json({ workers });
}
