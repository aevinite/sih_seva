"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import { T, useLang, useTheme, useToast } from "@/lib/providers";

/* ---------- helpers ---------- */
type Status = { kind: PillKind; en: string; hi: string; done?: boolean };
function useRows<T extends { id: string; status: Status }>(initial: T[]) {
  const [rows, setRows] = useState<T[]>(initial);
  const update = (id: string, status: Status) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: { ...status, done: true } } : r)));
  return { rows, update };
}
function filterRows<T extends object>(rows: T[], q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return rows;
  return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(s));
}
const star = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M12 2l3 6 7 .5-5 4.5 1.5 7L12 16l-6.5 4L7 13 2 8.5 9 8z" />
  </svg>
);
function Avatar({ i, c }: { i: string; c: string }) {
  return <span className="avatar" style={{ width: 34, height: 34, fontSize: ".8rem", background: c }}>{i}</span>;
}
const NavIcon = ({ d }: { d: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{d}</svg>
);

export default function AeviniteConsole() {
  const { toggle: toggleLang, lang } = useLang();
  const { toggle: toggleTheme, theme } = useTheme();
  const { show } = useToast();

  const nav: NavItem[] = [
    { view: "overview", en: "Command Center", hi: "कमांड सेंटर", title: "Command Center", icon: <NavIcon d={<><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>} /> },
    { view: "federations", en: "Federations", hi: "फेडरेशन", icon: <NavIcon d={<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />} /> },
    { view: "societies", en: "Societies", hi: "समितियाँ", title: "Cooperative Societies", icon: <NavIcon d={<path d="M3 21h18M4 21V10l5-3 5 3v11M14 21v-7l6-3v10" />} /> },
    { view: "workers", en: "Workers", hi: "कार्यकर्ता", icon: <NavIcon d={<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>} /> },
    { view: "customers", en: "Customers", hi: "ग्राहक", icon: <NavIcon d={<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0M17 11a3 3 0 1 0-1-5.8" /></>} /> },
    { view: "verifications", en: "Verifications", hi: "सत्यापन", title: "Verification Queue", icon: <NavIcon d={<><path d="M12 2.5 4.7 5.9v5.6c0 4.8 3.2 7.9 7.3 9.9 4.1-2 7.3-5.1 7.3-9.9V5.9z" /><path d="M8.5 12.3l2.6 2.6 4.7-5.2" /></>} /> },
    { view: "bookings", en: "Bookings", hi: "बुकिंग", icon: <NavIcon d={<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></>} /> },
    { view: "payments", en: "Payments", hi: "भुगतान", title: "Payments & Payouts", icon: <NavIcon d={<><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>} /> },
    { view: "welfare", en: "Welfare Fund", hi: "कल्याण कोष", title: "Welfare Fund", icon: <NavIcon d={<path d="M12 21s-7-4-7-10V5l7-2 7 2v6c0 6-7 10-7 10z" />} /> },
    { view: "reports", en: "Reports", hi: "रिपोर्ट", title: "Reports & Analytics", icon: <NavIcon d={<><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></>} /> },
    { view: "settings", en: "Settings", hi: "सेटिंग्स", title: "Settings", icon: <NavIcon d={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8M4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8" /></>} /> },
  ];
  const extraNav: ActionItem[] = [
    { en: "Logout", hi: "लॉगआउट", toast: "Signed out of Admin Console", icon: <NavIcon d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>} /> },
  ];

  const badge = (
    <div className="row" style={{ gap: 8, margin: "0 0 14px" }}>
      <span className="pill pill-primary hide-mobile"><span className="dot" /> <T en="Platform Admin · NCCT" hi="प्लेटफ़ॉर्म एडमिन · NCCT" /></span>
    </div>
  );

  const actions = (
    <>
      <select className="select" style={{ width: "auto" }} aria-label="Time range">
        <option>Last 30 days</option><option>This quarter</option><option>This year</option>
      </select>
      <ActionButton className="btn btn-primary btn-sm" toast="Platform report exported (CSV)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M8 11l4 4 4-4M4 21h16" /></svg>
        <T en="Export" hi="निर्यात" />
      </ActionButton>
    </>
  );

  return (
    <>
      {/* ===== slim top bar ===== */}
      <nav className="nav">
        <div className="wrap">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.5 4.7 5.9v5.6c0 4.8 3.2 7.9 7.3 9.9 4.1-2 7.3-5.1 7.3-9.9V5.9z" /><path d="M8.5 12.3l2.6 2.6 4.7-5.2" />
              </svg>
            </span>
            <span>AeviWork<small>Super Admin Console</small></span>
          </Link>
          <div className="nav-actions">
            <span className="pill pill-primary hide-mobile"><span className="dot" /> <T en="Platform Admin · NCCT" hi="प्लेटफ़ॉर्म एडमिन · NCCT" /></span>
            <button className="lang-toggle" onClick={toggleLang} aria-label="Language">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
              <span>{lang === "en" ? "हिं" : "EN"}</span>
            </button>
            <button className="icon-btn" onClick={toggleTheme} aria-label="Theme">
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
              )}
            </button>
            <Link href="/" className="btn btn-primary btn-sm"><T en="Exit" hi="बाहर" /></Link>
          </div>
        </div>
      </nav>

      <DashboardShell
        who={{ initials: "SA", name: "Super Admin", role: { en: "Platform Owner", hi: "प्लेटफ़ॉर्म स्वामी" }, color: "linear-gradient(135deg,#2dd4bf,#0d9488)", badge }}
        nav={nav}
        extraNav={extraNav}
        sideLabel={{ en: "System", hi: "सिस्टम" }}
        eyebrow={{ en: "Platform Super Admin", hi: "प्लेटफ़ॉर्म सुपर एडमिन" }}
        actions={actions}
      >
        <Overview show={show} />
        <Federations />
        <Societies />
        <Workers />
        <Customers />
        <Verifications />
        <Bookings />
        <Payments />
        <Welfare />
        <Reports />
        <Settings />
      </DashboardShell>
    </>
  );
}

/* ==================== OVERVIEW ==================== */
function Overview({ show }: { show: (m: string) => void }) {
  const bookings = {
    labels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [{ label: "Bookings", data: [9200, 10100, 12400, 15800, 13200, 14100, 16050, 17200, 18000, 18900, 20100, 21400], borderColor: PALETTE.teal, backgroundColor: "rgba(13,148,136,.12)", fill: true, tension: 0.38, borderWidth: 2.5, pointRadius: 0 }],
  };
  const states = {
    labels: ["Maharashtra", "Rajasthan", "Gujarat", "Tamil Nadu", "Kerala", "Others"],
    datasets: [{ data: [14220, 12540, 10910, 11760, 8140, 9970], backgroundColor: [PALETTE.teal, PALETTE.amber, PALETTE.blue, PALETTE.green, PALETTE.purple, "#94a3b8"], borderWidth: 0 }],
  };
  const kpis = [
    { ic: <NavIcon d={<path d="M3 21h18M5 21V7l7-4 7 4v14" />} />, cls: "", v: "28", en: "Federations", hi: "फेडरेशन", tr: "▲ 3" },
    { ic: <NavIcon d={<path d="M4 21V10l5-3 5 3v11" />} />, cls: "info", v: "340", en: "Societies", hi: "समितियाँ", tr: "▲ 4.2%" },
    { ic: <NavIcon d={<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>} />, cls: "amber", v: "12,540", en: "Verified workers", hi: "सत्यापित कार्यकर्ता", tr: "▲ 6.1%" },
    { ic: <NavIcon d={<><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>} />, cls: "success", v: "₹42 Cr", en: "GMV paid to workers", hi: "कार्यकर्ताओं को भुगतान", tr: "▲ 9%" },
  ];
  return (
    <View name="overview">
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="card kpi" key={k.en}>
            <div className="top"><span className={"icon-chip " + k.cls}>{k.ic}</span><span className="trend up">{k.tr}</span></div>
            <div className="val tnum">{k.v}</div>
            <div className="lbl"><T en={k.en} hi={k.hi} /></div>
          </div>
        ))}
      </div>
      <div className="dash-grid two">
        <div className="card panel">
          <div className="panel-head"><h3><T en="Platform bookings (12 months)" hi="प्लेटफ़ॉर्म बुकिंग (12 माह)" /></h3><span className="pill pill-success"><span className="dot" /> Live</span></div>
          <div className="chart-wrap"><LineChart data={bookings} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: PALETTE.grid }, beginAtZero: true } } }} /></div>
        </div>
        <div className="card panel">
          <div className="panel-head"><h3><T en="Workers by state" hi="राज्यवार कार्यकर्ता" /></h3></div>
          <div className="chart-wrap sm"><DoughnutChart data={states} /></div>
        </div>
      </div>
      <div className="card ai-card panel mt-3">
        <div className="row-top"><span className="ai-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 5 5 .5-4 3.5 1.5 5L12 18l-4.5 3 1.5-5-4-3.5 5-.5z" /></svg> AI · Network Insight</span></div>
        <p className="fw-600"><T en="Demand across the network is projected to rise 18% next quarter, led by Rajasthan and Gujarat federations." hi="अगली तिमाही में नेटवर्क भर में मांग 18% बढ़ने का अनुमान है, राजस्थान और गुजरात फेडरेशन में सबसे अधिक।" /></p>
        <p className="text-muted text-sm mt-1"><T en="Recommend onboarding 1,200 workers and pre-scheduling skill certification drives in 6 high-growth districts." hi="6 उच्च-वृद्धि जिलों में 1,200 कार्यकर्ताओं को जोड़ने और कौशल प्रमाणन अभियान की सिफारिश।" /></p>
        <button className="btn btn-primary btn-sm mt-2" onClick={() => show("Onboarding plan queued for federations")}><T en="Apply recommendation" hi="सिफारिश लागू करें" /></button>
      </div>
    </View>
  );
}

/* ==================== FEDERATIONS ==================== */
type Fed = { id: string; name: string; state: string; soc: number; wk: string; bk: string; status: Status };
function Federations() {
  const { rows, update } = useRows<Fed>([
    { id: "f1", name: "Rajasthan SLCF", state: "Rajasthan", soc: 42, wk: "12,540", bk: "18,320", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
    { id: "f2", name: "Gujarat SLCF", state: "Gujarat", soc: 38, wk: "10,910", bk: "15,880", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
    { id: "f3", name: "Maharashtra SLCF", state: "Maharashtra", soc: 51, wk: "14,220", bk: "21,040", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
    { id: "f4", name: "Kerala SLCF", state: "Kerala", soc: 29, wk: "8,140", bk: "12,610", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
    { id: "f5", name: "Tamil Nadu SLCF", state: "Tamil Nadu", soc: 44, wk: "11,760", bk: "17,300", status: { kind: "warning", en: "Onboarding", hi: "ऑनबोर्डिंग" } },
    { id: "f6", name: "Punjab SLCF", state: "Punjab", soc: 22, wk: "6,050", bk: "8,920", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
  ]);
  const [q, setQ] = useState("");
  const list = useMemo(() => filterRows(rows, q), [rows, q]);
  return (
    <View name="federations">
      <div className="card panel">
        <div className="panel-head"><h3><T en="State Federations" hi="राज्य फेडरेशन" /></h3><PanelSearch value={q} onChange={setQ} placeholder="Search federations…" /></div>
        <div className="table-wrap"><table className="data"><thead><tr><th>Federation</th><th>State</th><th>Societies</th><th>Workers</th><th>Bookings</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{list.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td><td>{r.state}</td><td className="tnum">{r.soc}</td><td className="tnum">{r.wk}</td><td className="tnum">{r.bk}</td>
              <td><StatusPill kind={r.status.kind}><T en={r.status.en} hi={r.status.hi} /></StatusPill></td>
              <td><div className="row-actions">
                {r.status.done ? null : r.status.kind === "warning" ? (
                  <ActionButton className="btn btn-primary btn-sm" toast="Federation activated" onClick={() => update(r.id, { kind: "success", en: "Active", hi: "सक्रिय" })}>Activate</ActionButton>
                ) : (
                  <>
                    <ActionButton toast="Opening federation">View</ActionButton>
                    <ActionButton toast="Federation suspended" onClick={() => update(r.id, { kind: "warning", en: "Suspended", hi: "निलंबित" })}>Suspend</ActionButton>
                  </>
                )}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </View>
  );
}

/* ==================== SOCIETIES ==================== */
type Soc = { id: string; name: string; district: string; wk: number; rating: string; status: Status };
function Societies() {
  const { rows, update } = useRows<Soc>([
    { id: "s1", name: "Jaipur Labour Co-op", district: "Jaipur", wk: 640, rating: "4.9", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
    { id: "s2", name: "Kota Skilled Workers", district: "Kota", wk: 410, rating: "4.7", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
    { id: "s3", name: "Udaipur Services Co-op", district: "Udaipur", wk: 380, rating: "4.8", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
    { id: "s4", name: "Jodhpur Artisans Co-op", district: "Jodhpur", wk: 295, rating: "4.6", status: { kind: "warning", en: "Review", hi: "समीक्षा" } },
    { id: "s5", name: "Bikaner Workers Union Co-op", district: "Bikaner", wk: 210, rating: "4.5", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
  ]);
  const [q, setQ] = useState("");
  const list = useMemo(() => filterRows(rows, q), [rows, q]);
  return (
    <View name="societies">
      <div className="card panel">
        <div className="panel-head"><h3><T en="Cooperative Societies" hi="सहकारी समितियाँ" /></h3><PanelSearch value={q} onChange={setQ} placeholder="Search societies…" /></div>
        <div className="table-wrap"><table className="data"><thead><tr><th>Society</th><th>District</th><th>Workers</th><th>Rating</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{list.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td><td>{r.district}</td><td className="tnum">{r.wk}</td>
              <td><span className="rating">{star}{r.rating}</span></td>
              <td><StatusPill kind={r.status.kind}><T en={r.status.en} hi={r.status.hi} /></StatusPill></td>
              <td><div className="row-actions">
                {r.status.done ? null : r.status.kind === "warning" ? (
                  <ActionButton className="btn btn-primary btn-sm" toast="Society approved" onClick={() => update(r.id, { kind: "success", en: "Active", hi: "सक्रिय" })}>Approve</ActionButton>
                ) : (
                  <>
                    <ActionButton toast="Opening society">View</ActionButton>
                    <ActionButton toast="Society suspended" onClick={() => update(r.id, { kind: "warning", en: "Suspended", hi: "निलंबित" })}>Suspend</ActionButton>
                  </>
                )}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </View>
  );
}

/* ==================== WORKERS ==================== */
type Wk = { id: string; i: string; c: string; name: string; skill: string; soc: string; rating: string; status: Status };
function Workers() {
  const { rows, update } = useRows<Wk>([
    { id: "w1", i: "RS", c: "linear-gradient(135deg,#2dd4bf,#0d9488)", name: "Ramesh Solanki", skill: "Electrician", soc: "Jaipur Labour Co-op", rating: "4.9", status: { kind: "success", en: "Verified", hi: "सत्यापित" } },
    { id: "w2", i: "PK", c: "linear-gradient(135deg,#fbbf24,#f59e0b)", name: "Priya Kumari", skill: "Caregiver", soc: "Kota Skilled Workers", rating: "5.0", status: { kind: "success", en: "Verified", hi: "सत्यापित" } },
    { id: "w3", i: "AV", c: "linear-gradient(135deg,#60a5fa,#2563eb)", name: "Anil Verma", skill: "Plumber", soc: "Udaipur Services Co-op", rating: "4.7", status: { kind: "warning", en: "Pending KYC", hi: "KYC लंबित" } },
    { id: "w4", i: "SN", c: "linear-gradient(135deg,#34d399,#059669)", name: "Suresh Nair", skill: "Carpenter", soc: "Jaipur Labour Co-op", rating: "4.8", status: { kind: "success", en: "Verified", hi: "सत्यापित" } },
    { id: "w5", i: "MD", c: "linear-gradient(135deg,#f472b6,#db2777)", name: "Meena Devi", skill: "Cleaner", soc: "Bikaner Workers Co-op", rating: "4.6", status: { kind: "warning", en: "Pending KYC", hi: "KYC लंबित" } },
    { id: "w6", i: "GK", c: "linear-gradient(135deg,#a78bfa,#7c3aed)", name: "Gopal Kumar", skill: "Painter", soc: "Jodhpur Artisans Co-op", rating: "4.7", status: { kind: "success", en: "Verified", hi: "सत्यापित" } },
  ]);
  const [q, setQ] = useState("");
  const list = useMemo(() => filterRows(rows, q), [rows, q]);
  return (
    <View name="workers">
      <div className="card panel">
        <div className="panel-head"><h3><T en="Workers directory" hi="कार्यकर्ता निर्देशिका" /></h3><PanelSearch value={q} onChange={setQ} placeholder="Search workers…" /></div>
        <div className="table-wrap"><table className="data"><thead><tr><th>Worker</th><th>Skill</th><th>Society</th><th>Rating</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{list.map((r) => (
            <tr key={r.id}>
              <td><div className="td-user"><Avatar i={r.i} c={r.c} /> {r.name}</div></td>
              <td>{r.skill}</td><td>{r.soc}</td>
              <td><span className="rating">{star}{r.rating}</span></td>
              <td><StatusPill kind={r.status.kind}><T en={r.status.en} hi={r.status.hi} /></StatusPill></td>
              <td><div className="row-actions">
                {r.status.done ? null : r.status.kind === "warning" ? (
                  <ActionButton className="btn btn-primary btn-sm" toast="Worker verified" onClick={() => update(r.id, { kind: "success", en: "Verified", hi: "सत्यापित" })}>Verify</ActionButton>
                ) : (
                  <ActionButton toast="Worker suspended" onClick={() => update(r.id, { kind: "warning", en: "Suspended", hi: "निलंबित" })}>Suspend</ActionButton>
                )}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </View>
  );
}

/* ==================== CUSTOMERS ==================== */
type Cust = { id: string; i: string; c: string; name: string; city: string; bk: number; spent: string; status: Status };
function Customers() {
  const { rows, update } = useRows<Cust>([
    { id: "c1", i: "AN", c: "linear-gradient(135deg,#2dd4bf,#0d9488)", name: "Aarav Nair", city: "Kochi", bk: 37, spent: "₹48,200", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
    { id: "c2", i: "SM", c: "linear-gradient(135deg,#fbbf24,#f59e0b)", name: "Sunita Mehta", city: "Pune", bk: 21, spent: "₹27,900", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
    { id: "c3", i: "RK", c: "linear-gradient(135deg,#60a5fa,#2563eb)", name: "Rahul Kapoor", city: "Jaipur", bk: 14, spent: "₹18,300", status: { kind: "warning", en: "Flagged", hi: "चिह्नित" } },
    { id: "c4", i: "IJ", c: "linear-gradient(135deg,#34d399,#059669)", name: "Isha Jain", city: "Udaipur", bk: 9, spent: "₹11,050", status: { kind: "success", en: "Active", hi: "सक्रिय" } },
  ]);
  const [q, setQ] = useState("");
  const list = useMemo(() => filterRows(rows, q), [rows, q]);
  return (
    <View name="customers">
      <div className="card panel">
        <div className="panel-head"><h3><T en="Customers" hi="ग्राहक" /></h3><PanelSearch value={q} onChange={setQ} placeholder="Search customers…" /></div>
        <div className="table-wrap"><table className="data"><thead><tr><th>Customer</th><th>City</th><th>Bookings</th><th>Spent</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{list.map((r) => (
            <tr key={r.id}>
              <td><div className="td-user"><Avatar i={r.i} c={r.c} /> {r.name}</div></td>
              <td>{r.city}</td><td className="tnum">{r.bk}</td><td className="tnum">{r.spent}</td>
              <td><StatusPill kind={r.status.kind}><T en={r.status.en} hi={r.status.hi} /></StatusPill></td>
              <td><div className="row-actions">
                <ActionButton toast="Customer profile">View</ActionButton>
                {r.status.kind === "warning" && !r.status.done && (
                  <ActionButton toast="Customer blocked" onClick={() => update(r.id, { kind: "danger", en: "Blocked", hi: "अवरुद्ध" })}>Block</ActionButton>
                )}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </View>
  );
}

/* ==================== VERIFICATIONS ==================== */
type Ver = { id: string; i: string; c: string; name: string; skill: string; docs: string; ai: PillKind; aiLabel: string; status: Status };
function Verifications() {
  const { rows, update } = useRows<Ver>([
    { id: "v1", i: "AV", c: "linear-gradient(135deg,#60a5fa,#2563eb)", name: "Anil Verma", skill: "Plumber", docs: "Aadhaar, Photo, Cert", ai: "success", aiLabel: "Pass", status: { kind: "warning", en: "Pending", hi: "लंबित" } },
    { id: "v2", i: "MD", c: "linear-gradient(135deg,#f472b6,#db2777)", name: "Meena Devi", skill: "Cleaner", docs: "Aadhaar, Photo", ai: "warning", aiLabel: "Review", status: { kind: "warning", en: "Pending", hi: "लंबित" } },
    { id: "v3", i: "TS", c: "linear-gradient(135deg,#a78bfa,#7c3aed)", name: "Tarun Singh", skill: "Driver", docs: "Aadhaar, Photo, License", ai: "success", aiLabel: "Pass", status: { kind: "warning", en: "Pending", hi: "लंबित" } },
    { id: "v4", i: "LP", c: "linear-gradient(135deg,#34d399,#059669)", name: "Lata Prasad", skill: "Caregiver", docs: "Aadhaar, Photo, Cert", ai: "success", aiLabel: "Pass", status: { kind: "warning", en: "Pending", hi: "लंबित" } },
  ]);
  return (
    <View name="verifications">
      <div className="card ai-card panel mb-3">
        <div className="row-top"><span className="ai-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.5 4.7 5.9v5.6c0 4.8 3.2 7.9 7.3 9.9 4.1-2 7.3-5.1 7.3-9.9V5.9z" /></svg> KYC Queue</span></div>
        <p className="fw-600"><T en="18 worker verifications pending review. AI pre-check has flagged 2 for manual attention." hi="18 कार्यकर्ता सत्यापन समीक्षा हेतु लंबित। AI ने 2 को मैनुअल जांच हेतु चिह्नित किया।" /></p>
      </div>
      <div className="card panel">
        <div className="panel-head"><h3><T en="Verification queue" hi="सत्यापन कतार" /></h3></div>
        <div className="table-wrap"><table className="data"><thead><tr><th>Applicant</th><th>Skill</th><th>Documents</th><th>AI Check</th><th>Status</th><th>Decision</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}>
              <td><div className="td-user"><Avatar i={r.i} c={r.c} /> {r.name}</div></td>
              <td>{r.skill}</td><td>{r.docs}</td>
              <td><span className={"pill pill-" + r.ai}><span className="dot" /> {r.aiLabel}</span></td>
              <td><StatusPill kind={r.status.kind}><T en={r.status.en} hi={r.status.hi} /></StatusPill></td>
              <td><div className="row-actions">
                {r.status.done ? null : (
                  <>
                    <ActionButton className="btn btn-primary btn-sm" toast="Application approved" onClick={() => update(r.id, { kind: "success", en: "Approved", hi: "स्वीकृत" })}>Approve</ActionButton>
                    <ActionButton toast="Application rejected" onClick={() => update(r.id, { kind: "danger", en: "Rejected", hi: "अस्वीकृत" })}>Reject</ActionButton>
                  </>
                )}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </View>
  );
}

/* ==================== BOOKINGS ==================== */
type Bk = { id: string; cust: string; svc: string; soc: string; status: Status; amt: string };
function Bookings() {
  const rows: Bk[] = [
    { id: "#AW-90142", cust: "Aarav Nair", svc: "Electrician", soc: "Jaipur Labour Co-op", status: { kind: "success", en: "Completed", hi: "पूर्ण" }, amt: "₹529" },
    { id: "#AW-90143", cust: "Sunita Mehta", svc: "Plumber", soc: "Udaipur Services Co-op", status: { kind: "warning", en: "In progress", hi: "प्रगति में" }, amt: "₹349" },
    { id: "#AW-90144", cust: "Rahul Kapoor", svc: "Caregiver", soc: "Kota Skilled Workers", status: { kind: "info", en: "Confirmed", hi: "पुष्ट" }, amt: "₹799" },
    { id: "#AW-90145", cust: "Isha Jain", svc: "Cleaner", soc: "Bikaner Workers Co-op", status: { kind: "success", en: "Completed", hi: "पूर्ण" }, amt: "₹299" },
    { id: "#AW-90146", cust: "Aarav Nair", svc: "Carpenter", soc: "Jaipur Labour Co-op", status: { kind: "danger", en: "Cancelled", hi: "रद्द" }, amt: "₹0" },
    { id: "#AW-90147", cust: "Sunita Mehta", svc: "Painter", soc: "Jodhpur Artisans Co-op", status: { kind: "info", en: "Confirmed", hi: "पुष्ट" }, amt: "₹1,299" },
  ];
  const [q, setQ] = useState("");
  const list = useMemo(() => filterRows(rows, q), [rows, q]);
  return (
    <View name="bookings">
      <div className="card panel">
        <div className="panel-head"><h3><T en="All bookings" hi="सभी बुकिंग" /></h3><PanelSearch value={q} onChange={setQ} placeholder="Search bookings…" /></div>
        <div className="table-wrap"><table className="data"><thead><tr><th>Booking</th><th>Customer</th><th>Service</th><th>Society</th><th>Status</th><th>Amount</th></tr></thead>
          <tbody>{list.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.cust}</td><td>{r.svc}</td><td>{r.soc}</td>
              <td><StatusPill kind={r.status.kind}><T en={r.status.en} hi={r.status.hi} /></StatusPill></td>
              <td className="tnum">{r.amt}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </View>
  );
}

/* ==================== PAYMENTS ==================== */
type Stl = { id: string; soc: string; bk: string; amt: string; status: Status };
function Payments() {
  const kpis = [
    { en: "Processed this month", hi: "इस माह संसाधित", v: "₹3.42 Cr" },
    { en: "Worker payouts", hi: "कार्यकर्ता भुगतान", v: "₹3.14 Cr" },
    { en: "Platform fee (8%)", hi: "प्लेटफ़ॉर्म शुल्क (8%)", v: "₹27.4 L" },
    { en: "Pending settlements", hi: "लंबित निपटान", v: "₹6.1 L" },
  ];
  const { rows, update } = useRows<Stl>([
    { id: "#STL-4471", soc: "Jaipur Labour Co-op", bk: "1,204", amt: "₹8,42,000", status: { kind: "warning", en: "Pending", hi: "लंबित" } },
    { id: "#STL-4472", soc: "Udaipur Services Co-op", bk: "860", amt: "₹5,90,000", status: { kind: "warning", en: "Pending", hi: "लंबित" } },
    { id: "#STL-4470", soc: "Kota Skilled Workers", bk: "742", amt: "₹4,88,000", status: { kind: "success", en: "Settled", hi: "निपटाया" } },
  ]);
  return (
    <View name="payments">
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="card kpi" key={k.en}><div className="lbl"><T en={k.en} hi={k.hi} /></div><div className="val tnum mt-1">{k.v}</div></div>
        ))}
      </div>
      <div className="card panel">
        <div className="panel-head"><h3><T en="Settlements to societies" hi="समितियों को निपटान" /></h3></div>
        <div className="table-wrap"><table className="data"><thead><tr><th>Batch</th><th>Society</th><th>Bookings</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.soc}</td><td className="tnum">{r.bk}</td><td className="tnum">{r.amt}</td>
              <td><StatusPill kind={r.status.kind}><T en={r.status.en} hi={r.status.hi} /></StatusPill></td>
              <td>{r.status.kind === "warning" && !r.status.done ? (
                <ActionButton className="btn btn-primary btn-sm" toast="Settlement released" onClick={() => update(r.id, { kind: "success", en: "Released", hi: "जारी" })}>Release</ActionButton>
              ) : (
                <ActionButton toast="Downloading receipt">Receipt</ActionButton>
              )}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </View>
  );
}

/* ==================== WELFARE ==================== */
type Claim = { id: string; wk: string; type: string; amt: string; status: Status };
function Welfare() {
  const { rows, update } = useRows<Claim>([
    { id: "#CLM-771", wk: "Ramesh Solanki", type: "Accident", amt: "₹42,000", status: { kind: "warning", en: "Pending", hi: "लंबित" } },
    { id: "#CLM-772", wk: "Meena Devi", type: "Health", amt: "₹18,500", status: { kind: "warning", en: "Pending", hi: "लंबित" } },
  ]);
  const covers = [
    { en: "12,540 workers insured", hi: "12,540 कार्यकर्ता बीमित", den: "₹5 lakh accident cover each", dhi: "प्रत्येक को ₹5 लाख दुर्घटना कवर" },
    { en: "Health benefits active", hi: "स्वास्थ्य लाभ सक्रिय", den: "Family cover for enrolled members", dhi: "नामांकित सदस्यों हेतु परिवार कवर" },
    { en: "Premiums paid by cooperatives", hi: "प्रीमियम सहकारी द्वारा भुगतान", den: "Zero cost to the worker", dhi: "कार्यकर्ता पर शून्य लागत" },
  ];
  return (
    <View name="welfare">
      <div className="dash-grid two">
        <div className="card panel">
          <div className="panel-head"><h3><T en="Welfare fund" hi="कल्याण कोष" /></h3><span className="pill pill-success"><span className="dot" /> Healthy</span></div>
          <div className="val tnum" style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700 }}>₹1.24 Cr</div>
          <p className="text-muted text-sm mb-2"><T en="Total corpus across federations" hi="फेडरेशनों में कुल कोष" /></p>
          <div className="text-sm between mb-1"><span><T en="Fund utilisation" hi="कोष उपयोग" /></span><b>62%</b></div>
          <div className="meter"><span style={{ width: "62%" }} /></div>
          <div className="text-sm between mb-1 mt-3"><span><T en="Claims processed" hi="दावे संसाधित" /></span><b>88%</b></div>
          <div className="meter"><span style={{ width: "88%" }} /></div>
        </div>
        <div className="card panel">
          <div className="panel-head"><h3><T en="Insurance coverage" hi="बीमा कवरेज" /></h3></div>
          <ul className="check-list" style={{ marginTop: 0 }}>
            {covers.map((c) => (
              <li key={c.en}>
                <span className="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></span>
                <div><b><T en={c.en} hi={c.hi} /></b><span><T en={c.den} hi={c.dhi} /></span></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card panel mt-3">
        <div className="panel-head"><h3><T en="Recent welfare claims" hi="हाल के कल्याण दावे" /></h3></div>
        <div className="table-wrap"><table className="data"><thead><tr><th>Claim</th><th>Worker</th><th>Type</th><th>Amount</th><th>Status</th><th>Decision</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.wk}</td><td>{r.type}</td><td className="tnum">{r.amt}</td>
              <td><StatusPill kind={r.status.kind}><T en={r.status.en} hi={r.status.hi} /></StatusPill></td>
              <td><div className="row-actions">
                {r.status.done ? null : (
                  <>
                    <ActionButton className="btn btn-primary btn-sm" toast="Claim approved" onClick={() => update(r.id, { kind: "success", en: "Approved", hi: "स्वीकृत" })}>Approve</ActionButton>
                    <ActionButton toast="Claim rejected" onClick={() => update(r.id, { kind: "danger", en: "Rejected", hi: "अस्वीकृत" })}>Reject</ActionButton>
                  </>
                )}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </View>
  );
}

/* ==================== REPORTS ==================== */
function Reports() {
  const revenue = {
    labels: ["Electrical", "Plumbing", "Cleaning", "Carpentry", "Painting", "Caregiving", "Driving"],
    datasets: [{ label: "Revenue (₹ L)", data: [78, 64, 92, 41, 55, 48, 33], backgroundColor: PALETTE.teal, borderRadius: 6, maxBarThickness: 40 }],
  };
  const cards = [
    { cls: "", en: "Network growth report", hi: "नेटवर्क वृद्धि रिपोर्ट", den: "Workers, societies & GMV trends.", dhi: "कार्यकर्ता, समितियाँ व GMV रुझान।", ic: <><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></>, toast: "Report downloaded (PDF)" },
    { cls: "info", en: "Financial settlement report", hi: "वित्तीय निपटान रिपोर्ट", den: "Payouts, fees & taxes.", dhi: "भुगतान, शुल्क व कर।", ic: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>, toast: "Report downloaded (XLSX)" },
    { cls: "success", en: "Welfare & insurance report", hi: "कल्याण व बीमा रिपोर्ट", den: "Coverage & claims summary.", dhi: "कवरेज व दावों का सारांश।", ic: <path d="M12 21s-7-4-7-10V5l7-2 7 2v6c0 6-7 10-7 10z" />, toast: "Report downloaded (PDF)" },
  ];
  return (
    <View name="reports">
      <div className="grid grid-3">
        {cards.map((c) => (
          <div className="card card-hover" key={c.en}>
            <span className={"icon-chip " + c.cls}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{c.ic}</svg></span>
            <h3 className="mt-2" style={{ fontSize: "1.05rem" }}><T en={c.en} hi={c.hi} /></h3>
            <p className="text-muted text-sm mt-1"><T en={c.den} hi={c.dhi} /></p>
            <ActionButton className="btn btn-ghost btn-sm mt-2" toast={c.toast}>Download</ActionButton>
          </div>
        ))}
      </div>
      <div className="card panel mt-3">
        <div className="panel-head"><h3><T en="Category revenue split" hi="श्रेणीवार राजस्व" /></h3></div>
        <div className="chart-wrap"><BarChart data={revenue} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: PALETTE.grid }, beginAtZero: true } } }} /></div>
      </div>
    </View>
  );
}

/* ==================== SETTINGS ==================== */
function Settings() {
  const { show } = useToast();
  const fields = [
    { en: "Platform commission (%)", hi: "प्लेटफ़ॉर्म कमीशन (%)", v: 8, span: false },
    { en: "Min. worker wage share (%)", hi: "न्यूनतम कार्यकर्ता वेतन हिस्सा (%)", v: 90, span: false },
    { en: "GST rate (%)", hi: "GST दर (%)", v: 18, span: false },
    { en: "Emergency surcharge (₹)", hi: "आपातकालीन अधिभार (₹)", v: 150, span: false },
  ];
  return (
    <View name="settings">
      <div className="card panel" style={{ maxWidth: 640 }}>
        <div className="panel-head"><h3><T en="Platform settings" hi="प्लेटफ़ॉर्म सेटिंग्स" /></h3></div>
        <form onSubmit={(e) => { e.preventDefault(); show("Settings saved"); }}>
          <div className="form-grid two">
            {fields.map((f) => (
              <div className="field" key={f.en}>
                <label><T en={f.en} hi={f.hi} /></label>
                <input className="input" type="number" defaultValue={f.v} />
              </div>
            ))}
            <div className="field col-span-2">
              <label><T en="Default support helpline" hi="डिफ़ॉल्ट सहायता हेल्पलाइन" /></label>
              <input className="input" type="text" defaultValue="1800-11-SAHKAR" />
            </div>
          </div>
          <button className="btn btn-primary mt-3" type="submit"><T en="Save settings" hi="सेटिंग्स सहेजें" /></button>
        </form>
      </div>
    </View>
  );
}
