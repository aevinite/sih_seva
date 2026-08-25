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
  type PillKind,
} from "@/components/dash/Dashboard";
import { LineChart, BarChart, DoughnutChart, PALETTE } from "@/components/charts/Charts";
import { T, useToast } from "@/lib/providers";

/* ---- nav icons ---- */
const I = {
  overview: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>),
  requests: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></svg>),
  schedule: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>),
  earnings: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>),
  welfare: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /><path d="M9 12l2 2 4-4" /></svg>),
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

/* ================= REQUESTS (interactive) ================= */
type Req = { id: number; ic: string; cls: string; job: string; cust: string; loc: string; dist: string; when: string; time: string; payout: string; urgent?: boolean; status: { kind: PillKind; en: string; hi: string } | null; decided?: boolean };
const initialReqs: Req[] = [
  { id: 1, ic: "⚡", cls: "", job: "Wiring repair", cust: "Sunita Mehta", loc: "Sector 12, Gandhinagar", dist: "1.2 km away", when: "Today", time: "02:00 PM", payout: "₹640", status: { kind: "info", en: "New", hi: "नया" } },
  { id: 2, ic: "🔌", cls: "amber", job: "Switchboard fitting", cust: "Amit Trivedi", loc: "Kudasan, Gandhinagar", dist: "3.4 km away", when: "Tomorrow", time: "10:00 AM", payout: "₹520", status: { kind: "info", en: "New", hi: "नया" } },
  { id: 3, ic: "💡", cls: "info", job: "Fan & light install", cust: "Reena Shah", loc: "Infocity, Gandhinagar", dist: "2.1 km away", when: "Wed, 28 Aug", time: "04:30 PM", payout: "₹380", status: { kind: "info", en: "New", hi: "नया" } },
  { id: 4, ic: "🚨", cls: "", job: "Power fault", cust: "Vikram Joshi", loc: "Raysan, Gandhinagar", dist: "0.9 km away", when: "Now", time: "On-demand", payout: "₹790", urgent: true, status: { kind: "warning", en: "Urgent", hi: "तत्काल" } },
  { id: 5, ic: "🏠", cls: "success", job: "Full-home rewiring", cust: "Meena Patel", loc: "Sargasan, Gandhinagar", dist: "4.0 km away", when: "Fri, 30 Aug", time: "09:00 AM", payout: "₹2,450", status: { kind: "info", en: "New", hi: "नया" } },
];

function RequestsView() {
  const [rows, setRows] = useState(initialReqs);
  const [q, setQ] = useState("");
  const { show } = useToast();
  const filtered = useMemo(
    () => rows.filter((r) => (r.job + r.cust + r.loc).toLowerCase().includes(q.toLowerCase())),
    [rows, q]
  );
  const decide = (id: number, accept: boolean) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, decided: true, status: accept ? { kind: "success", en: "Accepted", hi: "स्वीकृत" } : { kind: "danger", en: "Declined", hi: "अस्वीकृत" } } : r)));
    show(accept ? "Job accepted — customer notified" : "Job declined");
  };
  return (
    <div className="card panel">
      <div className="panel-head">
        <h3><T en="New job requests near you" hi="आपके पास नए कार्य अनुरोध" /></h3>
        <PanelSearch value={q} onChange={setQ} placeholder="Search jobs…" />
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr>
            <th><T en="Service" hi="सेवा" /></th><th><T en="Location & Distance" hi="स्थान व दूरी" /></th>
            <th><T en="Schedule" hi="समय" /></th><th><T en="Payout" hi="भुगतान" /></th>
            <th><T en="Status" hi="स्थिति" /></th><th><T en="Action" hi="कार्रवाई" /></th>
          </tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td><div className="td-user"><span className={"icon-chip " + r.cls} style={{ width: 34, height: 34, borderRadius: 9 }}>{r.ic}</span><div><b>{r.job} {r.urgent && <span className="pill pill-danger" style={{ marginLeft: 4 }}>Emergency</span>}</b><div className="text-muted text-xs">{r.cust}</div></div></div></td>
                <td>{r.loc}<div className="text-muted text-xs">{r.dist}</div></td>
                <td>{r.when}<div className="text-muted text-xs">{r.time}</div></td>
                <td><b className="tnum">{r.payout}</b></td>
                <td>{r.status && <StatusPill kind={r.status.kind}><T en={r.status.en} hi={r.status.hi} /></StatusPill>}</td>
                <td><div className="row-actions">
                  <button className="btn btn-primary btn-sm" disabled={r.decided} style={r.decided ? { opacity: .45, pointerEvents: "none" } : undefined} onClick={() => decide(r.id, true)}><T en="Accept" hi="स्वीकारें" /></button>
                  <button className="btn btn-ghost btn-sm" disabled={r.decided} style={r.decided ? { opacity: .45, pointerEvents: "none" } : undefined} onClick={() => decide(r.id, false)}><T en="Decline" hi="अस्वीकारें" /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= SCHEDULE (interactive) ================= */
type Job = { id: number; day: string; time: string; ci: string; cc: string; cust: string; svc: string; addr: string; done?: boolean };
const initialJobs: Job[] = [
  { id: 1, day: "Today", time: "02:00 PM", ci: "SM", cc: "linear-gradient(135deg,#2dd4bf,#0d9488)", cust: "Sunita Mehta", svc: "Wiring repair", addr: "Sector 12, Gandhinagar" },
  { id: 2, day: "Tomorrow", time: "10:00 AM", ci: "AT", cc: "linear-gradient(135deg,#60a5fa,#2563eb)", cust: "Amit Trivedi", svc: "Switchboard fitting", addr: "Kudasan, Gandhinagar" },
  { id: 3, day: "Wed, 28 Aug", time: "04:30 PM", ci: "RS", cc: "linear-gradient(135deg,#fbbf24,#f59e0b)", cust: "Reena Shah", svc: "Fan & light install", addr: "Infocity, Gandhinagar" },
  { id: 4, day: "Fri, 30 Aug", time: "09:00 AM", ci: "MP", cc: "linear-gradient(135deg,#a78bfa,#7c3aed)", cust: "Meena Patel", svc: "Full-home rewiring", addr: "Sargasan, Gandhinagar" },
];
function ScheduleView() {
  const [jobs, setJobs] = useState(initialJobs);
  const { show } = useToast();
  const complete = (id: number) => { setJobs((js) => js.map((j) => (j.id === id ? { ...j, done: true } : j))); show("Marked as completed — payment released"); };
  return (
    <div className="card panel">
      <div className="panel-head"><h3><T en="Upcoming confirmed jobs" hi="आगामी पुष्ट कार्य" /></h3><span className="pill pill-primary">{jobs.filter((j) => !j.done).length} <T en="scheduled" hi="निर्धारित" /></span></div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th><T en="Time" hi="समय" /></th><th><T en="Customer" hi="ग्राहक" /></th><th><T en="Service & Address" hi="सेवा व पता" /></th><th><T en="Status" hi="स्थिति" /></th><th><T en="Action" hi="कार्रवाई" /></th></tr></thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td><b>{j.day}</b><div className="text-muted text-xs">{j.time}</div></td>
                <td><div className="td-user"><span className="avatar" style={{ width: 32, height: 32, fontSize: ".75rem", background: j.cc }}>{j.ci}</span>{j.cust}</div></td>
                <td>{j.svc}<div className="text-muted text-xs">{j.addr}</div></td>
                <td>{j.done ? <StatusPill kind="success">Completed</StatusPill> : <StatusPill kind="info">Confirmed</StatusPill>}</td>
                <td><button className="btn btn-primary btn-sm" disabled={j.done} style={j.done ? { opacity: .45, pointerEvents: "none" } : undefined} onClick={() => complete(j.id)}><T en="Mark complete" hi="पूर्ण करें" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= CERTIFICATES form ================= */
function AddCertForm() {
  const { show } = useToast();
  return (
    <form className="stack" style={{ gap: 16 }} onSubmit={(e) => { e.preventDefault(); show("Certificate submitted for verification"); }}>
      <div className="field"><label><T en="Certificate name" hi="प्रमाणपत्र नाम" /></label><input className="input" placeholder="e.g. Advanced Wiring" required /></div>
      <div className="field"><label><T en="Issuing authority" hi="जारीकर्ता" /></label><input className="input" placeholder="e.g. NCCT / NSDC" required /></div>
      <div className="field"><label><T en="Upload document" hi="दस्तावेज़ अपलोड करें" /></label><input className="input" type="file" /></div>
      <button className="btn btn-primary" type="submit"><T en="Submit for verification" hi="सत्यापन हेतु जमा करें" /></button>
    </form>
  );
}

export default function WorkerDashboard() {
  return (
    <>
      <Navbar />
      <DashboardShell
        who={{ initials: "RS", name: "Ramesh Solanki", role: { en: "Electrician · Verified", hi: "इलेक्ट्रीशियन · सत्यापित" }, color: "linear-gradient(135deg,#2dd4bf,#0d9488)", badge: (<div className="row" style={{ gap: 8, margin: "-8px 4px 16px" }}><span className="pill pill-success"><span className="dot" /> <T en="Online" hi="ऑनलाइन" /></span><span className="verified">{check} <T en="ID verified" hi="आईडी सत्यापित" /></span></div>) }}
        nav={NAV}
        sideLabel={{ en: "Account", hi: "खाता" }}
        extraNav={[
          { en: "Profile", hi: "प्रोफ़ाइल", toast: "Opening your profile…", icon: acctIcon(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>) },
          { en: "Availability", hi: "उपलब्धता", toast: "Availability settings updated", icon: acctIcon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>) },
          { en: "Logout", hi: "लॉग आउट", toast: "Signed out", icon: acctIcon(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>) },
        ]}
        subtitle={{ en: "Welcome back, Ramesh — you have 3 new job requests nearby.", hi: "वापसी पर स्वागत है, रमेश — आपके पास 3 नए कार्य अनुरोध हैं।" }}
        actions={<>
          <span className="pill pill-success"><span className="dot" /> <T en="Available" hi="उपलब्ध" /></span>
          <ActionButton toast="You are now offline"><T en="Go offline" hi="ऑफ़लाइन जाएँ" /></ActionButton>
        </>}
      >
        {/* OVERVIEW */}
        <View name="overview">
          <div className="kpi-grid">
            <div className="card kpi"><div className="top"><span className="icon-chip">{I.earnings}</span><span className="trend up">▲ 12%</span></div><div className="val tnum">₹42,800</div><div className="lbl"><T en="This month's earnings" hi="इस माह की कमाई" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip success">{check}</span><span className="trend up">▲ 4</span></div><div className="val tnum">28</div><div className="lbl"><T en="Jobs completed" hi="पूर्ण कार्य" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip amber">{I.reviews}</span><span className="trend up">▲ 0.2</span></div><div className="val tnum">4.9 ★</div><div className="lbl"><T en="Average rating" hi="औसत रेटिंग" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip info">{I.overview}</span><span className="trend up">▲ 2%</span></div><div className="val tnum">96%</div><div className="lbl"><T en="Acceptance rate" hi="स्वीकृति दर" /></div></div>
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
            <div className="row-top"><span className="ai-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 5 5 .5-4 3.5 1.5 5L12 18l-4.5 3 1.5-5-4-3.5 5-.5z" /></svg> <T en="AI Insight" hi="AI अंतर्दृष्टि" /></span><span className="pill pill-primary"><T en="Demand forecast" hi="मांग पूर्वानुमान" /></span></div>
            <p className="fw-600" style={{ fontSize: "1.05rem" }}><T en="Demand for electrical work in your area is expected to rise 22% next week." hi="अगले सप्ताह आपके क्षेत्र में बिजली कार्य की मांग 22% बढ़ने की उम्मीद है।" /></p>
            <p className="text-muted mt-1"><T en="Keep your calendar open on the weekend to capture higher-value emergency jobs and boost your monthly earnings." hi="सप्ताहांत पर अपना कैलेंडर खुला रखें ताकि अधिक-मूल्य वाले आपातकालीन कार्य मिलें और मासिक कमाई बढ़े।" /></p>
            <ActionButton className="btn btn-primary btn-sm mt-2" toast="Weekend availability opened"><T en="Open weekend slots" hi="सप्ताहांत स्लॉट खोलें" /></ActionButton>
          </div>
        </View>

        {/* REQUESTS */}
        <View name="requests"><RequestsView /></View>

        {/* SCHEDULE */}
        <View name="schedule"><ScheduleView /></View>

        {/* EARNINGS */}
        <View name="earnings">
          <div className="kpi-grid">
            <div className="card kpi"><div className="top"><span className="icon-chip">{I.earnings}</span></div><div className="val tnum">₹42,800</div><div className="lbl"><T en="This month (net)" hi="इस माह (शुद्ध)" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip success">{check}</span></div><div className="val tnum">₹2,05,600</div><div className="lbl"><T en="Total earned (2026)" hi="कुल अर्जित (2026)" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg></span></div><div className="val tnum">8%</div><div className="lbl"><T en="Platform commission" hi="प्लेटफॉर्म कमीशन" /></div></div>
            <div className="card kpi"><div className="top"><span className="icon-chip info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span></div><div className="val tnum">₹6,300</div><div className="lbl"><T en="Pending payout" hi="लंबित भुगतान" /></div></div>
          </div>
          <div className="dash-grid two">
            <div className="card panel">
              <div className="panel-head"><h3><T en="Monthly net earnings" hi="मासिक शुद्ध कमाई" /></h3></div>
              <div className="chart-wrap"><LineChart data={{ labels: months, datasets: [{ label: "Net", data: earnData, borderColor: PALETTE.teal, backgroundColor: "rgba(13,148,136,0.12)", fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: PALETTE.teal }] }} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: PALETTE.grid }, ticks: { callback: moneyTick } } } }} /></div>
            </div>
            <div className="card panel">
              <div className="panel-head"><h3><T en="Recent payouts" hi="हाल के भुगतान" /></h3><ActionButton className="btn btn-primary btn-sm" toast="Withdrawal of ₹6,300 initiated to your bank"><T en="Withdraw to bank" hi="बैंक में निकालें" /></ActionButton></div>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Date</th><th>Job</th><th>Gross</th><th>Comm.</th><th>Net</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr><td>22 Aug</td><td>Wiring repair</td><td className="tnum">₹640</td><td className="tnum">₹51</td><td className="tnum"><b>₹589</b></td><td><StatusPill kind="success">Paid</StatusPill></td></tr>
                    <tr><td>20 Aug</td><td>AC point install</td><td className="tnum">₹1,200</td><td className="tnum">₹96</td><td className="tnum"><b>₹1,104</b></td><td><StatusPill kind="success">Paid</StatusPill></td></tr>
                    <tr><td>18 Aug</td><td>Inverter setup</td><td className="tnum">₹1,850</td><td className="tnum">₹148</td><td className="tnum"><b>₹1,702</b></td><td><StatusPill kind="success">Paid</StatusPill></td></tr>
                    <tr><td>Today</td><td>Emergency fault</td><td className="tnum">₹790</td><td className="tnum">₹63</td><td className="tnum"><b>₹727</b></td><td><StatusPill kind="warning">Pending</StatusPill></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </View>

        {/* WELFARE */}
        <View name="welfare">
          <div className="card panel mb-3">
            <div className="panel-head"><h3><T en="Welfare & insurance" hi="कल्याण व बीमा" /></h3><ActionButton toast="Opening policy document…"><T en="View policy" hi="पॉलिसी देखें" /></ActionButton></div>
            <ul className="check-list">
              <li><span className="tick">{bigCheck}</span><div><b><T en="Accident insurance" hi="दुर्घटना बीमा" /> — ₹5,00,000 <span className="pill pill-success" style={{ marginLeft: 4 }}>Active</span></b><span><T en="Cover provided by the cooperative federation" hi="सहकारी फेडरेशन द्वारा प्रदत्त कवर" /></span></div></li>
              <li><span className="tick">{bigCheck}</span><div><b><T en="Health benefit" hi="स्वास्थ्य लाभ" /> <span className="pill pill-success" style={{ marginLeft: 4 }}>Enrolled</span></b><span><T en="OPD & hospitalisation support for you and family" hi="आपके और परिवार के लिए OPD व अस्पताल सहायता" /></span></div></li>
              <li><span className="tick">{bigCheck}</span><div style={{ flex: 1 }}><b><T en="Welfare fund balance" hi="कल्याण कोष शेष" /> — ₹12,400</b><span><T en="Goal ₹20,000 · earn with every completed job" hi="लक्ष्य ₹20,000 · हर कार्य के साथ अर्जित करें" /></span><div className="meter mt-1" style={{ maxWidth: 320 }}><span style={{ width: "62%" }} /></div></div></li>
              <li><span className="tick">{bigCheck}</span><div><b><T en="Next premium: paid by cooperative" hi="अगला प्रीमियम: सहकारी द्वारा भुगतान" /></b><span><T en="Due 01 Sep 2026 — no action needed" hi="देय 01 सितंबर 2026 — कोई कार्रवाई आवश्यक नहीं" /></span></div></li>
            </ul>
          </div>
          <div className="card ai-card">
            <div className="row-top"><span className="ai-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 5 5 .5-4 3.5 1.5 5L12 18l-4.5 3 1.5-5-4-3.5 5-.5z" /></svg> Tip</span></div>
            <p className="fw-600"><T en="Complete 4 more jobs this month to unlock the ₹2,000 quarterly welfare bonus." hi="इस माह 4 और कार्य पूरे करें और ₹2,000 त्रैमासिक कल्याण बोनस अनलॉक करें।" /></p>
          </div>
        </View>

        {/* REVIEWS */}
        <View name="reviews">
          <div className="card panel">
            <div className="panel-head"><h3><T en="Ratings & reviews" hi="रेटिंग व समीक्षाएँ" /></h3><span className="rating"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z" /></svg> 4.9 · 214 reviews</span></div>
            <div className="stack" style={{ gap: 14 }}>
              {[
                { i: "SM", c: "linear-gradient(135deg,#2dd4bf,#0d9488)", n: "Sunita Mehta", s: "★★★★★", en: "“Fixed our wiring quickly and explained everything. Very professional and polite.”", hi: "“हमारी वायरिंग जल्दी ठीक की और सब समझाया। बहुत पेशेवर।”", b: true },
                { i: "AT", c: "linear-gradient(135deg,#60a5fa,#2563eb)", n: "Amit Trivedi", s: "★★★★★", en: "“Arrived on time for an emergency at night. Fair pricing, exactly as quoted.”", hi: "“रात में आपात स्थिति में समय पर पहुँचे। उचित मूल्य।”", b: true },
                { i: "RS", c: "linear-gradient(135deg,#fbbf24,#f59e0b)", n: "Reena Shah", s: "★★★★☆", en: "“Great work installing fans and lights. Would happily book again.”", hi: "“पंखे और लाइट लगाने का बढ़िया काम। दोबारा बुक करूँगी।”", b: false },
              ].map((r, i) => (
                <div key={i} style={r.b ? { paddingBottom: 14, borderBottom: "1px solid var(--border)" } : undefined}>
                  <div className="between"><div className="td-user"><span className="avatar" style={{ width: 34, height: 34, fontSize: ".8rem", background: r.c }}>{r.i}</span><b>{r.n}</b></div><span className="rating" style={{ color: "var(--accent)" }}>{r.s}</span></div>
                  <p className="text-muted mt-1"><T en={r.en} hi={r.hi} /></p>
                </div>
              ))}
            </div>
          </div>
        </View>

        {/* CERTIFICATES */}
        <View name="certificates">
          <div className="dash-grid two">
            <div className="card panel">
              <div className="panel-head"><h3><T en="Skill certificates" hi="कौशल प्रमाणपत्र" /></h3></div>
              <div className="stack" style={{ gap: 12 }}>
                {[
                  { cls: "success", ic: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M8 13l-1 8 5-3 5 3-1-8" /></svg>), name: "Electrician Level-2", org: "· NCCT", en: "Issued Mar 2024", hi: "जारी मार्च 2024" },
                  { cls: "amber", ic: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2" /></svg>), name: "Solar Installation", org: "· NSDC", en: "Issued Nov 2024", hi: "जारी नवंबर 2024" },
                  { cls: "info", ic: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /></svg>), name: "Electrical Safety Training", org: "", en: "Issued Feb 2025", hi: "जारी फरवरी 2025" },
                ].map((c, i) => (
                  <div className="between" key={i} style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                    <div className="row" style={{ gap: 12 }}><span className={"icon-chip " + c.cls} style={{ width: 40, height: 40 }}>{c.ic}</span><div><b>{c.name} <span className="text-muted text-xs">{c.org}</span></b><div className="text-muted text-xs"><T en={c.en} hi={c.hi} /></div></div></div>
                    <span className="verified">{check}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card panel">
              <div className="panel-head"><h3><T en="Add a certificate" hi="प्रमाणपत्र जोड़ें" /></h3></div>
              <AddCertForm />
            </div>
          </div>
        </View>
      </DashboardShell>
    </>
  );
}
