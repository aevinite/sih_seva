import { NextResponse } from "next/server";
import { supabaseAdmin, T } from "@/lib/supabase";
import { requireUser, requireRole } from "@/lib/api";

// GET /api/admin/workers — all worker profiles with user info
export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  if (!requireRole(auth.session, ["federation", "superadmin"])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from(T.workers)
    .select("id, skills, society, city, rating_avg, verification_status, jobs_done, user:aw_users(name, email)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const workers = (data || []).map((w) => {
    const u = Array.isArray(w.user) ? w.user[0] : w.user;
    return {
      id: w.id, name: u?.name || "Worker", email: u?.email || "",
      skill: w.skills?.[0] || "General", society: w.society, city: w.city,
      rating: w.rating_avg, jobs: w.jobs_done, status: w.verification_status,
    };
  });
  return NextResponse.json({ workers });
}
