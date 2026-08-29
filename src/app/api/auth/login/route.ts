import { NextResponse } from "next/server";
import { supabaseAdmin, T } from "@/lib/supabase";
import { comparePassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const { data: user } = await supabaseAdmin
      .from(T.users)
      .select("id, email, name, role, password_hash")
      .eq("email", String(email).trim().toLowerCase())
      .maybeSingle();

    if (!user || !(await comparePassword(password, user.password_hash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const session = { userId: user.id, role: user.role, email: user.email, name: user.name };
    await setSessionCookie(session);
    return NextResponse.json({ user: session });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
