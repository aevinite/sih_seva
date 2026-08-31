import { NextResponse } from "next/server";
import { supabaseAdmin, T } from "@/lib/supabase";
import { requireUser, distanceKm, invoiceNo, SERVICE_RATE } from "@/lib/api";

// GET /api/bookings — role-aware list
export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const { session } = auth;

  const sel = "*, worker:aw_worker_profiles(id, user:aw_users(name)), customer:aw_users!aw_bookings_customer_id_fkey(name)";
  let q = supabaseAdmin.from(T.bookings).select(sel).order("created_at", { ascending: false });

  if (session.role === "customer") {
    q = q.eq("customer_id", session.userId);
  } else if (session.role === "worker") {
    const { data: wp } = await supabaseAdmin.from(T.workers).select("id").eq("user_id", session.userId).maybeSingle();
    if (!wp) return NextResponse.json({ bookings: [] });
    q = q.eq("worker_id", wp.id);
  } // federation/superadmin => all

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data });
}

// POST /api/bookings — create a booking (customer)
export async function POST(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const { session } = auth;
  if (session.role !== "customer") return NextResponse.json({ error: "Only customers can book" }, { status: 403 });

  const b = await req.json();
  const service: string = b.service;
  if (!service) return NextResponse.json({ error: "Service is required" }, { status: 400 });
  const emergency = !!b.emergency;
  const lat = typeof b.lat === "number" ? b.lat : null;
  const lng = typeof b.lng === "number" ? b.lng : null;

  // pick worker: explicit, else nearest available verified worker with the skill
  let workerId: string | null = b.workerId || null;
  let rate = SERVICE_RATE[service] || 299;
  if (!workerId) {
    const { data: cands } = await supabaseAdmin
      .from(T.workers)
      .select("id, lat, lng, rate_per_visit")
      .eq("verification_status", "verified")
      .eq("available", true)
      .contains("skills", [service]);
    if (cands && cands.length) {
      let best = cands[0];
      if (lat != null && lng != null) {
        const ranked = cands
          .map((c) => ({ c, d: c.lat != null && c.lng != null ? distanceKm(lat, lng, c.lat, c.lng) : 1e9 }))
          .sort((x, y) => x.d - y.d);
        // prefer the nearest verified worker WITHIN 10 km; else fall back to the nearest overall
        const within10 = ranked.filter((r) => r.d <= 10);
        best = (within10[0] || ranked[0]).c;
      }
      workerId = best.id;
      rate = best.rate_per_visit || rate;
    }
  } else {
    const { data: w } = await supabaseAdmin.from(T.workers).select("rate_per_visit").eq("id", workerId).maybeSingle();
    if (w?.rate_per_visit) rate = w.rate_per_visit;
  }

  const priority = emergency ? 150 : 0;
  const gst = Math.round((rate + priority) * 0.18);
  const total = rate + priority + gst;
  const method = ["upi", "card", "wallet", "cod"].includes(b.paymentMethod) ? b.paymentMethod : "upi";

  const { data: booking, error } = await supabaseAdmin
    .from(T.bookings)
    .insert({
      customer_id: session.userId,
      worker_id: workerId,
      service,
      description: b.description || null,
      address: b.address || null,
      city: b.city || null,
      pincode: b.pincode || null,
      lat, lng,
      scheduled_at: b.scheduledAt || null,
      emergency,
      status: workerId ? "assigned" : "pending",
      amount: rate, priority_fee: priority, gst, total,
    })
    .select("*")
    .single();
  if (error || !booking) return NextResponse.json({ error: error?.message || "Could not create booking" }, { status: 500 });

  // payment + invoice (simulated gateway unless COD)
  const { data: payment } = await supabaseAdmin
    .from(T.payments)
    .insert({ booking_id: booking.id, method, status: method === "cod" ? "pending" : "paid", amount: total, invoice_no: invoiceNo() })
    .select("*")
    .single();

  return NextResponse.json({ booking, payment });
}
