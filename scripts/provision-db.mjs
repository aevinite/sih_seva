// Provision AeviWork tables in the Supabase project via the Management API.
// Tables are prefixed aw_ and have RLS enabled with NO policies, so the public
// anon key cannot access them — only the server (service role) can.
import fs from "node:fs";

const env = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
const get = (k) => (env.match(new RegExp("^" + k + "=(.*)$", "m")) || [])[1]?.trim().replace(/^"|"$/g, "");
const REF = get("SUPABASE_PROJECT_REF");
const TOKEN = get("SUPABASE_ACCESS_TOKEN");

const SQL = `
create extension if not exists pgcrypto;

create table if not exists aw_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  phone text,
  password_hash text not null,
  name text not null,
  role text not null default 'customer' check (role in ('customer','worker','federation','superadmin')),
  city text,
  created_at timestamptz not null default now()
);

create table if not exists aw_worker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references aw_users(id) on delete cascade,
  skills text[] not null default '{}',
  experience_years int not null default 0,
  bio text,
  society text,
  lat double precision,
  lng double precision,
  city text,
  rate_per_visit int not null default 299,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected','suspended')),
  aadhaar_last4 text,
  available boolean not null default true,
  rating_avg numeric not null default 0,
  rating_count int not null default 0,
  jobs_done int not null default 0,
  insurance_active boolean not null default true,
  welfare_balance int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists aw_certificates (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references aw_worker_profiles(id) on delete cascade,
  name text not null,
  issuer text not null default 'NCCT',
  issued_on date not null default now(),
  status text not null default 'pending' check (status in ('pending','verified','rejected'))
);

create table if not exists aw_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references aw_users(id) on delete cascade,
  worker_id uuid references aw_worker_profiles(id) on delete set null,
  service text not null,
  description text,
  address text,
  city text,
  pincode text,
  lat double precision,
  lng double precision,
  scheduled_at timestamptz,
  emergency boolean not null default false,
  status text not null default 'pending' check (status in ('pending','confirmed','assigned','in_progress','completed','cancelled')),
  amount int not null default 0,
  priority_fee int not null default 0,
  gst int not null default 0,
  total int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists aw_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid unique not null references aw_bookings(id) on delete cascade,
  method text not null default 'upi' check (method in ('upi','card','wallet','cod')),
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  amount int not null,
  provider text not null default 'simulated',
  provider_ref text,
  invoice_no text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists aw_ratings (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid unique not null references aw_bookings(id) on delete cascade,
  by_user_id uuid not null references aw_users(id) on delete cascade,
  worker_id uuid not null references aw_worker_profiles(id) on delete cascade,
  stars int not null check (stars between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists aw_welfare_claims (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references aw_worker_profiles(id) on delete cascade,
  type text not null check (type in ('accident','health','welfare')),
  amount int not null,
  reason text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists idx_aw_bookings_customer on aw_bookings(customer_id);
create index if not exists idx_aw_bookings_worker on aw_bookings(worker_id);
create index if not exists idx_aw_bookings_status on aw_bookings(status);
create index if not exists idx_aw_worker_verif on aw_worker_profiles(verification_status);

-- Lock everything down: RLS on, no policies => anon key blocked, service role bypasses.
alter table aw_users enable row level security;
alter table aw_worker_profiles enable row level security;
alter table aw_certificates enable row level security;
alter table aw_bookings enable row level security;
alter table aw_payments enable row level security;
alter table aw_ratings enable row level security;
alter table aw_welfare_claims enable row level security;
`;

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: "POST",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query: SQL }),
});
const text = await res.text();
console.log("status", res.status);
console.log(text.slice(0, 500));

// verify
const verify = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: "POST",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query: "select table_name from information_schema.tables where table_name like 'aw_%' order by table_name;" }),
});
console.log("TABLES:", (await verify.text()));
