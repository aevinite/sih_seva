"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import {
  DashboardShell,
  View,
  StatusPill,
  ActionButton,
  PanelSearch,
  type NavItem,
  type PillKind,
} from "@/components/dash/Dashboard";
import { T, useToast } from "@/lib/providers";

/* Service categories shown to the customer (no graphs in this panel) */
const CATEGORIES = [
  { emoji: "⚡", cls: "", en: "Electrician", hi: "इलेक्ट्रीशियन", rate: "₹299+" },
  { emoji: "🔧", cls: "info", en: "Plumber", hi: "प्लंबर", rate: "₹249+" },
  { emoji: "🪚", cls: "amber", en: "Carpenter", hi: "बढ़ई", rate: "₹399+" },
  { emoji: "🎨", cls: "success", en: "Painter", hi: "पेंटर", rate: "₹499+" },
  { emoji: "🧹", cls: "", en: "Cleaner", hi: "सफाईकर्मी", rate: "₹199+" },
  { emoji: "👶", cls: "amber", en: "Caregiver", hi: "देखभालकर्ता", rate: "₹599+" },
  { emoji: "🚗", cls: "info", en: "Driver", hi: "ड्राइवर", rate: "₹349+" },
  { emoji: "🌿", cls: "success", en: "Gardener", hi: "माली", rate: "₹299+" },
];

/* ---------- icons ---------- */
const IcGrid = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>;
const IcCal = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
const IcCard = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>;
const IcHeart = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6.5-7 11-7 11z" /></svg>;
const IcStar = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z" /></svg>;
const IcHelp = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 2.5" /><path d="M12 17h.01" /></svg>;
const IcUser = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>;
const IcOut = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 17l5-5-5-5M20 12H9M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" /></svg>;
const StarFill = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z" /></svg>;

const nav: NavItem[] = [
  { view: "overview", en: "Overview", hi: "अवलोकन", icon: IcGrid },
  { view: "bookings", en: "My Bookings", hi: "मेरी बुकिंग", icon: IcCal },
  { view: "payments", en: "Payments & Invoices", hi: "भुगतान व चालान", icon: IcCard },
  { view: "saved", en: "Saved Workers", hi: "सहेजे कार्यकर्ता", icon: IcHeart },
  { view: "ratings", en: "Ratings", hi: "रेटिंग", title: "Rate Your Services", icon: IcStar },
  { view: "support", en: "Support", hi: "सहायता", title: "Help & Support", icon: IcHelp },
];
const extraNav = [
  { en: "Profile", hi: "प्रोफ़ाइल", icon: IcUser, toast: "Profile settings opened" },
  { en: "Logout", hi: "लॉगआउट", icon: IcOut, toast: "Signed out" },
];

type Booking = { id: string; svc: string; who: string; ini: string; color: string; when: string; status: string; kind: PillKind; amt: string };

const STATUS_MAP: Record<string, { label: string; kind: PillKind }> = {
  pending: { label: "Pending", kind: "warning" },
  confirmed: { label: "Confirmed", kind: "info" },
  assigned: { label: "Assigned", kind: "info" },
  in_progress: { label: "In progress", kind: "warning" },
  completed: { label: "Completed", kind: "success" },
  cancelled: { label: "Cancelled", kind: "danger" },
};
const GRADS = [
  "linear-gradient(135deg,#2dd4bf,#0d9488)", "linear-gradient(135deg,#60a5fa,#2563eb)", "linear-gradient(135deg,#fbbf24,#f59e0b)",
  "linear-gradient(135deg,#34d399,#059669)", "linear-gradient(135deg,#f472b6,#db2777)", "linear-gradient(135deg,#a78bfa,#7c3aed)",
];
type ApiBooking = { id: string; service: string; status: string; total: number; scheduled_at: string | null; created_at: string; worker?: { user?: { name?: string } | { name?: string }[] } | null };
function mapBooking(b: ApiBooking): Booking {
  const wu = b.worker && (Array.isArray(b.worker.user) ? b.worker.user[0] : b.worker.user);
  const who = wu?.name || "Unassigned";
  const ini = who.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase() || "AW";
  const color = GRADS[(who.charCodeAt(0) || 0) % GRADS.length];
  const d = b.scheduled_at ? new Date(b.scheduled_at) : new Date(b.created_at);
  const when = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + (b.scheduled_at ? ", " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "");
  const st = STATUS_MAP[b.status] || { label: b.status, kind: "info" as PillKind };
  return { id: b.id, svc: b.service, who, ini, color, when, status: st.label, kind: st.kind, amt: "₹" + (b.total || 0) };
}

const initialSaved = [
  { id: 1, n: "Ramesh Solanki", r: "Electrician · Kochi", ini: "RS", color: "linear-gradient(135deg,#2dd4bf,#0d9488)", rate: "4.9" },
  { id: 2, n: "Priya Kumari", r: "Cleaner · Kochi", ini: "PK", color: "linear-gradient(135deg,#fbbf24,#f59e0b)", rate: "5.0" },
  { id: 3, n: "Anil Verma", r: "Plumber · Kochi", ini: "AV", color: "linear-gradient(135deg,#60a5fa,#2563eb)", rate: "4.7" },
  { id: 4, n: "Suresh Kumar", r: "Carpenter · Kochi", ini: "SK", color: "linear-gradient(135deg,#34d399,#059669)", rate: "4.8" },
  { id: 5, n: "Meena Joshi", r: "Electrician · Kochi", ini: "MJ", color: "linear-gradient(135deg,#f472b6,#db2777)", rate: "4.9" },
  { id: 6, n: "Deepak Gowda", r: "Gardener · Kochi", ini: "DG", color: "linear-gradient(135deg,#a78bfa,#7c3aed)", rate: "4.6" },
];

function StarRating() {
  const [v, setV] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4, fontSize: "1.6rem" }} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" aria-label={i + " star"} onClick={() => setV(i)}
          style={{ color: i <= v ? "var(--accent)" : "var(--border)", lineHeight: 1 }}>★</button>
      ))}
    </div>
  );
}

export default function CustomerDashboard() {
  const { show } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [saved, setSaved] = useState(initialSaved);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((j) => { if (Array.isArray(j.bookings)) setBookings(j.bookings.map(mapBooking)); })
      .catch(() => {});
  }, []);

  const filtered = useMemo(
    () => bookings.filter((b) => (b.svc + b.who + b.status).toLowerCase().includes(q.toLowerCase())),
    [bookings, q]
  );

  const cancel = async (id: string) => {
    await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "cancel" }) });
    setBookings((rows) => rows.map((r) => (r.id === id ? { ...r, status: "Cancelled", kind: "danger", amt: "₹0" } : r)));
    show("Booking cancelled");
  };

  const upcoming = bookings.filter((b) => ["Confirmed", "In progress", "Assigned", "Pending"].includes(b.status));
  const activeCount = upcoming.length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const spent = bookings.filter((b) => b.status === "Completed").reduce((a, b) => a + (parseInt(b.amt.replace(/[^0-9]/g, "")) || 0), 0);

  return (
    <>
      <Navbar />
      <DashboardShell
        who={{ initials: "AN", name: "Aarav Nair", role: { en: "Customer · Kochi", hi: "ग्राहक · कोच्चि" }, color: "linear-gradient(135deg,#2dd4bf,#0d9488)" }}
        nav={nav}
        extraNav={extraNav}
        sideLabel={{ en: "Account", hi: "खाता" }}
        subtitle={{ en: "Welcome back, Aarav — here's what's happening with your services.", hi: "वापसी पर स्वागत है, आरव — आपकी सेवाओं का सारांश।" }}
        actions={<Link href="/booking" className="btn btn-primary hide-mobile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg> <T en="Book new service" hi="नई सेवा" /></Link>}
      >
        {/* OVERVIEW */}
        <View name="overview">
          <div className="kpi-grid">
            {[
              { ic: IcCal, cls: "", trend: "", val: String(activeCount), en: "Active bookings", hi: "सक्रिय बुकिंग" },
              { ic: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>, cls: "success", trend: "", val: String(completedCount), en: "Completed services", hi: "पूर्ण सेवाएँ" },
              { ic: IcCard, cls: "amber", trend: "", val: "₹" + spent.toLocaleString("en-IN"), en: "Total spent", hi: "कुल खर्च" },
              { ic: IcHeart, cls: "info", trend: "", val: String(saved.length), en: "Saved workers", hi: "सहेजे कार्यकर्ता" },
            ].map((k) => (
              <div className="card kpi" key={k.en}>
                <div className="top"><span className={"icon-chip " + k.cls}>{k.ic}</span>{k.trend && <span className="trend up">{k.trend}</span>}</div>
                <div className="val tnum">{k.val}</div><div className="lbl"><T en={k.en} hi={k.hi} /></div>
              </div>
            ))}
          </div>
          {/* Book by category — the customer's primary action */}
          <div className="card panel mt-1">
            <div className="panel-head">
              <h3><T en="Book a service" hi="सेवा बुक करें" /></h3>
              <Link href="/services" className="link"><T en="View all →" hi="सभी देखें →" /></Link>
            </div>
            <div className="grid grid-4">
              {CATEGORIES.map((c) => (
                <Link key={c.en} href="/booking" className="card card-hover svc-card">
                  <div className="top"><span className={"icon-chip " + c.cls} style={{ fontSize: "1.3rem" }}>{c.emoji}</span><span className="rate">{c.rate}</span></div>
                  <div><h3 style={{ fontSize: "1.02rem" }}><T en={c.en} hi={c.hi} /></h3><span className="count"><T en="Book now" hi="अभी बुक करें" /></span></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-4 mt-3">
            <Link href="/booking" className="card card-hover" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span className="icon-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></span>
              <div><b><T en="Book a service" hi="सेवा बुक करें" /></b><div className="text-muted text-sm"><T en="Schedule a pro" hi="पेशेवर शेड्यूल करें" /></div></div>
            </Link>
            <Link href="/booking" className="card card-hover" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span className="icon-chip amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" /></svg></span>
              <div><b><T en="Emergency help" hi="आपातकालीन मदद" /></b><div className="text-muted text-sm"><T en="Under 30 min" hi="30 मिनट में" /></div></div>
            </Link>
            <Link href="/services" className="card card-hover" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span className="icon-chip info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg></span>
              <div><b><T en="Browse workers" hi="कार्यकर्ता देखें" /></b><div className="text-muted text-sm"><T en="Near you" hi="आपके पास" /></div></div>
            </Link>
            <button className="card card-hover" style={{ display: "flex", gap: 12, alignItems: "center", textAlign: "left" }} onClick={() => show("Support: 1800-11-SAHKAR · we reply within 2 hours")}>
              <span className="icon-chip success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></span>
              <div><b><T en="Get support" hi="सहायता पाएँ" /></b><div className="text-muted text-sm"><T en="24×7 helpline" hi="24×7 हेल्पलाइन" /></div></div>
            </button>
          </div>

          {/* Active bookings + Offers (no graphs) */}
          <div className="dash-grid two mt-3">
            <div className="card panel">
              <div className="panel-head"><h3><T en="Your active bookings" hi="आपकी सक्रिय बुकिंग" /></h3></div>
              {upcoming.length === 0 && <p className="empty-state"><T en="No active bookings. Book a service above." hi="कोई सक्रिय बुकिंग नहीं। ऊपर से सेवा बुक करें।" /></p>}
              {upcoming.map((b) => (
                <div key={b.id} className="summary-row" style={{ alignItems: "center" }}>
                  <div className="td-user"><span className="avatar" style={{ background: b.color }}>{b.ini}</span><div><b>{b.svc}</b><div className="text-muted text-xs">{b.who} · {b.when}</div></div></div>
                  <StatusPill kind={b.kind}>{b.status}</StatusPill>
                </div>
              ))}
            </div>
            <div className="card panel">
              <div className="panel-head"><h3><T en="Offers & benefits" hi="ऑफ़र व लाभ" /></h3></div>
              <ul className="check-list" style={{ marginTop: 0 }}>
                {[
                  { en: "10% off your first cooperative booking", hi: "पहली सहकारी बुकिंग पर 10% छूट" },
                  { en: "Every professional is ₹5 lakh insured", hi: "प्रत्येक पेशेवर ₹5 लाख बीमित" },
                  { en: "Free rebooking within 7 days", hi: "7 दिनों में मुफ़्त री-बुकिंग" },
                  { en: "Transparent pricing · GST invoice", hi: "पारदर्शी मूल्य · GST चालान" },
                ].map((o) => (
                  <li key={o.en}><span className="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></span><div><b><T en={o.en} hi={o.hi} /></b></div></li>
                ))}
              </ul>
            </div>
          </div>
        </View>

        {/* BOOKINGS */}
        <View name="bookings">
          <div className="card panel">
            <div className="panel-head">
              <h3><T en="My Bookings" hi="मेरी बुकिंग" /></h3>
              <PanelSearch value={q} onChange={setQ} placeholder="Search bookings…" />
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Service</th><th>Professional</th><th>Date &amp; Time</th><th>Status</th><th>Amount</th><th>Action</th></tr></thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id}>
                      <td>{b.svc}</td>
                      <td><div className="td-user"><span className="avatar" style={{ background: b.color }}>{b.ini}</span> {b.who}</div></td>
                      <td>{b.when}</td>
                      <td><StatusPill kind={b.kind}>{b.status}</StatusPill></td>
                      <td>{b.amt}</td>
                      <td>
                        <div className="row-actions">
                          <ActionButton toast="Rebooking started">Rebook</ActionButton>
                          {["Confirmed", "In progress", "Assigned", "Pending"].includes(b.status) && (
                            <button className="btn btn-ghost btn-sm" onClick={() => cancel(b.id)}>Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </View>

        {/* PAYMENTS */}
        <View name="payments">
          <div className="dash-grid two">
            <div className="card panel">
              <div className="panel-head"><h3><T en="Payments & Invoices" hi="भुगतान व चालान" /></h3></div>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Invoice #</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th><th>Invoice</th></tr></thead>
                  <tbody>
                    {[
                      { inv: "INV-20482", s: "AC Repair", d: "26 Aug 2026", a: "₹529", paid: false },
                      { inv: "INV-20355", s: "Deep Cleaning", d: "18 Aug 2026", a: "₹699", paid: true },
                      { inv: "INV-20218", s: "Carpentry — Door", d: "11 Aug 2026", a: "₹899", paid: true },
                      { inv: "INV-20090", s: "Electrical Fitting", d: "02 Aug 2026", a: "₹449", paid: true },
                    ].map((r) => (
                      <tr key={r.inv}>
                        <td>{r.inv}</td><td>{r.s}</td><td>{r.d}</td><td>{r.a}</td>
                        <td>{r.paid ? <StatusPill kind="success">Paid</StatusPill> : <StatusPill kind="warning">Due</StatusPill>}</td>
                        <td><ActionButton toast="Invoice downloaded">Download</ActionButton></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="card panel">
                <div className="panel-head"><h3><T en="Cooperative wallet" hi="सहकारी वॉलेट" /></h3></div>
                <div className="tnum" style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700 }}>₹1,250</div>
                <p className="text-muted text-sm"><T en="Available balance" hi="उपलब्ध शेष" /></p>
                <ActionButton className="btn btn-primary btn-sm mt-2 w-full" toast="Add money — UPI opened">Add money</ActionButton>
              </div>
              <div className="card panel mt-3">
                <div className="panel-head"><h3><T en="Payment methods" hi="भुगतान के तरीके" /></h3></div>
                <div className="summary-row"><span>UPI · aarav@okhdfc</span><span className="pill pill-success">Default</span></div>
                <div className="summary-row"><span>HDFC •••• 4821</span><ActionButton toast="Card removed">Remove</ActionButton></div>
                <ActionButton className="btn btn-ghost btn-sm mt-2 w-full" toast="Add a new payment method">+ Add method</ActionButton>
              </div>
            </div>
          </div>
        </View>

        {/* SAVED */}
        <View name="saved">
          <div className="grid grid-3">
            {saved.map((w) => (
              <div className="card" key={w.id}>
                <div className="row" style={{ gap: 12 }}>
                  <span className="avatar" style={{ width: 52, height: 52, background: w.color }}>{w.ini}</span>
                  <div>
                    <b>{w.n}</b><div className="text-muted text-sm">{w.r}</div>
                    <span className="rating">{StarFill} {w.rate}</span>
                  </div>
                </div>
                <div className="row-actions mt-2" style={{ width: "100%" }}>
                  <Link href="/booking" className="btn btn-primary btn-sm flex-1">Book</Link>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setSaved((s) => s.filter((x) => x.id !== w.id)); show("Removed from saved"); }}>Remove</button>
                </div>
              </div>
            ))}
            {saved.length === 0 && <p className="empty-state"><T en="No saved workers yet." hi="अभी कोई सहेजा कार्यकर्ता नहीं।" /></p>}
          </div>
        </View>

        {/* RATINGS */}
        <View name="ratings">
          <div className="grid grid-2">
            {[
              { ini: "PK", color: "linear-gradient(135deg,#fbbf24,#f59e0b)", n: "Priya Kumari", s: "Deep Cleaning · 18 Aug" },
              { ini: "SK", color: "linear-gradient(135deg,#34d399,#059669)", n: "Suresh Kumar", s: "Carpentry — Door · 11 Aug" },
            ].map((r) => (
              <form className="card panel" key={r.ini} onSubmit={(e) => { e.preventDefault(); show("Thanks for your rating!"); }}>
                <div className="row" style={{ gap: 12 }}><span className="avatar" style={{ background: r.color }}>{r.ini}</span><div><b>{r.n}</b><div className="text-muted text-sm">{r.s}</div></div></div>
                <div className="mt-2"><StarRating /></div>
                <textarea className="textarea mt-2" placeholder="Share your experience…" />
                <button className="btn btn-primary btn-sm mt-2" type="submit"><T en="Submit rating" hi="रेटिंग सबमिट करें" /></button>
              </form>
            ))}
          </div>
        </View>

        {/* SUPPORT */}
        <View name="support">
          <div className="dash-grid two">
            <form className="card panel" onSubmit={(e) => { e.preventDefault(); show("Support request sent — we'll reply within 2 hours."); }}>
              <div className="panel-head"><h3><T en="Contact support" hi="सहायता से संपर्क करें" /></h3></div>
              <div className="field mb-2"><label><T en="Subject" hi="विषय" /></label><input className="input" placeholder="How can we help?" /></div>
              <div className="field mb-2"><label><T en="Related booking" hi="संबंधित बुकिंग" /></label>
                <select className="select"><option>AC Repair — INV-20482</option><option>Deep Cleaning — INV-20355</option><option>Other</option></select>
              </div>
              <div className="field mb-2"><label><T en="Message" hi="संदेश" /></label><textarea className="textarea" placeholder="Describe your issue…" /></div>
              <button className="btn btn-primary" type="submit"><T en="Send message" hi="संदेश भेजें" /></button>
            </form>
            <div className="card panel">
              <div className="panel-head"><h3><T en="Frequently asked" hi="अक्सर पूछे जाने वाले" /></h3></div>
              <details className="mb-2" style={{ cursor: "pointer" }}><summary className="fw-600"><T en="How do I cancel a booking?" hi="बुकिंग कैसे रद्द करें?" /></summary><p className="text-muted text-sm mt-1">Open My Bookings and tap Cancel. Free cancellation up to 2 hours before the slot.</p></details>
              <div className="divider" />
              <details className="mb-2" style={{ cursor: "pointer" }}><summary className="fw-600"><T en="Are workers verified?" hi="क्या कार्यकर्ता सत्यापित हैं?" /></summary><p className="text-muted text-sm mt-1">Every professional is Aadhaar-KYC&apos;d, police-verified and endorsed by their cooperative society.</p></details>
              <div className="divider" />
              <details style={{ cursor: "pointer" }}><summary className="fw-600"><T en="How are refunds handled?" hi="रिफंड कैसे होते हैं?" /></summary><p className="text-muted text-sm mt-1">Refunds return to your cooperative wallet or source account within 3–5 working days.</p></details>
              <ActionButton className="btn btn-ghost btn-sm mt-3" toast="Connecting you to a live agent…">Chat with an agent</ActionButton>
            </div>
          </div>
        </View>
      </DashboardShell>
    </>
  );
}
