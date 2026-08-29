import fs from "node:fs";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const env = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
const get = (k) => (env.match(new RegExp("^" + k + "=(.*)$", "m")) || [])[1]?.trim().replace(/^"|"$/g, "");
const sb = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

const uid = () => crypto.randomUUID();
const hash = (pw) => bcrypt.hashSync(pw, 10);
const NIL = "00000000-0000-0000-0000-000000000000";

async function wipe() {
  for (const t of ["aw_ratings", "aw_payments", "aw_welfare_claims", "aw_certificates", "aw_bookings", "aw_worker_profiles", "aw_users"]) {
    const { error } = await sb.from(t).delete().neq("id", NIL);
    if (error) console.log("wipe", t, error.message);
  }
}

async function main() {
  await wipe();

  // ---- users ----
  const cust = { id: uid(), email: "customer@aeviwork.in", name: "Aarav Nair", role: "customer", city: "Kochi", password_hash: hash("demo1234") };
  const fed = { id: uid(), email: "admin@aeviwork.in", name: "Dinesh Kapoor", role: "federation", city: "Jaipur", password_hash: hash("demo1234") };
  const sadmin = { id: uid(), email: "superadmin@aeviwork.in", name: "Super Admin", role: "superadmin", city: "New Delhi", password_hash: hash("aevinite@2026") };

  const workerUsers = [
    { name: "Ramesh Solanki", email: "worker@aeviwork.in", pw: "demo1234", skills: ["Electrician"], society: "Jaipur Labour Co-op", verif: "verified", rate: 299, jobs: 320, rating: 4.9, pending: false },
    { name: "Priya Kumari", email: "priya@aeviwork.in", pw: "demo1234", skills: ["Caregiver"], society: "Kota Skilled Workers", verif: "verified", rate: 599, jobs: 210, rating: 5.0, pending: false },
    { name: "Anil Verma", email: "anil@aeviwork.in", pw: "demo1234", skills: ["Plumber"], society: "Udaipur Services Co-op", verif: "pending", rate: 249, jobs: 4, rating: 0, pending: true },
    { name: "Suresh Nair", email: "suresh@aeviwork.in", pw: "demo1234", skills: ["Carpenter"], society: "Jaipur Labour Co-op", verif: "verified", rate: 399, jobs: 150, rating: 4.8, pending: false },
    { name: "Meena Devi", email: "meena@aeviwork.in", pw: "demo1234", skills: ["Cleaner"], society: "Bikaner Workers Co-op", verif: "pending", rate: 199, jobs: 2, rating: 0, pending: true },
    { name: "Gopal Kumar", email: "gopal@aeviwork.in", pw: "demo1234", skills: ["Painter"], society: "Jodhpur Artisans Co-op", verif: "verified", rate: 499, jobs: 96, rating: 4.7, pending: false },
  ];

  const users = [cust, fed, sadmin];
  const workers = [];
  const base = { lat: 23.0225, lng: 72.5714 }; // Ahmedabad-ish
  workerUsers.forEach((w, i) => {
    const u = { id: uid(), email: w.email, name: w.name, role: "worker", city: "Ahmedabad", password_hash: hash(w.pw) };
    users.push(u);
    workers.push({
      id: uid(), user_id: u.id, skills: w.skills, experience_years: 3 + i, bio: `${w.skills[0]} · ${w.society}`,
      society: w.society, lat: base.lat + (Math.random() - 0.5) * 0.08, lng: base.lng + (Math.random() - 0.5) * 0.08,
      city: "Ahmedabad", rate_per_visit: w.rate, verification_status: w.verif, aadhaar_last4: String(1000 + i * 111).slice(-4),
      available: true, rating_avg: w.rating, rating_count: w.pending ? 0 : Math.round(w.jobs * 0.7), jobs_done: w.jobs,
      insurance_active: !w.pending, welfare_balance: w.pending ? 0 : 8000 + i * 1500,
    });
  });

  let r = await sb.from("aw_users").insert(users);
  if (r.error) throw r.error;
  r = await sb.from("aw_worker_profiles").insert(workers);
  if (r.error) throw r.error;

  const ramesh = workers[0];

  // ---- certificates for Ramesh ----
  await sb.from("aw_certificates").insert([
    { worker_id: ramesh.id, name: "Electrician Level-2 (NCCT)", issuer: "NCCT", status: "verified" },
    { worker_id: ramesh.id, name: "Solar Installation", issuer: "NCCT", status: "verified" },
    { worker_id: ramesh.id, name: "Workplace Safety Training", issuer: "NCCT", status: "verified" },
  ]);

  // ---- bookings (customer Aarav) ----
  const svc = [
    { service: "Electrician", worker: ramesh.id, status: "completed", amount: 299, total: 529, rate: true },
    { service: "Plumber", worker: workers[2].id, status: "in_progress", amount: 249, total: 443 },
    { service: "Caregiver", worker: workers[1].id, status: "confirmed", amount: 599, total: 707 },
    { service: "Cleaner", worker: workers[4].id, status: "completed", amount: 199, total: 352, rate: true },
    { service: "Carpenter", worker: workers[3].id, status: "cancelled", amount: 0, total: 0 },
    { service: "Painter", worker: workers[5].id, status: "confirmed", amount: 499, total: 1299 },
  ];
  for (const s of svc) {
    const bid = uid();
    const gst = Math.round(s.amount * 0.18);
    await sb.from("aw_bookings").insert({
      id: bid, customer_id: cust.id, worker_id: s.worker, service: s.service, description: `${s.service} service`,
      address: "Sector 12, Gandhinagar", city: "Gandhinagar", pincode: "382012",
      lat: base.lat, lng: base.lng, emergency: false, status: s.status,
      amount: s.amount, priority_fee: 0, gst, total: s.total || s.amount + gst,
    });
    if (s.status === "completed") {
      await sb.from("aw_payments").insert({ booking_id: bid, method: "upi", status: "paid", amount: s.total, invoice_no: "AW-" + Math.floor(100000 + Math.random() * 899999) });
      if (s.rate) await sb.from("aw_ratings").insert({ booking_id: bid, by_user_id: cust.id, worker_id: s.worker, stars: 5, comment: "Excellent, on time and professional." });
    }
  }

  // ---- welfare claim ----
  await sb.from("aw_welfare_claims").insert([
    { worker_id: ramesh.id, type: "accident", amount: 42000, reason: "Minor on-site injury", status: "pending" },
  ]);

  // counts
  for (const t of ["aw_users", "aw_worker_profiles", "aw_bookings", "aw_payments", "aw_ratings", "aw_certificates", "aw_welfare_claims"]) {
    const { count } = await sb.from(t).select("*", { count: "exact", head: true });
    console.log(t, "=", count);
  }
  console.log("\nSeed complete. Demo logins:");
  console.log("  customer@aeviwork.in / demo1234");
  console.log("  worker@aeviwork.in / demo1234");
  console.log("  admin@aeviwork.in / demo1234");
  console.log("  superadmin@aeviwork.in / aevinite@2026");
}
main().catch((e) => { console.error("SEED ERROR:", e.message || e); process.exit(1); });
