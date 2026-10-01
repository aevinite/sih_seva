import { createClient } from "@supabase/supabase-js";

// Server-only admin client (service role key). Bypasses RLS.
// NEVER import this into a client component.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Table name helper (AeviWork has its own dedicated Supabase project)
export const T = {
  users: "aw_users",
  workers: "aw_worker_profiles",
  certificates: "aw_certificates",
  bookings: "aw_bookings",
  payments: "aw_payments",
  ratings: "aw_ratings",
  claims: "aw_welfare_claims",
} as const;
