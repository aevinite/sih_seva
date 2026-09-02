"use client";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/site/Navbar";
import { DashboardShell, View, StatusPill, ActionButton, PanelSearch, type NavItem } from "@/components/dash/Dashboard";
import { LineChart, BarChart, DoughnutChart, PALETTE } from "@/components/charts/Charts";
import { T, useToast } from "@/lib/providers";

/* ---- icons ---- */
const I = {
  overview: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>),
  requests: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></svg>),
  schedule: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>),
  earnings: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>),
  welfare: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.3 5.2 7.3v5.1c0 4.4 3 7.2 6.8 8.8 3.8-1.6 6.8-4.4 6.8-8.8V7.3z" /><path d="M8.8 12.7l2.4 2.4 4.2-4.7" /></svg>),
  reviews: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z" /></svg>),
  certificates: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M8 13l-1 8 5-3 5 3-1-8" /></svg>),
};
const acctIcon = (p: React.ReactNode) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{p}</svg>);
const check = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;
const bigCheck = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;

const NAV: NavItem[] = [
  { view: "overview", en: "Overview", hi: "अवलोकन", icon: I.overview },
  { view: "requests", en: "Job Requests", hi: "कार्य अनुरोध", icon: I.requests },
  { view: "schedule", en: "My Schedule", hi: "मेरा कार्यक्रम", icon: I.schedule },
  { view: "earnings", en: "Earnings", hi: "कमाई", icon: I.earnings },
  { view: "welfare", en: "Welfare & Insurance", hi: "कल्याण व बीमा", icon: I.welfare },
  { view: "reviews", en: "Ratings & Reviews", hi: "रेटिंग व समीक्षा", icon: I.reviews },
  { view: "certificates", en: "Skill Certificates", hi: "कौशल प्रमाणपत्र", icon: I.certificates },
];

const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const earnData = [28400, 31200, 29800, 36500, 39800, 42800];
const moneyTick = (v: number | string) => "₹" + Number(v) / 1000 + "k";
const GRADS = ["linear-gradient(135deg,#2dd4bf,#0d9488)", "linear-gradient(135deg,#60a5fa,#2563eb)", "linear-gradient(135deg,#fbbf24,#f59e0b)", "linear-gradient(135deg,#a78bfa,#7c3aed)", "linear-gradient(135deg,#34d399,#059669)", "linear-gradient(135deg,#f472b6,#db2777)"];

type NameRef = { name?: string } | { name?: string }[] | null | undefined;
type Bk = { id: string; service: string; description?: string; address?: string; city?: string; scheduled_at?: string | null; created_at: string; emergency: boolean; total: number; status: string; customer?: NameRef; distanceKm?: number | null };
type WData = {
  profile: { name: string; skills: string[]; society: string | null; rating: number; ratingCount: number; jobsDone: number; verification: string; available: boolean; insuranceActive: boolean; welfareBalance: number } | null;
  requests: Bk[]; schedule: Bk[]; completed: Bk[]; earnings: number;
  certificates: { id: string; name: string; issuer: string; issued_on: string; status: string }[];
  claims: { id: string; type: string; amount: number; status: string }[];
  reviews: { stars: number; comment?: string; created_at: string; by?: NameRef }[];
};

const nameOf = (x: NameRef) => (x ? (Array.isArray(x) ? x[0]?.name : x.name) : undefined);
const iniOf = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "C";
const grad = (n: string) => GRADS[(n.charCodeAt(0) || 0) % GRADS.length];
const inr = (n: number) => "₹" + (n || 0).toLocaleString("en-IN");
const whenOf = (b: Bk) => {
  const d = b.scheduled_at ? new Date(b.scheduled_at) : new Date(b.created_at);
  return { day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), time: b.scheduled_at ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : b.emergency ? "On-demand" : "Flexible" };
};
const net = (b: Bk) => Math.round((b.total || 0) * 0.92);
const pin = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>;
/* proximity chip: green "near you" when the job is within 10 km of the worker */
const DistTag = ({ b }: { b: Bk }) => {
  if (b.distanceKm == null) return null;
  const near = b.distanceKm <= 10;
  return (
    <span className="text-xs" style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 2, color: near ? "var(--success)" : "var(--muted-foreground)", fontWeight: near ? 600 : 400 }}>
      <span style={{ width: 12, height: 12, display: "inline-flex" }}>{pin}</span>
      {b.distanceKm} km{near ? " · near you" : ""}
    </span>
  );
};

export default function WorkerDashboard() {
  const { show } = useToast();
  const [data, setData] = useState<WData | null>(null);
  const [q, setQ] = useState("");

  const refetch = () => fetch("/api/worker").then((r) => r.json()).then((j) => setData(j)).catch(() => {});
  useEffect(() => { refetch(); }, []);

  const act = async (id: string, action: "accept" | "decline" | "complete") => {
    await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    show(action === "accept" ? "Job accepted — customer notified" : action === "decline" ? "Job declined" : "Marked complete — payment released");
    refetch();
  };

  const p = data?.profile;
  const requests = data?.requests ?? [];
  const schedule = data?.schedule ?? [];
  const completed = data?.completed ?? [];
  const reviews = data?.reviews ?? [];
  const certs = data?.certificates ?? [];
  const filteredReq = useMemo(() => requests.filter((r) => (r.service + " " + (nameOf(r.customer) || "") + " " + (r.city || "")).toLowerCase().includes(q.toLowerCase())), [requests, q]);

  return (
    <>
      <Navbar />
      <DashboardShell
        who={{ initials: p ? iniOf(p.name) : "RS", name: p?.name || "Worker", role: { en: (p?.skills?.[0] || "Worker") + " · " + (p?.verification === "verified" ? "Verified" : "Pending"), hi: (p?.skills?.[0] || "कार्यकर्ता") + " · " + (p?.verification === "verified" ? "सत्यापित" : "लंबित") }, color: "linear-gradient(135deg,#2dd4bf,#0d9488)", badge: (<div className="row" style={{ gap: 8, margin: "-8px 4px 16px" }}><span className="pill pill-success"><span className="dot" /> <T en="Online" hi="ऑनलाइन" /></span></div>) }}
        nav={NAV}
        sideLabel={{ en: "Account", hi: "खाता" }}
        extraNav={[
          { en: "Profile", hi: "प्रोफ़ाइल", toast: "Opening your profile…", icon: acctIcon(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>) },
          { en: "Availability", hi: "उपलब्धता", toast: "Availability settings updated", icon: acctIcon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>) },
          { en: "Logout", hi: "लॉग आउट", toast: "Signed out", icon: acctIcon(<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />) },
        ]}
        subtitle={{ en: `You have ${requests.length} new job request(s) nearby.`, hi: `आपके पास ${requests.length} नए कार्य अनुरोध हैं।` }}
        actions={<>
          <span className="pill pill-success"><span className="dot" /> <T en="Available" hi="उपलब्ध" /></span>
          <ActionButton toast="You are now offline"><T en="Go offline" hi="ऑफ़लाइन जाएँ" /></ActionButton>
        </>}
      >
        {/* OVERVIEW */}
        <View name="overview">
          <div className="kpi-grid">
            <div className="card kpi"><div className="top"><span className="icon-chip">{I.earnings}</span></div><div className="val tnum">{inr(data?.earnings ?? 0)}</div><div className="lbl"><T en="Earnings (net)" hi="कमाई (शुद्ध)" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip success">{check}</span></div><div className="val tnum">{p?.jobsDone ?? 0}</div><div className="lbl"><T en="Jobs completed" hi="पूर्ण कार्य" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip amber">{I.reviews}</span></div><div className="val tnum">{p?.rating ? p.rating + " ★" : "New"}</div><div className="lbl"><T en="Average rating" hi="औसत रेटिंग" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip info">{I.requests}</span></div><div className="val tnum">{requests.length}</div><div className="lbl"><T en="Open job requests" hi="खुले कार्य अनुरोध" /></div></div>
          </div>
          <div className="dash-grid two mb-3">
            <div className="card panel">
              <div className="panel-head"><h3><T en="Earnings trend" hi="कमाई का रुझान" /></h3><span className="pill pill-primary"><T en="Last 6 months" hi="पिछले 6 माह" /></span></div>
              <div className="chart-wrap"><BarChart data={{ labels: months, datasets: [{ label: "Earnings", data: earnData, backgroundColor: PALETTE.teal, borderRadius: 8, maxBarThickness: 42 }] }} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: PALETTE.grid }, ticks: { callback: moneyTick } } } }} /></div>
            </div>
            <div className="card panel">
              <div className="panel-head"><h3><T en="Jobs by type" hi="कार्य प्रकार अनुसार" /></h3></div>
              <div className="chart-wrap sm"><DoughnutChart data={{ labels: ["Repairs", "Installations", "Wiring", "Inspections"], datasets: [{ data: [42, 28, 20, 10], backgroundColor: [PALETTE.teal, PALETTE.amber, PALETTE.blue, PALETTE.green], borderWidth: 0 }] }} options={{ plugins: { legend: { position: "bottom", labels: { padding: 16 } } } }} /></div>
            </div>
          </div>
          <div className="card ai-card">
            <div className="row-top"><span className="ai-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 5 5 .5-4 3.5 1.5 5L12 18l-4.5 3 1.5-5-4-3.5 5-.5z" /></svg> <T en="AI Insight" hi="AI अंतर्दृष्टि" /></span></div>
            <p className="fw-600" style={{ fontSize: "1.05rem" }}><T en="Demand for your skill in your area is expected to rise next week." hi="अगले सप्ताह आपके क्षेत्र में आपके कौशल की मांग बढ़ने की उम्मीद है।" /></p>
            <p className="text-muted mt-1"><T en="Keep your calendar open on the weekend to capture higher-value emergency jobs." hi="सप्ताहांत पर कैलेंडर खुला रखें ताकि अधिक-मूल्य वाले आपातकालीन कार्य मिलें।" /></p>
          </div>
        </View>

        {/* REQUESTS */}
        <View name="requests">
          <div className="card panel">
            <div className="panel-head">
              <h3><T en="New job requests near you" hi="आपके पास नए कार्य अनुरोध" /></h3>
              <PanelSearch value={q} onChange={setQ} placeholder="Search jobs…" />
            </div>
            {filteredReq.length === 0 && <p className="empty-state"><T en="No new job requests right now." hi="अभी कोई नया कार्य अनुरोध नहीं।" /></p>}
            {filteredReq.length > 0 && (
              <div className="table-wrap">
                <table className="data cards">
                  <thead><tr><th><T en="Service" hi="सेवा" /></th><th><T en="Location" hi="स्थान" /></th><th><T en="Schedule" hi="समय" /></th><th><T en="Payout" hi="भुगतान" /></th><th><T en="Action" hi="कार्रवाई" /></th></tr></thead>
                  <tbody>
                    {filteredReq.map((r) => { const w = whenOf(r); return (
                      <tr key={r.id}>
                        <td data-label="Service"><b>{r.service} {r.emergency && <span className="pill pill-danger" style={{ marginLeft: 4 }}>Emergency</span>}</b><div className="text-muted text-xs">{nameOf(r.customer) || "Customer"}</div></td>
                        <td data-label="Location">{r.address || r.city || "—"}<div className="text-muted text-xs">{r.city}</div><DistTag b={r} /></td>
                        <td data-label="Schedule">{w.day}<div className="text-muted text-xs">{w.time}</div></td>
                        <td data-label="Payout"><b className="tnum">{inr(net(r))}</b></td>
                        <td data-label="Action" className="cell-action"><div className="row-actions">
                          <button className="btn btn-primary btn-sm" onClick={() => act(r.id, "accept")}><T en="Accept" hi="स्वीकारें" /></button>
                          <button className="btn btn-ghost btn-sm" onClick={() => act(r.id, "decline")}><T en="Decline" hi="अस्वीकारें" /></button>
                        </div></td>
                      </tr>
                    ); })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </View>

        {/* SCHEDULE */}
        <View name="schedule">
          <div className="card panel">
            <div className="panel-head"><h3><T en="Accepted / upcoming jobs" hi="स्वीकृत / आगामी कार्य" /></h3><span className="pill pill-primary">{schedule.length} <T en="active" hi="सक्रिय" /></span></div>
            {schedule.length === 0 && <p className="empty-state"><T en="No accepted jobs yet — accept a request to see it here." hi="अभी कोई स्वीकृत कार्य नहीं।" /></p>}
            {schedule.length > 0 && (
              <div className="table-wrap">
                <table className="data cards">
                  <thead><tr><th><T en="Time" hi="समय" /></th><th><T en="Customer" hi="ग्राहक" /></th><th><T en="Service & Address" hi="सेवा व पता" /></th><th><T en="Status" hi="स्थिति" /></th><th><T en="Action" hi="कार्रवाई" /></th></tr></thead>
                  <tbody>
                    {schedule.map((j) => { const w = whenOf(j); const cn = nameOf(j.customer) || "Customer"; return (
                      <tr key={j.id}>
                        <td data-label="Time"><b>{w.day}</b><div className="text-muted text-xs">{w.time}</div></td>
                        <td data-label="Customer"><div className="td-user"><span className="avatar" style={{ width: 32, height: 32, fontSize: ".75rem", background: grad(cn) }}>{iniOf(cn)}</span>{cn}</div></td>
                        <td data-label="Service & Address">{j.service}<div className="text-muted text-xs">{j.address || j.city || ""}</div><DistTag b={j} /></td>
                        <td data-label="Status">{j.status === "in_progress" ? <StatusPill kind="warning">In progress</StatusPill> : <StatusPill kind="info">Confirmed</StatusPill>}</td>
                        <td data-label="Action" className="cell-action"><button className="btn btn-primary btn-sm" onClick={() => act(j.id, "complete")}><T en="Mark complete" hi="पूर्ण करें" /></button></td>
                      </tr>
                    ); })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </View>

        {/* EARNINGS */}
        <View name="earnings">
          <div className="kpi-grid">
            <div className="card kpi"><div className="top"><span className="icon-chip">{I.earnings}</span></div><div className="val tnum">{inr(data?.earnings ?? 0)}</div><div className="lbl"><T en="Total net earnings" hi="कुल शुद्ध कमाई" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip success">{check}</span></div><div className="val tnum">{completed.length}</div><div className="lbl"><T en="Paid jobs" hi="भुगतान किए कार्य" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg></span></div><div className="val tnum">8%</div><div className="lbl"><T en="Platform commission" hi="प्लेटफॉर्म कमीशन" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip info">{I.welfare}</span></div><div className="val tnum">{inr(p?.welfareBalance ?? 0)}</div><div className="lbl"><T en="Welfare balance" hi="कल्याण शेष" /></div></div>
          </div>
          <div className="card panel">
            <div className="panel-head"><h3><T en="Recent payouts" hi="हाल के भुगतान" /></h3><ActionButton className="btn btn-primary btn-sm" toast="Withdrawal initiated to your bank"><T en="Withdraw to bank" hi="बैंक में निकालें" /></ActionButton></div>
            {completed.length === 0 && <p className="empty-state"><T en="No completed jobs yet." hi="अभी कोई पूर्ण कार्य नहीं।" /></p>}
            {completed.length > 0 && (
              <div className="table-wrap">
                <table className="data cards">
                  <thead><tr><th>Job</th><th>Date</th><th>Gross</th><th>Comm.</th><th>Net</th><th>Status</th></tr></thead>
                  <tbody>
                    {completed.map((b) => (
                      <tr key={b.id}>
                        <td data-label="Job"><b>{b.service}</b></td><td data-label="Date">{whenOf(b).day}</td>
                        <td data-label="Gross" className="tnum">{inr(b.total)}</td><td data-label="Commission" className="tnum">{inr(Math.round(b.total * 0.08))}</td>
                        <td data-label="Net" className="tnum"><b>{inr(net(b))}</b></td><td data-label="Status"><StatusPill kind="success">Paid</StatusPill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </View>

        {/* WELFARE */}
        <View name="welfare">
          <div className="card panel mb-3">
            <div className="panel-head"><h3><T en="Welfare & insurance" hi="कल्याण व बीमा" /></h3><ActionButton toast="Opening policy document…"><T en="View policy" hi="पॉलिसी देखें" /></ActionButton></div>
            <ul className="check-list">
              <li><span className="tick">{bigCheck}</span><div><b><T en="Accident insurance" hi="दुर्घटना बीमा" /> — ₹5,00,000 <span className={"pill " + (p?.insuranceActive ? "pill-success" : "pill-warning")} style={{ marginLeft: 4 }}>{p?.insuranceActive ? "Active" : "Pending"}</span></b><span><T en="Cover provided by the cooperative federation" hi="सहकारी फेडरेशन द्वारा प्रदत्त कवर" /></span></div></li>
              <li><span className="tick">{bigCheck}</span><div style={{ flex: 1 }}><b><T en="Welfare fund balance" hi="कल्याण कोष शेष" /> — {inr(p?.welfareBalance ?? 0)}</b><span><T en="Goal ₹20,000 · earn with every completed job" hi="लक्ष्य ₹20,000 · हर कार्य के साथ अर्जित करें" /></span><div className="meter mt-1" style={{ maxWidth: 320 }}><span style={{ width: Math.min(100, Math.round(((p?.welfareBalance ?? 0) / 20000) * 100)) + "%" }} /></div></div></li>
              <li><span className="tick">{bigCheck}</span><div><b><T en="Next premium: paid by cooperative" hi="अगला प्रीमियम: सहकारी द्वारा भुगतान" /></b><span><T en="No action needed" hi="कोई कार्रवाई आवश्यक नहीं" /></span></div></li>
            </ul>
          </div>
        </View>

        {/* REVIEWS */}
        <View name="reviews">
          <div className="card panel">
            <div className="panel-head"><h3><T en="Ratings & reviews" hi="रेटिंग व समीक्षाएँ" /></h3><span className="rating"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z" /></svg> {p?.rating || "New"} · {p?.ratingCount || 0} reviews</span></div>
            {reviews.length === 0 && <p className="empty-state"><T en="No reviews yet." hi="अभी कोई समीक्षा नहीं।" /></p>}
            <div className="stack" style={{ gap: 14 }}>
              {reviews.map((r, i) => { const rn = nameOf(r.by) || "Customer"; return (
                <div key={i} style={{ paddingBottom: 14, borderBottom: i < reviews.length - 1 ? "1px solid var(--border)" : undefined }}>
                  <div className="between"><div className="td-user"><span className="avatar" style={{ width: 34, height: 34, fontSize: ".8rem", background: grad(rn) }}>{iniOf(rn)}</span><b>{rn}</b></div><span className="rating" style={{ color: "var(--accent)" }}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span></div>
                  {r.comment && <p className="text-muted mt-1">“{r.comment}”</p>}
                </div>
              ); })}
            </div>
          </div>
        </View>

        {/* CERTIFICATES */}
        <View name="certificates">
          <div className="dash-grid two">
            <div className="card panel">
              <div className="panel-head"><h3><T en="Skill certificates" hi="कौशल प्रमाणपत्र" /></h3></div>
              {certs.length === 0 && <p className="empty-state"><T en="No certificates yet — add one to boost your profile." hi="अभी कोई प्रमाणपत्र नहीं।" /></p>}
              <div className="stack" style={{ gap: 12 }}>
                {certs.map((c) => (
                  <div className="between" key={c.id} style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                    <div className="row" style={{ gap: 12 }}><span className="icon-chip success" style={{ width: 40, height: 40 }}>{I.certificates}</span><div><b>{c.name} <span className="text-muted text-xs">· {c.issuer}</span></b><div className="text-muted text-xs">{new Date(c.issued_on).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div></div></div>
                    {c.status === "verified" ? <span className="verified">{check}</span> : <StatusPill kind="warning">Pending</StatusPill>}
                  </div>
                ))}
              </div>
            </div>
            <div className="card panel">
              <div className="panel-head"><h3><T en="Add a certificate" hi="प्रमाणपत्र जोड़ें" /></h3></div>
              <form className="stack" style={{ gap: 16 }} onSubmit={(e) => { e.preventDefault(); show("Certificate submitted for verification"); }}>
                <div className="field"><label><T en="Certificate name" hi="प्रमाणपत्र नाम" /></label><input className="input" placeholder="e.g. Advanced Wiring" required /></div>
                <div className="field"><label><T en="Issuing authority" hi="जारीकर्ता" /></label><input className="input" placeholder="e.g. NCCT / NSDC" required /></div>
                <div className="field"><label><T en="Upload document" hi="दस्तावेज़ अपलोड करें" /></label><input className="input" type="file" /></div>
                <button className="btn btn-primary" type="submit"><T en="Submit for verification" hi="सत्यापन हेतु जमा करें" /></button>
              </form>
            </div>
          </div>
        </View>
      </DashboardShell>
    </>
  );
}
