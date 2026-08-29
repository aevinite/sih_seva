import { NextResponse } from "next/server";
import { supabaseAdmin, T } from "@/lib/supabase";
import { requireUser } from "@/lib/api";

// PATCH /api/bookings/:id  body:{action}
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const { session } = auth;
  const { id } = await params;
  const { action } = await req.json();

  const { data: booking } = await supabaseAdmin.from(T.bookings).select("*").eq("id", id).maybeSingle();
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // resolve caller's worker profile id (if worker)
  let myWorkerId: string | null = null;
  if (session.role === "worker") {
    const { data: wp } = await supabaseAdmin.from(T.workers).select("id").eq("user_id", session.userId).maybeSingle();
    myWorkerId = wp?.id || null;
  }
  const isCustomer = session.role === "customer" && booking.customer_id === session.userId;
  const isWorker = session.role === "worker" && booking.worker_id === myWorkerId;
  const isAdmin = session.role === "federation" || session.role === "superadmin";
  if (!isCustomer && !isWorker && !isAdmin) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  const patch: Record<string, unknown> = {};
  switch (action) {
    case "cancel":
      patch.status = "cancelled";
      break;
    case "accept":
      patch.status = "in_progress";
      break;
    case "decline":
      patch.status = "pending";
      patch.worker_id = null;
      break;
    case "start":
      patch.status = "in_progress";
      break;
    case "complete":
      patch.status = "completed";
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const { data: updated, error } = await supabaseAdmin.from(T.bookings).update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // side effects on completion: bump worker jobs, mark COD paid
  if (action === "complete" && booking.worker_id) {
    const { data: wp } = await supabaseAdmin.from(T.workers).select("jobs_done").eq("id", booking.worker_id).maybeSingle();
    if (wp) await supabaseAdmin.from(T.workers).update({ jobs_done: (wp.jobs_done || 0) + 1 }).eq("id", booking.worker_id);
    await supabaseAdmin.from(T.payments).update({ status: "paid" }).eq("booking_id", id).eq("status", "pending");
  }
  return NextResponse.json({ booking: updated });
}
