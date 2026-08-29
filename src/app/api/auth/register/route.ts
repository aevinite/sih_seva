import { NextResponse } from "next/server";
import { supabaseAdmin, T } from "@/lib/supabase";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = ["customer", "worker", "federation"].includes(body.role) ? body.role : "customer";

    if (!name || !email || password.length < 6) {
      return NextResponse.json({ error: "Name, email and a 6+ char password are required" }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin.from(T.users).select("id").eq("email", email).maybeSingle();
    if (existing) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

    const { data: user, error } = await supabaseAdmin
      .from(T.users)
      .insert({ name, email, password_hash: await hashPassword(password), role, phone: body.phone || null, city: body.city || null })
      .select("id, email, name, role")
      .single();
    if (error || !user) return NextResponse.json({ error: "Could not create account" }, { status: 500 });

    if (role === "worker") {
      await supabaseAdmin.from(T.workers).insert({
        user_id: user.id,
        skills: Array.isArray(body.skills) ? body.skills : [],
        experience_years: Number(body.experienceYears) || 0,
        society: body.society || null,
        city: body.city || null,
        aadhaar_last4: body.aadhaarLast4 ? String(body.aadhaarLast4).slice(-4) : null,
        rate_per_visit: Number(body.ratePerVisit) || 299,
        verification_status: "pending",
      });
    }

    const session = { userId: user.id, role: user.role, email: user.email, name: user.name };
    await setSessionCookie(session);
    return NextResponse.json({ user: session });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
