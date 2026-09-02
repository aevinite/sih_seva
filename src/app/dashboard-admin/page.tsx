"use client";
import { useMemo, useState } from "react";
import Navbar from "@/components/site/Navbar";
import {
  DashboardShell,
  View,
  StatusPill,
  ActionButton,
  PanelSearch,
  type NavItem,
  type ActionItem,
  type PillKind,
} from "@/components/dash/Dashboard";
import { LineChart, BarChart, DoughnutChart, PALETTE } from "@/components/charts/Charts";
import { T, useToast } from "@/lib/providers";
import type { ChartData, ChartOptions } from "chart.js";

/* ---------------- icons ---------------- */
const I = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M7 14l3-3 3 3 5-6" /></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  bank: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" /></svg>,
  worker: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>,
  cal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4.3 5.2 7.3v5.1c0 4.4 3 7.2 6.8 8.8 3.8-1.6 6.8-4.4 6.8-8.8V7.3z" /><path d="M8.8 12.7l2.4 2.4 4.2-4.7" /></svg>,
  doc: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 15h6M9 11h2" /></svg>,
  gear: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>,
  star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z" /></svg>,
};

const NAV: NavItem[] = [
  { view: "overview", en: "Overview", hi: "अवलोकन", title: "Overview", icon: I.grid },
  { view: "forecasting", en: "Demand Forecasting", hi: "मांग पूर्वानुमान", title: "AI Demand Forecasting", icon: I.chart },
  { view: "allocation", en: "Workforce Allocation", hi: "कार्यबल आवंटन", title: "AI Workforce Allocation", icon: I.users },
  { view: "societies", en: "Societies", hi: "समितियाँ", title: "Cooperative Societies", icon: I.bank },
  { view: "workers", en: "Workers", hi: "कार्यकर्ता", title: "Workers & Verification", icon: I.worker },
  { view: "bookings", en: "Bookings", hi: "बुकिंग", title: "Bookings", icon: I.cal },
  { view: "welfare", en: "Welfare Fund", hi: "कल्याण कोष", title: "Welfare Fund", icon: I.shield },
  { view: "reports", en: "Reports", hi: "रिपोर्ट", title: "Reports & Exports", icon: I.doc },
];
const EXTRA: ActionItem[] = [
  { en: "Settings", hi: "सेटिंग्स", icon: I.gear, toast: "Settings saved" },
  { en: "Logout", hi: "लॉगआउट", icon: I.logout, toast: "Signed out" },
];

/* ---------------- charts ---------------- */
const gridOpt = { color: PALETTE.grid };
function forecastData(): ChartData<"line"> {
  return {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct(F)", "Nov(F)", "Dec(F)"],
    datasets: [
      { label: "Actual demand", data: [11800, 12600, 13400, 14100, 15200, 18320, null, null, null] as (number | null)[], borderColor: PALETTE.teal, backgroundColor: "rgba(13,148,136,0.12)", fill: true, tension: 0.35, borderWidth: 3, pointRadius: 3, pointBackgroundColor: PALETTE.teal },
      { label: "AI forecast", data: [null, null, null, null, null, 18320, 22400, 24800, 21600] as (number | null)[], borderColor: PALETTE.amber, backgroundColor: "rgba(245,158,11,0.10)", borderDash: [6, 6], fill: false, tension: 0.35, borderWidth: 3, pointRadius: 3, pointBackgroundColor: PALETTE.amber },
    ],
  };
}
const forecastOpts: ChartOptions<"line"> = {
  interaction: { mode: "index", intersect: false },
  scales: { x: { grid: { display: false } }, y: { grid: gridOpt, ticks: { callback: (v) => Number(v) / 1000 + "k" } } },
  plugins: { legend: { position: "top", align: "end" } },
};

/* ---------------- interactive tables ---------------- */
function useFilter<T extends Record<string, unknown>>(rows: T[], q: string, keys: (keyof T)[]) {
  return useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => keys.some((k) => String(r[k]).toLowerCase().includes(s)));
  }, [rows, q, keys]);
}

function AllocationTable() {
  const { show } = useToast();
  type A = { id: number; district: string; predicted: number; available: number; gap: string; gapKind: PillKind; action: string; priority: string; priorityKind: PillKind; done?: boolean; status?: string };
  const [rows, setRows] = useState<A[]>([
    { id: 1, district: "Jaipur", predicted: 1240, available: 980, gap: "−260", gapKind: "danger", action: "Deploy 260 workers", priority: "High", priorityKind: "danger" },
    { id: 2, district: "Udaipur", predicted: 720, available: 610, gap: "−110", gapKind: "danger", action: "Upskill 90 · plumbing", priority: "Medium", priorityKind: "warning" },
    { id: 3, district: "Kota", predicted: 540, available: 520, gap: "−20", gapKind: "success", action: "Balanced · monitor", priority: "Low", priorityKind: "success" },
    { id: 4, district: "Jodhpur", predicted: 610, available: 700, gap: "+90", gapKind: "info", action: "Redistribute 60 to Jaipur", priority: "Medium", priorityKind: "warning" },
    { id: 5, district: "Bikaner", predicted: 320, available: 460, gap: "+140", gapKind: "info", action: "Redeploy 60 idle workers", priority: "High", priorityKind: "danger" },
    { id: 6, district: "Ajmer", predicted: 430, available: 410, gap: "−20", gapKind: "success", action: "Balanced · monitor", priority: "Low", priorityKind: "success" },
  ]);
  const [q, setQ] = useState("");
  const shown = useFilter(rows, q, ["district", "action"]);
  const approve = (id: number) => { setRows((r) => r.map((x) => (x.id === id ? { ...x, done: true, status: "Approved" } : x))); show("Allocation approved"); };
  return (
    <div className="card panel">
      <div className="panel-head">
        <div className="row gap-sm"><span className="ai-badge">{I.star} AI</span><h3><T en="Workforce allocation plan" hi="कार्यबल आवंटन योजना" /></h3></div>
        <PanelSearch value={q} onChange={setQ} placeholder="Search district…" />
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th><T en="District" hi="जिला" /></th><th><T en="Predicted" hi="अनुमानित" /></th><th><T en="Available" hi="उपलब्ध" /></th><th><T en="Gap" hi="अंतर" /></th><th><T en="Recommended action" hi="अनुशंसित कार्रवाई" /></th><th><T en="Priority" hi="प्राथमिकता" /></th><th><T en="Action" hi="कार्रवाई" /></th></tr></thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td className="fw-600">{r.district}</td>
                <td className="tnum">{r.predicted.toLocaleString("en-IN")}</td>
                <td className="tnum">{r.available.toLocaleString("en-IN")}</td>
                <td>{r.done ? <StatusPill kind="success">{r.status}</StatusPill> : <span className={"pill pill-" + r.gapKind}>{r.gap}</span>}</td>
                <td>{r.action}</td>
                <td><span className={"pill pill-" + r.priorityKind}>{r.priority}</span></td>
                <td><span className="row-actions">
                  <ActionButton className="btn btn-primary btn-sm" disabled={r.done} onClick={() => approve(r.id)}>Approve</ActionButton>
                  <ActionButton className="btn btn-ghost btn-sm" toast="Opening adjustment planner">Adjust</ActionButton>
                </span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ActionButton className="btn btn-primary mt-3" toast="Full allocation plan applied across 42 societies"><T en="Apply full plan" hi="पूरी योजना लागू करें" /></ActionButton>
    </div>
  );
}

function SocietiesTable() {
  const { show } = useToast();
  type S = { id: number; name: string; district: string; workers: number; bookings: number; rating: string; status: string; kind: PillKind };
  const [rows, setRows] = useState<S[]>([
    { id: 1, name: "Jaipur Nagar Shramik Sahakari", district: "Jaipur", workers: 1120, bookings: 3410, rating: "★ 4.9", status: "Active", kind: "success" },
    { id: 2, name: "Udaipur Kamgar Co-op", district: "Udaipur", workers: 860, bookings: 2180, rating: "★ 4.8", status: "Active", kind: "success" },
    { id: 3, name: "Kota Shramik Samiti", district: "Kota", workers: 740, bookings: 1920, rating: "★ 4.8", status: "Active", kind: "success" },
    { id: 4, name: "Jodhpur Sewa Sahakari", district: "Jodhpur", workers: 690, bookings: 1640, rating: "★ 4.7", status: "Active", kind: "success" },
    { id: 5, name: "Ajmer Labour Co-op", district: "Ajmer", workers: 520, bookings: 1210, rating: "★ 4.7", status: "Review", kind: "warning" },
    { id: 6, name: "Bikaner Karmik Sangh", district: "Bikaner", workers: 460, bookings: 980, rating: "★ 4.6", status: "Active", kind: "success" },
  ]);
  const [q, setQ] = useState("");
  const shown = useFilter(rows, q, ["name", "district"]);
  const suspend = (id: number) => { setRows((r) => r.map((x) => (x.id === id ? { ...x, status: "Suspended", kind: "warning" } : x))); show("Society suspended pending review"); };
  return (
    <div className="card panel">
      <div className="panel-head"><h3><T en="Cooperative societies" hi="सहकारी समितियाँ" /></h3><PanelSearch value={q} onChange={setQ} placeholder="Search society…" /></div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th><T en="Society" hi="समिति" /></th><th><T en="District" hi="जिला" /></th><th><T en="Workers" hi="कार्यकर्ता" /></th><th><T en="Bookings" hi="बुकिंग" /></th><th><T en="Rating" hi="रेटिंग" /></th><th><T en="Status" hi="स्थिति" /></th><th><T en="Action" hi="कार्रवाई" /></th></tr></thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td className="fw-600">{r.name}</td><td>{r.district}</td>
                <td className="tnum">{r.workers.toLocaleString("en-IN")}</td><td className="tnum">{r.bookings.toLocaleString("en-IN")}</td>
                <td><span className="rating">{r.rating}</span></td>
                <td><StatusPill kind={r.kind}>{r.status}</StatusPill></td>
                <td><span className="row-actions">
                  <ActionButton className="btn btn-ghost btn-sm" toast="Opening society profile">View</ActionButton>
                  <ActionButton className="btn btn-ghost btn-sm" onClick={() => suspend(r.id)}>Suspend</ActionButton>
                </span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorkersTable() {
  const { show } = useToast();
  type W = { id: number; initials: string; color: string; name: string; skill: string; society: string; rating: string; status: string; kind: PillKind; done?: boolean };
  const [rows, setRows] = useState<W[]>([
    { id: 1, initials: "RS", color: "linear-gradient(135deg,#2dd4bf,#0d9488)", name: "Ramesh Solanki", skill: "Electrician", society: "Jaipur Nagar", rating: "★ 4.9", status: "Verified", kind: "success" },
    { id: 2, initials: "PK", color: "linear-gradient(135deg,#fbbf24,#f59e0b)", name: "Priya Kumari", skill: "Caregiver", society: "Udaipur Kamgar", rating: "★ 5.0", status: "Pending", kind: "warning" },
    { id: 3, initials: "AV", color: "linear-gradient(135deg,#60a5fa,#2563eb)", name: "Anil Verma", skill: "Plumber", society: "Kota Shramik", rating: "★ 4.7", status: "Verified", kind: "success" },
    { id: 4, initials: "SG", color: "linear-gradient(135deg,#a78bfa,#7c3aed)", name: "Sanjay Gehlot", skill: "Carpenter", society: "Jodhpur Sewa", rating: "★ 4.6", status: "Pending", kind: "warning" },
    { id: 5, initials: "MD", color: "linear-gradient(135deg,#34d399,#059669)", name: "Meena Devi", skill: "Cleaner", society: "Ajmer Labour", rating: "★ 4.8", status: "Verified", kind: "success" },
    { id: 6, initials: "HK", color: "linear-gradient(135deg,#f87171,#dc2626)", name: "Harish Kumar", skill: "Painter", society: "Bikaner Karmik", rating: "★ 4.5", status: "Pending", kind: "warning" },
    { id: 7, initials: "DL", color: "linear-gradient(135deg,#22d3ee,#0891b2)", name: "Deepa Lal", skill: "Driver", society: "Jaipur Nagar", rating: "★ 4.9", status: "Verified", kind: "success" },
  ]);
  const [q, setQ] = useState("");
  const shown = useFilter(rows, q, ["name", "skill", "society"]);
  const set = (id: number, status: string, kind: PillKind, msg: string) => { setRows((r) => r.map((x) => (x.id === id ? { ...x, status, kind, done: true } : x))); show(msg); };
  return (
    <div className="card panel">
      <div className="panel-head"><h3><T en="Workers & verification" hi="कार्यकर्ता व सत्यापन" /></h3><PanelSearch value={q} onChange={setQ} placeholder="Search worker…" /></div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th><T en="Worker" hi="कार्यकर्ता" /></th><th><T en="Skill" hi="कौशल" /></th><th><T en="Society" hi="समिति" /></th><th><T en="Rating" hi="रेटिंग" /></th><th><T en="Verification" hi="सत्यापन" /></th><th><T en="Action" hi="कार्रवाई" /></th></tr></thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td><div className="td-user"><span className="avatar" style={{ background: r.color }}>{r.initials}</span>{r.name}</div></td>
                <td>{r.skill}</td><td>{r.society}</td><td><span className="rating">{r.rating}</span></td>
                <td><StatusPill kind={r.kind}>{r.status}</StatusPill></td>
                <td><span className="row-actions">
                  <ActionButton className="btn btn-primary btn-sm" disabled={r.done && r.status === "Verified"} onClick={() => set(r.id, "Verified", "success", r.name + " verified")}>Verify</ActionButton>
                  <ActionButton className="btn btn-ghost btn-sm" onClick={() => set(r.id, "Suspended", "warning", "Worker suspended")}>Suspend</ActionButton>
                </span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookingsTable() {
  type B = { id: string; initials: string; color: string; customer: string; service: string; society: string; status: string; kind: PillKind; amount: string };
  const rows: B[] = [
    { id: "#AW-84213", initials: "SM", color: "linear-gradient(135deg,#2dd4bf,#0d9488)", customer: "Sunita Mehta", service: "Plumbing", society: "Jaipur Nagar", status: "Completed", kind: "success", amount: "₹529" },
    { id: "#AW-84212", initials: "RP", color: "linear-gradient(135deg,#fbbf24,#f59e0b)", customer: "Rahul Patel", service: "Electrical", society: "Kota Shramik", status: "In progress", kind: "info", amount: "₹349" },
    { id: "#AW-84211", initials: "AK", color: "linear-gradient(135deg,#60a5fa,#2563eb)", customer: "Anjali Kumari", service: "Deep cleaning", society: "Udaipur Kamgar", status: "Assigned", kind: "warning", amount: "₹899" },
    { id: "#AW-84210", initials: "MG", color: "linear-gradient(135deg,#f87171,#dc2626)", customer: "Mohit Gupta", service: "Carpentry", society: "Jodhpur Sewa", status: "Completed", kind: "success", amount: "₹1,240" },
    { id: "#AW-84209", initials: "NS", color: "linear-gradient(135deg,#a78bfa,#7c3aed)", customer: "Neha Sharma", service: "Caregiver (elder)", society: "Ajmer Labour", status: "In progress", kind: "info", amount: "₹1,499" },
    { id: "#AW-84208", initials: "VR", color: "linear-gradient(135deg,#34d399,#059669)", customer: "Vikram Rao", service: "Emergency plumbing", society: "Jaipur Nagar", status: "Priority", kind: "danger", amount: "₹679" },
    { id: "#AW-84207", initials: "KP", color: "linear-gradient(135deg,#22d3ee,#0891b2)", customer: "Karan Puri", service: "Painting", society: "Bikaner Karmik", status: "Completed", kind: "success", amount: "₹2,100" },
  ];
  const [q, setQ] = useState("");
  const shown = useFilter(rows, q, ["id", "customer", "service", "society"]);
  return (
    <div className="card panel">
      <div className="panel-head"><h3><T en="Recent bookings across societies" hi="समितियों में हाल की बुकिंग" /></h3><PanelSearch value={q} onChange={setQ} placeholder="Search booking…" /></div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th><T en="Booking ID" hi="बुकिंग आईडी" /></th><th><T en="Customer" hi="ग्राहक" /></th><th><T en="Service" hi="सेवा" /></th><th><T en="Society" hi="समिति" /></th><th><T en="Status" hi="स्थिति" /></th><th><T en="Amount" hi="राशि" /></th></tr></thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td className="fw-600">{r.id}</td>
                <td><div className="td-user"><span className="avatar" style={{ background: r.color }}>{r.initials}</span>{r.customer}</div></td>
                <td>{r.service}</td><td>{r.society}</td>
                <td><StatusPill kind={r.kind}>{r.status}</StatusPill></td>
                <td className="tnum">{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClaimsTable() {
  const { show } = useToast();
  type C = { id: number; worker: string; type: string; amount: string; status: string; kind: PillKind; done?: boolean };
  const [rows, setRows] = useState<C[]>([
    { id: 1, worker: "Ramesh Solanki", type: "Accident", amount: "₹42,000", status: "Pending", kind: "warning" },
    { id: 2, worker: "Meena Devi", type: "Health", amount: "₹8,500", status: "Pending", kind: "warning" },
    { id: 3, worker: "Harish Kumar", type: "Education", amount: "₹15,000", status: "Pending", kind: "warning" },
  ]);
  const set = (id: number, status: string, kind: PillKind, msg: string) => { setRows((r) => r.map((x) => (x.id === id ? { ...x, status, kind, done: true } : x))); show(msg); };
  return (
    <div className="card panel">
      <div className="panel-head"><h3><T en="Pending welfare claims" hi="लंबित कल्याण दावे" /></h3></div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Worker</th><th><T en="Type" hi="प्रकार" /></th><th><T en="Amount" hi="राशि" /></th><th><T en="Status" hi="स्थिति" /></th><th><T en="Action" hi="कार्रवाई" /></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.worker}</td><td>{r.type}</td><td className="tnum">{r.amount}</td>
                <td><StatusPill kind={r.kind}>{r.status}</StatusPill></td>
                <td><span className="row-actions">
                  <ActionButton className="btn btn-primary btn-sm" disabled={r.done} onClick={() => set(r.id, "Approved", "success", "Claim approved & disbursed")}>Approve</ActionButton>
                  <ActionButton className="btn btn-ghost btn-sm" disabled={r.done} onClick={() => set(r.id, "Rejected", "danger", "Claim rejected")}>Reject</ActionButton>
                </span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- KPI helpers ---------------- */
function Kpi({ chip, icon, trend, val, en, hi }: { chip: string; icon: React.ReactNode; trend?: string; val: string; en: string; hi: string }) {
  return (
    <div className="card kpi">
      <div className="top"><span className={"icon-chip " + chip}>{icon}</span>{trend && <span className="trend up">▲ {trend}</span>}</div>
      <div className="val tnum">{val}</div>
      <div className="lbl"><T en={en} hi={hi} /></div>
    </div>
  );
}

/* ---------------- page ---------------- */
export default function FederationAdmin() {
  const demandCat: ChartData<"bar"> = {
    labels: ["Electrician", "Plumber", "Cleaner", "Carpenter", "Painter", "Caregiver", "Driver"],
    datasets: [{ label: "Bookings", data: [4200, 3600, 3100, 2400, 1900, 1500, 1620], backgroundColor: [PALETTE.teal, PALETTE.blue, PALETTE.green, PALETTE.amber, PALETTE.purple, "#0ea5a4", "#64748b"], borderRadius: 6, barThickness: 20 }],
  };
  const util: ChartData<"doughnut"> = {
    labels: ["Deployed", "Available", "Leave/Training"],
    datasets: [{ data: [78, 15, 7], backgroundColor: [PALETTE.teal, PALETTE.amber, PALETTE.blue], borderWidth: 0, hoverOffset: 6 }],
  };
  const regionVals = [6200, 3100, 2800, 2400, 1200, 1900];
  const region: ChartData<"bar"> = {
    labels: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
    datasets: [{ label: "Bookings", data: regionVals, backgroundColor: regionVals.map((v) => (v > 4000 ? PALETTE.red : v > 2500 ? PALETTE.amber : PALETTE.teal)), borderRadius: 6, barThickness: 26 }],
  };
  const reportCards = [
    { chip: "", icon: I.chart, en: "Monthly performance", hi: "मासिक प्रदर्शन", desc: "Bookings, revenue & ratings across all 42 societies.", file: "monthly-performance.pdf", label: "Download PDF" },
    { chip: "amber", icon: I.users, en: "Workforce utilisation", hi: "कार्यबल उपयोग", desc: "District-wise deployment, idle capacity & fill rate.", file: "workforce-utilisation.xlsx", label: "Download XLSX" },
    { chip: "success", icon: I.shield, en: "Welfare & insurance", hi: "कल्याण व बीमा", desc: "Fund flows, premiums, claims & disbursements.", file: "welfare-report.pdf", label: "Download PDF" },
    { chip: "info", icon: I.cal, en: "Payments & payouts", hi: "भुगतान व पेआउट", desc: "GMV, worker payouts, platform commission & GST.", file: "payments-report.xlsx", label: "Download XLSX" },
    { chip: "", icon: I.star, en: "AI forecast accuracy", hi: "AI पूर्वानुमान सटीकता", desc: "Model accuracy, drift & prediction vs. actuals.", file: "ai-forecast-audit.pdf", label: "Download PDF" },
    { chip: "amber", icon: I.doc, en: "NCCT compliance", hi: "NCCT अनुपालन", desc: "Cooperative governance & statutory compliance pack.", file: "ncct-compliance.pdf", label: "Download PDF" },
  ];

  return (
    <>
      <Navbar />
      <DashboardShell
        who={{ initials: "DK", name: "Dinesh Kapoor", role: { en: "Federation Admin · Rajasthan", hi: "फेडरेशन एडमिन · राजस्थान" }, color: "linear-gradient(135deg,#60a5fa,#2563eb)" }}
        nav={NAV}
        extraNav={EXTRA}
        sideLabel={{ en: "System", hi: "सिस्टम" }}
        subtitle={{ en: "Rajasthan State Labour Cooperative Federation · 42 societies", hi: "राजस्थान राज्य श्रमिक सहकारी फेडरेशन · 42 समितियाँ" }}
        actions={
          <>
            <select className="select" style={{ width: "auto" }}>
              <option>Last 30 days</option><option>Last 7 days</option><option>This Quarter</option>
            </select>
            <ActionButton className="btn btn-primary" toast="Report exported as PDF">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              <T en="Export report" hi="रिपोर्ट निर्यात" />
            </ActionButton>
          </>
        }
      >
        {/* OVERVIEW */}
        <View name="overview">
          <div className="kpi-grid">
            <Kpi chip="" icon={I.worker} trend="4.2%" val="12,540" en="Total workers" hi="कुल कार्यकर्ता" />
            <Kpi chip="info" icon={I.bank} trend="2" val="42" en="Active societies" hi="सक्रिय समितियाँ" />
            <Kpi chip="amber" icon={I.cal} trend="12%" val="18,320" en="Bookings this month" hi="इस माह बुकिंग" />
            <Kpi chip="success" icon={I.star} trend="9%" val="₹3.4 Cr" en="Revenue (GMV)" hi="राजस्व" />
          </div>
          <div className="kpi-grid">
            <Kpi chip="info" icon={I.chart} trend="3%" val="78%" en="Avg. workforce utilisation" hi="औसत कार्यबल उपयोग" />
            <Kpi chip="amber" icon={I.star} trend="0.1" val="4.8 ★" en="Avg. service rating" hi="औसत सेवा रेटिंग" />
            <Kpi chip="" icon={I.shield} trend="6%" val="₹1.2 Cr" en="Welfare fund balance" hi="कल्याण कोष शेष" />
            <Kpi chip="success" icon={I.grid} trend="1.5%" val="94%" en="Booking fill rate" hi="बुकिंग पूर्ति दर" />
          </div>

          <div className="card ai-card panel mt-1">
            <div className="row-top between wrap-flex">
              <div className="row gap-sm"><span className="ai-badge">{I.star} AI · ML Model</span><h3 style={{ fontFamily: "var(--font-display)" }}><T en="AI Demand Forecast" hi="AI मांग पूर्वानुमान" /></h3></div>
              <span className="pill pill-success"><span className="dot" /> <T en="Model accuracy 91%" hi="मॉडल सटीकता 91%" /></span>
            </div>
            <p className="text-muted text-sm mb-2"><T en="Projected service bookings across the federation — solid line is actual, dashed is the ML forecast for the next quarter." hi="फेडरेशन में अनुमानित बुकिंग — ठोस रेखा वास्तविक, बिंदुदार अगली तिमाही का पूर्वानुमान।" /></p>
            <div className="chart-wrap"><LineChart data={forecastData()} options={forecastOpts} /></div>
            <div className="divider" />
            <div className="grid grid-3">
              <div className="row" style={{ alignItems: "flex-start", gap: 10 }}><span className="icon-chip amber" style={{ width: 36, height: 36 }}>🎨</span><div className="text-sm"><b><T en="Diwali surge predicted" hi="दिवाली उछाल" /></b><div className="text-muted"><T en="Painting demand +34% before Diwali — pre-train 220 painters in Jaipur & Kota." hi="दिवाली से पहले पेंटिंग मांग +34% — जयपुर व कोटा में 220 पेंटर प्रशिक्षित करें।" /></div></div></div>
              <div className="row" style={{ alignItems: "flex-start", gap: 10 }}><span className="icon-chip info" style={{ width: 36, height: 36 }}>🌧️</span><div className="text-sm"><b><T en="Monsoon plumbing spike" hi="मानसून प्लंबिंग उछाल" /></b><div className="text-muted"><T en="Plumbing bookings +28% in the Udaipur cluster — keep 90 workers on standby." hi="उदयपुर क्लस्टर में प्लंबिंग +28% — 90 कार्यकर्ता तैयार रखें।" /></div></div></div>
              <div className="row" style={{ alignItems: "flex-start", gap: 10 }}><span className="icon-chip success" style={{ width: 36, height: 36 }}>🔁</span><div className="text-sm"><b><T en="Rebalance idle capacity" hi="निष्क्रिय क्षमता पुनर्संतुलन" /></b><div className="text-muted"><T en="60 idle workers in Bikaner — recommend temporary redeployment to Jaipur." hi="बीकानेर में 60 निष्क्रिय कार्यकर्ता — जयपुर में अस्थायी तैनाती।" /></div></div></div>
            </div>
          </div>

          <div className="dash-grid two mt-1">
            <div className="card panel"><div className="panel-head"><h3><T en="Service demand by category" hi="श्रेणी अनुसार मांग" /></h3><span className="pill pill-primary"><T en="Last 30 days" hi="पिछले 30 दिन" /></span></div><div className="chart-wrap"><BarChart data={demandCat} options={{ indexAxis: "y", scales: { x: { grid: gridOpt }, y: { grid: { display: false } } }, plugins: { legend: { display: false } } }} /></div></div>
            <div className="card panel"><div className="panel-head"><h3><T en="Workforce utilisation" hi="कार्यबल उपयोग" /></h3></div><div className="chart-wrap sm"><DoughnutChart data={util} options={{ cutout: "68%", plugins: { legend: { display: false } } }} /></div>
              <div className="between text-sm mt-2"><span className="row gap-sm"><span className="dot" style={{ color: "#0d9488" }} /> <T en="Deployed" hi="तैनात" /></span><span className="row gap-sm"><span className="dot" style={{ color: "#f59e0b" }} /> <T en="Available" hi="उपलब्ध" /></span><span className="row gap-sm"><span className="dot" style={{ color: "#2563eb" }} /> <T en="Leave/Training" hi="अवकाश" /></span></div>
            </div>
          </div>
        </View>

        {/* FORECASTING */}
        <View name="forecasting">
          <div className="card ai-card panel">
            <div className="row-top between wrap-flex">
              <div className="row gap-sm"><span className="ai-badge">{I.star} AI · ML Model</span><h3 style={{ fontFamily: "var(--font-display)" }}><T en="Federation demand forecast" hi="फेडरेशन मांग पूर्वानुमान" /></h3></div>
              <span className="pill pill-success"><span className="dot" /> 91% accuracy · SARIMA + LSTM</span>
            </div>
            <p className="text-muted text-sm mb-2"><T en="Actual vs. AI-forecast bookings, three-month horizon. Retrained nightly on booking, seasonal and festival signals." hi="वास्तविक बनाम AI-पूर्वानुमान बुकिंग, तीन माह। हर रात पुनः प्रशिक्षित।" /></p>
            <div className="chart-wrap" style={{ height: 320 }}><LineChart data={forecastData()} options={forecastOpts} /></div>
          </div>
          <div className="dash-grid two mt-1">
            <div className="card panel"><div className="panel-head"><h3><T en="Regional booking heat" hi="क्षेत्रीय बुकिंग" /></h3></div><div className="chart-wrap"><BarChart data={region} options={{ scales: { x: { grid: { display: false } }, y: { grid: gridOpt, ticks: { callback: (v) => Number(v) / 1000 + "k" } } }, plugins: { legend: { display: false } } }} /></div></div>
            <div className="card panel">
              <div className="panel-head"><h3><T en="AI recommendations" hi="AI सिफारिशें" /></h3></div>
              <ul className="check-list" style={{ marginTop: 4 }}>
                <li><span className="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></span><div><b>Pre-train 220 painters</b><span><T en="Before Diwali across Jaipur & Kota (+34% demand)." hi="दिवाली से पहले जयपुर व कोटा में।" /></span></div></li>
                <li><span className="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></span><div><b>90 plumbers on standby</b><span><T en="Udaipur monsoon cluster, weeks 28–34." hi="उदयपुर मानसून क्लस्टर।" /></span></div></li>
                <li><span className="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></span><div><b>Redeploy 60 from Bikaner</b><span><T en="Idle capacity → Jaipur high-demand zone." hi="निष्क्रिय क्षमता → जयपुर।" /></span></div></li>
              </ul>
              <ActionButton className="btn btn-primary btn-block mt-3" toast="AI recommendations pushed to societies"><T en="Push to societies" hi="समितियों को भेजें" /></ActionButton>
            </div>
          </div>
        </View>

        {/* ALLOCATION */}
        <View name="allocation"><AllocationTable /></View>
        {/* SOCIETIES */}
        <View name="societies"><SocietiesTable /></View>
        {/* WORKERS */}
        <View name="workers"><WorkersTable /></View>
        {/* BOOKINGS */}
        <View name="bookings"><BookingsTable /></View>

        {/* WELFARE */}
        <View name="welfare">
          <div className="kpi-grid">
            <Kpi chip="" icon={I.shield} val="₹1.2 Cr" en="Welfare fund balance" hi="कल्याण कोष शेष" />
            <Kpi chip="success" icon={I.star} val="11,980" en="Workers insured (₹5L cover)" hi="बीमित कार्यकर्ता" />
            <Kpi chip="amber" icon={I.doc} val="342" en="Claims this quarter" hi="इस तिमाही दावे" />
            <Kpi chip="info" icon={I.cal} val="18" en="Claims pending review" hi="लंबित दावे" />
          </div>
          <div className="dash-grid two mt-1">
            <div className="card panel">
              <div className="panel-head"><h3><T en="Fund health" hi="कोष स्वास्थ्य" /></h3></div>
              <div className="stack" style={{ gap: 18 }}>
                <div><div className="between text-sm mb-1"><span><T en="Fund utilisation" hi="कोष उपयोग" /></span><b>64%</b></div><div className="meter"><span style={{ width: "64%" }} /></div></div>
                <div><div className="between text-sm mb-1"><span><T en="Claims processed on time" hi="समय पर दावे" /></span><b>92%</b></div><div className="meter"><span style={{ width: "92%" }} /></div></div>
                <div><div className="between text-sm mb-1"><span><T en="Premium collection" hi="प्रीमियम संग्रह" /></span><b>88%</b></div><div className="meter"><span style={{ width: "88%" }} /></div></div>
              </div>
              <ActionButton className="btn btn-primary mt-3" toast="Contribution cycle triggered for 42 societies"><T en="Run contribution cycle" hi="योगदान चक्र चलाएँ" /></ActionButton>
            </div>
            <ClaimsTable />
          </div>
        </View>

        {/* REPORTS */}
        <View name="reports">
          <div className="grid grid-3">
            {reportCards.map((c) => (
              <div className="card card-hover" key={c.en}>
                <span className={"icon-chip " + c.chip}>{c.icon}</span>
                <h3 style={{ fontSize: "1.05rem", margin: "14px 0 6px" }}><T en={c.en} hi={c.hi} /></h3>
                <p className="text-muted text-sm">{c.desc}</p>
                <ActionButton className="btn btn-ghost btn-sm mt-2" toast={"Downloading " + c.file}>{c.label}</ActionButton>
              </div>
            ))}
          </div>
        </View>
      </DashboardShell>
    </>
  );
}
