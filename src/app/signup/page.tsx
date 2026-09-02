"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { T, useT, useToast, useAuth, useTheme, useLang } from "@/lib/providers";

type Role = "customer" | "worker";

export default function SignupPage() {
  const t = useT();
  const router = useRouter();
  const { register } = useAuth();
  const { show } = useToast();
  const { toggle: toggleTheme, theme } = useTheme();
  const { toggle: toggleLang, lang } = useLang();

  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("role");
    if (r === "worker") setRole("worker");
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return show(t("Password must be at least 6 characters", "पासवर्ड कम से कम 6 अक्षर का होना चाहिए"));
    if (password !== confirm) return show(t("Passwords do not match", "पासवर्ड मेल नहीं खाते"));
    setBusy(true);
    const res = await register({ name, email, password, phone, city, role });
    setBusy(false);
    if (res.ok && res.user) {
      show(t("Account created! Signing you in…", "खाता बन गया! साइन इन किया जा रहा है…"));
      router.push(role === "worker" ? "/dashboard-worker" : "/dashboard-customer");
    } else {
      show(res.error || t("Could not create account", "खाता नहीं बन सका"));
    }
  };

  return (
    <div className="su-wrap">
      <style dangerouslySetInnerHTML={{ __html: `
        .su-wrap{ min-height:100vh; display:grid; place-items:center; padding:24px 16px; background:var(--background); position:relative; overflow:hidden; }
        .su-wrap::before{ content:""; position:absolute; top:-20%; right:-10%; width:520px;height:520px;border-radius:50%; background:radial-gradient(circle,rgba(124,92,255,.28),transparent 62%); filter:blur(20px); }
        .su-card{ position:relative; width:100%; max-width:460px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); padding:clamp(22px,4vw,34px); }
        .su-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
        .su-brand{ display:flex; align-items:center; gap:10px; font-family:var(--font-display); font-weight:700; }
        .su-roles{ display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:14px 0 18px; }
        .su-role{ border:1px solid var(--border); background:var(--surface); border-radius:var(--radius); padding:12px; text-align:center; cursor:pointer; font-weight:600; font-size:.9rem; transition:.15s; }
        .su-role.active{ border-color:var(--primary); background:var(--primary-soft); color:var(--primary-strong); box-shadow:0 0 0 3px var(--ring); }
        .su-grid{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media (max-width:480px){ .su-grid{ grid-template-columns:1fr; } }
      `}} />
      <div className="su-card">
        <div className="su-top">
          <Link href="/" className="su-brand">
            <span className="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><path d="M12 4.3 5.2 7.3v5.1c0 4.4 3 7.2 6.8 8.8 3.8-1.6 6.8-4.4 6.8-8.8V7.3z" /><path d="M8.8 12.7l2.4 2.4 4.2-4.7" /></svg></span>
            <span style={{ color: "var(--foreground)" }}>AeviWork</span>
          </Link>
          <div className="row" style={{ gap: 8 }}>
            <button className="chip" onClick={toggleLang}>{lang === "en" ? "हिं" : "EN"}</button>
            <button className="chip" onClick={toggleTheme} aria-label="Theme">{theme === "dark" ? "☀" : "🌙"}</button>
          </div>
        </div>

        <h2 style={{ fontSize: "1.5rem" }}><T en="Create your account" hi="अपना खाता बनाएँ" /></h2>
        <p className="text-muted text-sm mt-1"><T en="Join the cooperative in under a minute." hi="एक मिनट में सहकारी से जुड़ें।" /></p>

        <div className="su-roles">
          <div className={"su-role" + (role === "customer" ? " active" : "")} onClick={() => setRole("customer")} role="button" tabIndex={0}>
            <T en="I need a service" hi="मुझे सेवा चाहिए" />
          </div>
          <div className={"su-role" + (role === "worker" ? " active" : "")} onClick={() => setRole("worker")} role="button" tabIndex={0}>
            <T en="I'm a worker" hi="मैं कार्यकर्ता हूँ" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="stack" style={{ gap: 14 }}>
          <div className="field"><label><T en="Full name" hi="पूरा नाम" /></label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Your name", "आपका नाम")} required /></div>
          <div className="field"><label><T en="Email" hi="ईमेल" /></label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
          <div className="su-grid">
            <div className="field"><label><T en="Phone" hi="फ़ोन" /></label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" /></div>
            <div className="field"><label><T en="City" hi="शहर" /></label>
              <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("City", "शहर")} /></div>
          </div>
          <div className="su-grid">
            <div className="field"><label><T en="Password" hi="पासवर्ड" /></label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div>
            <div className="field"><label><T en="Confirm" hi="पुष्टि करें" /></label>
              <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required /></div>
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={busy} style={{ width: "100%" }}>
            {busy ? <T en="Creating…" hi="बनाया जा रहा…" /> : <T en="Create account" hi="खाता बनाएँ" />}
          </button>
        </form>

        <p className="center mt-3 text-sm text-muted">
          <T en="Already have an account?" hi="पहले से खाता है?" />{" "}
          <Link href="/login" className="link"><T en="Sign in" hi="साइन इन" /></Link>
        </p>
      </div>
    </div>
  );
}
