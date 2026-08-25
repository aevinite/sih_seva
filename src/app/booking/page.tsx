"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { T, useT, useToast } from "@/lib/providers";

const SERVICES = [
  { icon: "⚡", en: "Electrician", hi: "इलेक्ट्रीशियन", rate: 299 },
  { icon: "🔧", en: "Plumber", hi: "प्लंबर", rate: 249 },
  { icon: "🪚", en: "Carpenter", hi: "बढ़ई", rate: 399 },
  { icon: "🎨", en: "Painter", hi: "पेंटर", rate: 499 },
  { icon: "🧹", en: "Cleaner", hi: "सफाईकर्मी", rate: 199 },
  { icon: "👵", en: "Caregiver", hi: "देखभालकर्ता", rate: 599 },
  { icon: "🚗", en: "Driver", hi: "ड्राइवर", rate: 349 },
  { icon: "🌿", en: "Gardener", hi: "माली", rate: 299 },
];
const SLOTS = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];
const DISABLED_SLOT = "02:00 PM";

const PAYMENTS = [
  { emoji: "📱", en: "UPI", hi: "UPI", den: "Google Pay, PhonePe, Paytm, BHIM", dhi: "गूगल पे, फोनपे, पेटीएम, भीम", instant: true },
  { emoji: "💳", en: "Credit / Debit card", hi: "क्रेडिट / डेबिट कार्ड", den: "Visa, Mastercard, RuPay", dhi: "वीज़ा, मास्टरकार्ड, रुपे" },
  { emoji: "👛", en: "Cooperative wallet", hi: "सहकारी वॉलेट", den: "Balance ₹1,250 · earn cashback to welfare fund", dhi: "शेष ₹1,250 · कल्याण कोष में कैशबैक" },
  { emoji: "💵", en: "Cash on service", hi: "सेवा पर नकद", den: "Pay the professional after the job is done", dhi: "काम पूरा होने के बाद पेशेवर को भुगतान करें" },
];

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function BookingPage() {
  const t = useT();
  const { show } = useToast();

  const [service, setService] = useState("Electrician");
  const [slot, setSlot] = useState("10:00 AM");
  const [emergency, setEmergency] = useState(false);
  const [payment, setPayment] = useState(0);

  const svc = SERVICES.find((s) => s.en === service)!;
  const visit = svc.rate;
  const priority = emergency ? 150 : 0;
  const subtotal = visit + priority;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    show(t("Booking confirmed! A verified worker has been assigned.", "बुकिंग पुष्टि! एक सत्यापित कार्यकर्ता नियुक्त कर दिया गया है।"));
  };

  return (
    <>
      <Navbar />

      <header className="page-head">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link href="/"><T en="Home" hi="होम" /></Link> / <span><T en="Book a Service" hi="सेवा बुक करें" /></span>
          </nav>
          <h1 className="balance"><T en="Book a service" hi="सेवा बुक करें" /></h1>
          <p className="pretty"><T en="Schedule a verified cooperative professional at a time that suits you — or request an emergency on-demand booking and get help in minutes." hi="अपनी सुविधा के समय पर एक सत्यापित सहकारी पेशेवर को शेड्यूल करें — या आपातकालीन ऑन-डिमांड बुकिंग करें और मिनटों में मदद पाएँ।" /></p>
        </div>
      </header>

      <section className="section">
        <div className="wrap">
          {/* Emergency banner */}
          <div className="card ai-card mb-3" style={{ borderLeft: "4px solid var(--danger)" }}>
            <div className="row between wrap-flex">
              <div className="row" style={{ alignItems: "flex-start", gap: 14 }}>
                <span className="icon-chip" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>
                </span>
                <div>
                  <h3 style={{ fontSize: "1.1rem" }}><T en="Need urgent help?" hi="तत्काल मदद चाहिए?" /></h3>
                  <p className="text-muted text-sm"><T en="Get a verified professional at your doorstep in under 30 minutes. Priority dispatch, 24×7." hi="30 मिनट से कम में अपने द्वार पर एक सत्यापित पेशेवर पाएँ। प्राथमिकता प्रेषण, 24×7।" /></p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: "var(--danger)" }}
                onClick={() => { setEmergency(true); show(t("Emergency booking — finding the nearest professional…", "आपातकालीन बुकिंग — निकटतम पेशेवर खोजा जा रहा है…")); }}
              >
                <T en="Emergency Book" hi="आपातकालीन बुकिंग" />
              </button>
            </div>
          </div>

          <div className="dash-grid two">
            {/* LEFT: form */}
            <form className="stack" style={{ gap: 24 }} onSubmit={onSubmit}>
              {/* 1. Service */}
              <div className="card">
                <h3 className="mb-1" style={{ fontSize: "1.05rem" }}><T en="1. Choose a service" hi="1. सेवा चुनें" /></h3>
                <p className="text-muted text-sm mb-2"><T en="Select the type of professional you need." hi="आपको जिस प्रकार के पेशेवर की आवश्यकता है उसे चुनें।" /></p>
                <div className="chip-select">
                  {SERVICES.map((s) => (
                    <span key={s.en} className={"chip" + (service === s.en ? " active" : "")} onClick={() => setService(s.en)}>
                      {s.icon} <span><T en={s.en} hi={s.hi} /></span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Describe */}
              <div className="card">
                <h3 className="mb-2" style={{ fontSize: "1.05rem" }}><T en="2. Describe the job" hi="2. काम का विवरण दें" /></h3>
                <div className="field">
                  <label htmlFor="job-desc"><T en="What do you need done?" hi="आपको क्या करवाना है?" /></label>
                  <textarea id="job-desc" className="textarea" placeholder={t("e.g. Two ceiling fans need installation and one switchboard is sparking…", "जैसे दो पंखे लगवाने हैं और एक स्विचबोर्ड में चिंगारी आ रही है…")} />
                  <span className="hint"><T en="A clear description helps us match the right skilled worker faster." hi="स्पष्ट विवरण सही कुशल कार्यकर्ता को जल्दी खोजने में मदद करता है।" /></span>
                </div>
              </div>

              {/* 3. Address */}
              <div className="card">
                <div className="between mb-2 wrap-flex">
                  <h3 style={{ fontSize: "1.05rem" }}><T en="3. Service address" hi="3. सेवा का पता" /></h3>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => show(t("Detecting your location…", "आपका स्थान पता लगाया जा रहा है…"))}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 21s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                    <span><T en="Use my current location" hi="मेरा वर्तमान स्थान उपयोग करें" /></span>
                  </button>
                </div>
                <div className="form-grid two">
                  <div className="field col-span-2">
                    <label htmlFor="addr"><T en="Full address" hi="पूरा पता" /></label>
                    <div className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 21s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                      <input id="addr" className="input" placeholder={t("House / flat no., street, area, landmark", "मकान/फ्लैट नं., सड़क, क्षेत्र, लैंडमार्क")} />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="city"><T en="City" hi="शहर" /></label>
                    <input id="city" className="input" placeholder={t("e.g. Pune", "जैसे पुणे")} />
                  </div>
                  <div className="field">
                    <label htmlFor="pin"><T en="PIN code" hi="पिन कोड" /></label>
                    <input id="pin" className="input" inputMode="numeric" placeholder={t("e.g. 411001", "जैसे 411001")} />
                  </div>
                </div>
              </div>

              {/* 4. Date & time */}
              <div className="card">
                <h3 className="mb-2" style={{ fontSize: "1.05rem" }}><T en="4. Pick a date & time" hi="4. तारीख व समय चुनें" /></h3>
                <div className="field mb-3">
                  <label htmlFor="date"><T en="Preferred date" hi="पसंदीदा तारीख" /></label>
                  <input id="date" type="date" className="input" />
                </div>
                <label className="field" style={{ marginBottom: 10 }}><span><T en="Available time slots" hi="उपलब्ध समय स्लॉट" /></span></label>
                <div className="time-slots">
                  {SLOTS.map((s) => {
                    const disabled = s === DISABLED_SLOT;
                    return (
                      <span
                        key={s}
                        className={"slot" + (slot === s ? " active" : "") + (disabled ? " disabled" : "")}
                        onClick={() => { if (!disabled) setSlot(s); }}
                      >
                        {s}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* 5. Booking type */}
              <div className="card">
                <h3 className="mb-2" style={{ fontSize: "1.05rem" }}><T en="5. Booking type" hi="5. बुकिंग प्रकार" /></h3>
                <div className="stack" style={{ gap: 12 }}>
                  <label className={"pay-method" + (!emergency ? " active" : "")} onClick={() => setEmergency(false)}>
                    <span className="radio" />
                    <span className="icon-chip" style={{ width: 40, height: 40, background: "var(--primary-soft)", color: "var(--primary-strong)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                    </span>
                    <span className="flex-1"><b><T en="Scheduled" hi="निर्धारित" /></b><div className="text-muted text-sm"><T en="Book for your chosen date and time slot." hi="अपनी चुनी तारीख और समय स्लॉट के लिए बुक करें।" /></div></span>
                    <span className="fw-700 text-accent"><T en="Free" hi="मुफ़्त" /></span>
                  </label>
                  <label className={"pay-method" + (emergency ? " active" : "")} onClick={() => setEmergency(true)}>
                    <span className="radio" />
                    <span className="icon-chip" style={{ width: 40, height: 40, background: "var(--danger-soft)", color: "var(--danger)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" /></svg>
                    </span>
                    <span className="flex-1"><b><T en="Emergency / On-demand" hi="आपातकालीन / ऑन-डिमांड" /></b><div className="text-muted text-sm"><T en="Priority dispatch — nearest pro in under 30 minutes." hi="प्राथमिकता प्रेषण — 30 मिनट में निकटतम पेशेवर।" /></div></span>
                    <span className="fw-700 text-accent">+₹150</span>
                  </label>
                </div>
              </div>

              {/* 6. Payment */}
              <div className="card">
                <h3 className="mb-2" style={{ fontSize: "1.05rem" }}><T en="6. Payment method" hi="6. भुगतान विधि" /></h3>
                <div className="stack" style={{ gap: 12 }}>
                  {PAYMENTS.map((p, i) => (
                    <label key={p.en} className={"pay-method" + (payment === i ? " active" : "")} onClick={() => setPayment(i)}>
                      <span className="radio" />
                      <span style={{ fontSize: "1.3rem" }}>{p.emoji}</span>
                      <span className="flex-1"><b><T en={p.en} hi={p.hi} /></b><div className="text-muted text-sm"><T en={p.den} hi={p.dhi} /></div></span>
                      {p.instant && <span className="pill pill-success"><span className="dot" /> <T en="Instant" hi="तुरंत" /></span>}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block">
                <T en="Confirm Booking" hi="बुकिंग पुष्टि करें" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </form>

            {/* RIGHT: summary */}
            <div className="stack" style={{ gap: 24 }}>
              <div className="card" style={{ position: "sticky", top: "calc(var(--nav-h) + 20px)" }}>
                <h3 className="mb-2" style={{ fontSize: "1.05rem" }}><T en="Booking summary" hi="बुकिंग सारांश" /></h3>

                <div className="worker-card" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", marginBottom: 18 }}>
                  <div className="body" style={{ padding: 16 }}>
                    <div className="head">
                      <span className="avatar" style={{ background: "linear-gradient(135deg,#2dd4bf,#0d9488)" }}>RS</span>
                      <div className="flex-1">
                        <h3 style={{ fontSize: "1rem" }}>Ramesh Solanki</h3>
                        <span className="role"><T en="Electrician · 1.2 km away" hi="इलेक्ट्रीशियन · 1.2 किमी दूर" /></span>
                      </div>
                      <span className="rating"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z" /></svg> 4.9</span>
                    </div>
                    <span className="verified"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg> <span><T en="ID & skill verified · insured" hi="आईडी व कौशल सत्यापित · बीमित" /></span></span>
                  </div>
                </div>

                <div className="summary-row"><span><T en="Service" hi="सेवा" /></span><span className="fw-600"><T en={svc.en} hi={svc.hi} /></span></div>
                <div className="summary-row"><span><T en="Visit charge" hi="विज़िट शुल्क" /></span><span className="tnum">{inr(visit)}</span></div>
                {emergency && (
                  <div className="summary-row"><span><T en="Priority (emergency)" hi="प्राथमिकता (आपातकाल)" /></span><span className="tnum">{inr(priority)}</span></div>
                )}
                <div className="summary-row"><span><T en="Platform fee" hi="प्लेटफॉर्म शुल्क" /></span><span className="tnum text-accent">₹0</span></div>
                <div className="summary-row"><span><T en="Taxes (GST 18%)" hi="कर (GST 18%)" /></span><span className="tnum">{inr(gst)}</span></div>
                <div className="summary-total"><span><T en="Total" hi="कुल" /></span><span className="tnum">{inr(total)}</span></div>

                <div className="divider" />

                <ul className="check-list" style={{ marginTop: 0 }}>
                  {[
                    { en: "Verified & insured professional", hi: "सत्यापित व बीमित पेशेवर" },
                    { en: "Free cancellation up to 2 hrs before", hi: "2 घंटे पहले तक मुफ़्त रद्दीकरण" },
                    { en: "Digital GST invoice", hi: "डिजिटल GST चालान" },
                  ].map((c) => (
                    <li key={c.en}>
                      <span className="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></span>
                      <div><b><T en={c.en} hi={c.hi} /></b></div>
                    </li>
                  ))}
                </ul>

                <div className="divider" />
                <span className="pill pill-success"><span className="dot" /> <span><T en="Fair wage: 92% goes to the worker" hi="उचित वेतन: 92% कार्यकर्ता को" /></span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
