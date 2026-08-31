"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { T, useT, useTheme, useLang, useToast, useAuth } from "@/lib/providers";
import LangDropdown from "@/components/site/LangDropdown";

type Role = "customer" | "worker" | "federation";

const ROLES: {
  key: Role;
  target: string;
  icon: React.ReactNode;
  labelEn: string;
  labelHi: string;
  subEn: string;
  subHi: string;
  ctaEn: string;
  ctaHi: string;
}[] = [
  {
    key: "customer",
    target: "/dashboard-customer",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
    labelEn: "Customer",
    labelHi: "ग्राहक",
    subEn: "Book services",
    subHi: "सेवाएँ बुक करें",
    ctaEn: "Sign in to Customer portal",
    ctaHi: "ग्राहक पोर्टल में साइन इन करें",
  },
  {
    key: "worker",
    target: "/dashboard-worker",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z" />
      </svg>
    ),
    labelEn: "Worker",
    labelHi: "कार्यकर्ता",
    subEn: "Find jobs",
    subHi: "काम खोजें",
    ctaEn: "Sign in to Worker portal",
    ctaHi: "कार्यकर्ता पोर्टल में साइन इन करें",
  },
  {
    key: "federation",
    target: "/dashboard-admin",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    labelEn: "Federation",
    labelHi: "फेडरेशन",
    subEn: "Admin panel",
    subHi: "एडमिन पैनल",
    ctaEn: "Sign in to Federation panel",
    ctaHi: "फेडरेशन पैनल में साइन इन करें",
  },
];

// Demo credentials (client-side, for hackathon access)
const DEMO: Record<string, { pw: string; target: string; role: string; name: string }> = {
  "customer@aeviwork.in": { pw: "demo1234", target: "/dashboard-customer", role: "customer", name: "Aarav Nair" },
  "worker@aeviwork.in": { pw: "demo1234", target: "/dashboard-worker", role: "worker", name: "Ramesh Solanki" },
  "admin@aeviwork.in": { pw: "demo1234", target: "/dashboard-admin", role: "federation", name: "Dinesh Kapoor" },
  "superadmin@aeviwork.in": { pw: "aevinite@2026", target: "/aevinite", role: "superadmin", name: "Super Admin" },
};
const ROLE_EMAIL: Record<Role, string> = {
  customer: "customer@aeviwork.in",
  worker: "worker@aeviwork.in",
  federation: "admin@aeviwork.in",
};
const DEMO_LIST = [
  { label: "Customer", labelHi: "ग्राहक", em: "customer@aeviwork.in", pw: "demo1234" },
  { label: "Worker", labelHi: "कार्यकर्ता", em: "worker@aeviwork.in", pw: "demo1234" },
  { label: "Federation", labelHi: "फेडरेशन", em: "admin@aeviwork.in", pw: "demo1234" },
  { label: "Super Admin", labelHi: "सुपर एडमिन", em: "superadmin@aeviwork.in", pw: "aevinite@2026" },
];

const brandPath = (
  <>
    <path d="M12 3.5 4.7 6.9v5.6c0 4.8 3.2 7.9 7.3 9.9 4.1-2 7.3-5.1 7.3-9.9V6.9z" />
    <path d="M8.5 13.3l2.6 2.6 4.7-5.2" />
  </>
);

export default function LoginPage() {
  const [role, setRole] = useState<Role>("customer");
  const [email, setEmail] = useState("customer@aeviwork.in");
  const [password, setPassword] = useState("demo1234");
  const t = useT();
  const { toggle: toggleTheme, theme } = useTheme();
  const { lang } = useLang();
  const { show } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const current = ROLES.find((r) => r.key === role)!;

  const pickRole = (key: Role) => {
    setRole(key);
    const em = ROLE_EMAIL[key];
    setEmail(em);
    setPassword(DEMO[em].pw);
  };

  const targetFor = (role: string) =>
    role === "worker" ? "/dashboard-worker"
    : role === "federation" ? "/dashboard-admin"
    : role === "superadmin" ? "/aevinite"
    : "/dashboard-customer";

  const attempt = async (em: string, pw: string) => {
    show(t("Signing you in…", "आपको साइन इन किया जा रहा है…"));
    const res = await login(em.trim().toLowerCase(), pw);
    if (res.ok && res.user) {
      router.push(targetFor(res.user.role));
    } else {
      show(res.error || t("Invalid credentials — use a demo account below", "अमान्य क्रेडेंशियल — नीचे डेमो खाता उपयोग करें"));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attempt(email, password);
  };

  return (
    <div className="auth">
      <style
        dangerouslySetInnerHTML={{
          __html: `
  .auth { min-height: 100vh; display: grid; grid-template-columns: 1fr; }
  @media (min-width: 940px) { .auth { grid-template-columns: 1.05fr 1fr; } }
  .auth-brand { position: relative; overflow: hidden; background: var(--ink); color: var(--ink-foreground); padding: clamp(28px,5vw,56px); display: none; flex-direction: column; }
  @media (min-width: 940px) { .auth-brand { display: flex; } }
  .auth-brand::before { content:""; position:absolute; top:-15%; right:-12%; width:520px; height:520px; border-radius:50%; background:radial-gradient(circle,rgba(124,92,255,.55),transparent 62%); filter:blur(20px); }
  .auth-brand::after { content:""; position:absolute; bottom:-20%; left:-10%; width:420px; height:420px; border-radius:50%; background:radial-gradient(circle,rgba(34,211,238,.25),transparent 64%); filter:blur(18px); }
  .auth-brand > * { position: relative; }
  .auth-brand .head { display:flex; align-items:center; gap:11px; color:#fff; font-family:var(--font-display); font-weight:700; font-size:1.15rem; }
  .auth-brand .head small { display:block; font-family:var(--font-body); font-weight:500; font-size:.64rem; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.55); margin-top:-2px; }
  .auth-brand h1 { color:#fff; font-size:clamp(1.9rem,3.4vw,2.7rem); margin-top:auto; }
  .auth-brand p { color:rgba(233,245,241,.78); max-width:440px; margin-top:14px; }
  .auth-brand .points { display:grid; gap:14px; margin-top:28px; }
  .auth-brand .points li { display:flex; gap:12px; align-items:flex-start; list-style:none; }
  .auth-brand .points .t { width:26px;height:26px;border-radius:50%;background:rgba(124,92,255,.22);color:#c9bcff;display:grid;place-items:center;flex:none;margin-top:2px; }
  .auth-brand .points svg { width:15px;height:15px; }
  .auth-brand .foot-note { margin-top:34px; padding-top:22px; border-top:1px solid rgba(255,255,255,.12); font-size:.82rem; color:rgba(233,245,241,.55); }
  .auth-form { padding: clamp(24px,5vw,52px); display:flex; flex-direction:column; justify-content:center; background:var(--background); }
  .auth-inner { width:100%; max-width:420px; margin-inline:auto; }
  .auth-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:26px; }
  .auth-top .m-brand { display:flex; align-items:center; gap:10px; font-family:var(--font-display); font-weight:700; }
  .auth-top .m-brand .brand-mark { width:34px;height:34px; }
  .role-tabs { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:22px; }
  .role-tab { border:1px solid var(--border); background:var(--surface); border-radius:var(--radius); padding:12px 8px; text-align:center; cursor:pointer; transition:.15s; display:flex; flex-direction:column; align-items:center; gap:7px; }
  .role-tab:hover { border-color:var(--primary); }
  .role-tab.active { border-color:var(--primary); background:var(--primary-soft); box-shadow:0 0 0 3px var(--ring); }
  .role-tab .ic { width:34px;height:34px;border-radius:10px;background:var(--muted);color:var(--muted-foreground);display:grid;place-items:center; }
  .role-tab.active .ic { background:var(--primary); color:var(--primary-foreground); }
  .role-tab .ic svg { width:18px;height:18px; }
  .role-tab b { font-size:.82rem; }
  .role-tab span { font-size:.68rem; color:var(--muted-foreground); }
  .auth-h { font-size:1.5rem; }
  .auth-sub { color:var(--muted-foreground); font-size:.92rem; margin-top:4px; margin-bottom:22px; }
  .auth-fields { display:flex; flex-direction:column; gap:16px; }
  .link { color:var(--primary-strong); font-weight:600; font-size:.85rem; }
  .link:hover { text-decoration:underline; }
  .divider-or { display:flex; align-items:center; gap:12px; color:var(--muted-foreground); font-size:.8rem; margin:20px 0; }
  .divider-or::before, .divider-or::after { content:""; height:1px; background:var(--border); flex:1; }
  .social { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .checkbox-row { display:flex; align-items:center; justify-content:space-between; gap:10px; font-size:.85rem; }
  .cbx { display:flex; align-items:center; gap:8px; cursor:pointer; }
  .cbx input { width:16px;height:16px; accent-color:var(--primary); }
  .demo-creds { margin-top:18px; border:1px dashed color-mix(in srgb, var(--primary) 35%, var(--border)); border-radius:var(--radius); padding:12px; background:var(--muted); }
  .demo-creds .dc-title { font-size:.78rem; font-weight:600; color:var(--muted-foreground); margin-bottom:6px; }
  .dc-row { display:flex; justify-content:space-between; align-items:center; gap:10px; width:100%; text-align:left; padding:8px 10px; border-radius:10px; background:transparent; cursor:pointer; transition:.15s; }
  .dc-row:hover { background:var(--surface); box-shadow:var(--shadow-sm); }
  .dc-row .dc-role { font-weight:700; font-size:.8rem; }
  .dc-row .dc-cred { color:var(--muted-foreground); font-size:.72rem; font-family:ui-monospace,Menlo,Consolas,monospace; }
`,
        }}
      />

      {/* BRAND SIDE */}
      <aside className="auth-brand">
        <Link href="/" className="head">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              {brandPath}
            </svg>
          </span>
          <span>
            AeviWork<small>Sahkar se Samriddhi</small>
          </span>
        </Link>
        <h1 className="balance">
          <T en="One cooperative platform. Three powerful portals." hi="एक सहकारी मंच। तीन शक्तिशाली पोर्टल।" />
        </h1>
        <p className="pretty">
          <T
            en="Sign in to book trusted services, manage your work and earnings, or run your federation with AI-driven insights."
            hi="भरोसेमंद सेवाएँ बुक करने, अपना काम और आय प्रबंधित करने, या AI अंतर्दृष्टि के साथ अपना फेडरेशन चलाने के लिए साइन इन करें।"
          />
        </p>
        <ul className="points">
          {[
            { en: "Verified, welfare-protected professionals", hi: "सत्यापित, कल्याण-संरक्षित पेशेवर" },
            { en: "Fair wages — 92% earnings to workers", hi: "उचित वेतन — 92% आय कार्यकर्ताओं को" },
            { en: "AI demand forecasting & workforce allocation", hi: "AI मांग पूर्वानुमान और कार्यबल आवंटन" },
          ].map((p) => (
            <li key={p.en}>
              <span className="t">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>
                <T en={p.en} hi={p.hi} />
              </span>
            </li>
          ))}
        </ul>
        <p className="foot-note">© 2026 AeviWork · Smart India Hackathon · PS 26089 · Ministry of Cooperation / NCCT</p>
      </aside>

      {/* FORM SIDE */}
      <main className="auth-form">
        <div className="auth-inner">
          <div className="auth-top">
            <Link href="/" className="m-brand">
              <span className="brand-mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                  {brandPath}
                </svg>
              </span>
              <span style={{ color: "var(--foreground)" }}>AeviWork</span>
            </Link>
            <div className="row" style={{ gap: 8 }}>
              <LangDropdown light />
              <button className="chip" onClick={toggleTheme} aria-label="Theme">
                <span style={{ display: "inline-flex", width: 16, height: 16 }}>
                  {theme === "dark" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
          </div>

          <h2 className="auth-h">
            <T en="Welcome back" hi="वापसी पर स्वागत है" />
          </h2>
          <p className="auth-sub">
            <T en="Choose your portal and sign in to continue." hi="अपना पोर्टल चुनें और जारी रखने के लिए साइन इन करें।" />
          </p>

          {/* Role selector */}
          <div className="role-tabs">
            {ROLES.map((r) => (
              <div
                key={r.key}
                className={"role-tab" + (role === r.key ? " active" : "")}
                onClick={() => pickRole(r.key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pickRole(r.key)}
              >
                <span className="ic">{r.icon}</span>
                <b>
                  <T en={r.labelEn} hi={r.labelHi} />
                </b>
                <span>
                  <T en={r.subEn} hi={r.subHi} />
                </span>
              </div>
            ))}
          </div>

          <form className="auth-fields" onSubmit={onSubmit}>
            <div className="field">
              <label>
                <T en="Email or mobile number" hi="ईमेल या मोबाइल नंबर" />
              </label>
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                <input className="input" type="text" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="field">
              <div className="between">
                <label>
                  <T en="Password" hi="पासवर्ड" />
                </label>
                <a href="#" className="link" onClick={(e) => e.preventDefault()}>
                  <T en="Forgot?" hi="भूल गए?" />
                </a>
              </div>
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <input className="input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <div className="checkbox-row">
              <label className="cbx">
                <input type="checkbox" defaultChecked />{" "}
                <span>
                  <T en="Keep me signed in" hi="मुझे साइन इन रखें" />
                </span>
              </label>
              <span className="pill pill-success">
                <span className="dot" />{" "}
                <span>
                  <T en="Secure" hi="सुरक्षित" />
                </span>
              </span>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" style={{ width: "100%" }}>
              <T en={current.ctaEn} hi={current.ctaHi} />
            </button>
          </form>

          <div className="divider-or">
            <T en="or continue with" hi="या इसके साथ जारी रखें" />
          </div>
          <div className="social">
            <button className="btn btn-ghost" onClick={() => show(t("Demo mode — use the Sign in button", "डेमो मोड — साइन इन बटन का उपयोग करें"))}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#EA4335"
                  d="M12 11v3.6h5.1c-.2 1.3-1.6 3.9-5.1 3.9-3.1 0-5.6-2.6-5.6-5.7S8.9 6.1 12 6.1c1.8 0 3 .8 3.6 1.4l2.5-2.4C16.5 3.6 14.5 2.7 12 2.7c-5 0-9 4-9 9s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.5H12z"
                />
              </svg>
              Google
            </button>
            <button className="btn btn-ghost" onClick={() => show(t("Demo mode — use the Sign in button", "डेमो मोड — साइन इन बटन का उपयोग करें"))}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v10M8 7l4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
              </svg>
              DigiLocker
            </button>
          </div>

          <div className="demo-creds">
            <div className="dc-title">🔑 <T en="Demo credentials — tap a row to fill" hi="डेमो क्रेडेंशियल — भरने हेतु टैप करें" /></div>
            {DEMO_LIST.map((d) => (
              <button type="button" key={d.em} className="dc-row" onClick={() => { setEmail(d.em); setPassword(d.pw); }}>
                <span className="dc-role">{lang === "hi" ? d.labelHi : d.label}</span>
                <span className="dc-cred">{d.em} · {d.pw}</span>
              </button>
            ))}
          </div>

          <p className="center mt-3 text-sm text-muted">
            <T en="New to AeviWork?" hi="AeviWork पर नए हैं?" />{" "}
            <Link href="/signup" className="link">
              <T en="Create an account" hi="खाता बनाएँ" />
            </Link>{" "}
            <T en="or" hi="या" />{" "}
            <Link href="/signup?role=worker" className="link">
              <T en="join as a worker" hi="कार्यकर्ता के रूप में जुड़ें" />
            </Link>
          </p>
          <div className="divider-or" style={{ margin: "16px 0" }}>
            <T en="platform team" hi="प्लेटफ़ॉर्म टीम" />
          </div>
          <button
            type="button"
            className="btn btn-ghost w-full"
            style={{ width: "100%" }}
            onClick={() => attempt("superadmin@aeviwork.in", "aevinite@2026")}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              {brandPath}
            </svg>
            <span>
              <T en="Open Super Admin Console" hi="सुपर एडमिन कंसोल खोलें" />
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
