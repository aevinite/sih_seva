import { NextResponse } from "next/server";
import { supabaseAdmin, T } from "@/lib/supabase";
import { requireUser, requireRole } from "@/lib/api";

// PATCH /api/admin/workers/:id  body:{action:'verify'|'reject'|'suspend'}
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  if (!requireRole(auth.session, ["federation", "superadmin"])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { action } = await req.json();

  const map: Record<string, string> = { verify: "verified", reject: "rejected", suspend: "suspended", reinstate: "verified" };
  const status = map[action];
  if (!status) return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from(T.workers)
    .update({ verification_status: status, insurance_active: status === "verified" })
    .eq("id", id)
    .select("id, verification_status")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ worker: data });
}
