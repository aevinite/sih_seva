import { NextResponse } from "next/server";
import { supabaseAdmin, T } from "@/lib/supabase";
import { requireUser, distanceKm } from "@/lib/api";

// GET /api/worker — the signed-in worker's profile, jobs, earnings, certs, welfare
export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const { session } = auth;
  if (session.role !== "worker") return NextResponse.json({ error: "Workers only" }, { status: 403 });

  const { data: wp } = await supabaseAdmin
    .from(T.workers)
    .select("*")
    .eq("user_id", session.userId)
    .maybeSingle();
  if (!wp) return NextResponse.json({ profile: null, requests: [], jobs: [], certificates: [], claims: [], earnings: 0 });

  const [{ data: bookings }, { data: certs }, { data: claims }, { data: reviews }] = await Promise.all([
    supabaseAdmin.from(T.bookings).select("*, customer:aw_users!aw_bookings_customer_id_fkey(name)").eq("worker_id", wp.id).order("created_at", { ascending: false }),
    supabaseAdmin.from(T.certificates).select("*").eq("worker_id", wp.id),
    supabaseAdmin.from(T.claims).select("*").eq("worker_id", wp.id).order("created_at", { ascending: false }),
    supabaseAdmin.from(T.ratings).select("stars, comment, created_at, by:aw_users(name)").eq("worker_id", wp.id).order("created_at", { ascending: false }),
  ]);

  // distance from the worker's base location to each job (null when either side lacks coords)
  const wlat = wp.lat as number | null;
  const wlng = wp.lng as number | null;
  const withDist = <Row extends { lat?: number | null; lng?: number | null }>(b: Row) => ({
    ...b,
    distanceKm:
      wlat != null && wlng != null && b.lat != null && b.lng != null
        ? Math.round(distanceKm(wlat, wlng, b.lat, b.lng) * 10) / 10
        : null,
  });
  const nearestFirst = (a: { distanceKm: number | null }, b: { distanceKm: number | null }) =>
    (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9);

  const B = (bookings || []).map(withDist);
  const requests = B.filter((b) => b.status === "assigned").sort(nearestFirst); // nearest job requests first
  const schedule = B.filter((b) => b.status === "in_progress" || b.status === "confirmed").sort(nearestFirst);
  const completed = B.filter((b) => b.status === "completed");
  const earnings = completed.reduce((a, b) => a + Math.round((b.total || 0) * 0.92), 0); // 92% to worker

  return NextResponse.json({
    profile: {
      name: session.name, skills: wp.skills, society: wp.society, rating: wp.rating_avg, ratingCount: wp.rating_count,
      jobsDone: wp.jobs_done, verification: wp.verification_status, available: wp.available,
      insuranceActive: wp.insurance_active, welfareBalance: wp.welfare_balance,
    },
    requests, schedule, completed, earnings,
    certificates: certs || [],
    claims: claims || [],
    reviews: reviews || [],
  });
}
