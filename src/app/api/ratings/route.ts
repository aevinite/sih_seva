import { NextResponse } from "next/server";
import { supabaseAdmin, T } from "@/lib/supabase";
import { requireUser } from "@/lib/api";

// POST /api/ratings  body:{bookingId, stars, comment}
export async function POST(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const { session } = auth;
  const { bookingId, stars, comment } = await req.json();
  const s = Math.max(1, Math.min(5, Number(stars) || 0));

  const { data: booking } = await supabaseAdmin.from(T.bookings).select("*").eq("id", bookingId).maybeSingle();
  if (!booking || booking.customer_id !== session.userId) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (!booking.worker_id) return NextResponse.json({ error: "No worker to rate" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from(T.ratings)
    .upsert({ booking_id: bookingId, by_user_id: session.userId, worker_id: booking.worker_id, stars: s, comment: comment || null }, { onConflict: "booking_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // recompute worker aggregate
  const { data: rows } = await supabaseAdmin.from(T.ratings).select("stars").eq("worker_id", booking.worker_id);
  if (rows && rows.length) {
    const avg = rows.reduce((a, r) => a + r.stars, 0) / rows.length;
    await supabaseAdmin.from(T.workers).update({ rating_avg: Math.round(avg * 10) / 10, rating_count: rows.length }).eq("id", booking.worker_id);
  }
  return NextResponse.json({ ok: true });
}
