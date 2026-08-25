import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Reveal from "@/components/site/Reveal";
import Counter from "@/components/site/Counter";
import { T } from "@/lib/providers";
import Link from "next/link";

const check = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
);

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow"><T en="Ministry of Cooperation · NCCT" hi="सहकारिता मंत्रालय · NCCT" /></span>
            <h1 className="balance">
              <T en="Cooperative services, " hi="सहकारी सेवाएँ, " />
              <span className="gradient-text"><T en="delivered with trust." hi="भरोसे के साथ।" /></span>
            </h1>
            <p className="lead pretty">
              <T
                en="Book verified electricians, plumbers, carpenters, caregivers, cleaners and more — from your local Labour Cooperative Society. Fair wages for workers, dependable service for you."
                hi="अपनी स्थानीय श्रमिक सहकारी समिति से सत्यापित इलेक्ट्रीशियन, प्लंबर, बढ़ई, देखभालकर्ता और सफाईकर्मी बुक करें — कार्यकर्ताओं के लिए उचित वेतन, आपके लिए भरोसेमंद सेवा।"
              />
            </p>
            <div className="hero-cta">
              <Link href="/services" className="btn btn-primary btn-lg">
                <T en="Find a Service" hi="सेवा खोजें" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link href="/register" className="btn btn-ink btn-lg"><T en="Join as a Worker" hi="कार्यकर्ता बनें" /></Link>
            </div>
            <div className="hero-trust">
              <div className="t"><b><Counter to={12500} suffix="+" /></b><span><T en="Verified workers" hi="सत्यापित कार्यकर्ता" /></span></div>
              <div className="t"><b><Counter to={340} suffix="+" /></b><span><T en="Cooperative societies" hi="सहकारी समितियाँ" /></span></div>
              <div className="t"><b><Counter to={4.8} decimals={1} />★</b><span><T en="Avg. service rating" hi="औसत सेवा रेटिंग" /></span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="glass-card">
              <div className="row between" style={{ marginBottom: 14 }}>
                <b style={{ color: "#fff" }}><T en="Available near you" hi="आपके पास उपलब्ध" /></b>
                <span className="pill pill-success"><span className="dot" /> Live</span>
              </div>
              {[
                { i: "RS", n: "Ramesh Solanki", en: "Electrician · 1.2 km · ⭐ 4.9", hi: "इलेक्ट्रीशियन · 1.2 किमी · ⭐ 4.9", c: "linear-gradient(135deg,#2dd4bf,#0d9488)" },
                { i: "PK", n: "Priya Kumari", en: "Caregiver · 0.8 km · ⭐ 5.0", hi: "देखभालकर्ता · 0.8 किमी · ⭐ 5.0", c: "linear-gradient(135deg,#fbbf24,#f59e0b)" },
                { i: "AV", n: "Anil Verma", en: "Plumber · 2.1 km · ⭐ 4.7", hi: "प्लंबर · 2.1 किमी · ⭐ 4.7", c: "linear-gradient(135deg,#60a5fa,#2563eb)" },
              ].map((w) => (
                <div className="hero-worker" key={w.i}>
                  <div className="avatar" style={{ background: w.c }}>{w.i}</div>
                  <div className="meta"><b>{w.n}</b><span><T en={w.en} hi={w.hi} /></span></div>
                  <span className="verified">{check}</span>
                </div>
              ))}
              <Link href="/services" className="btn btn-primary btn-block mt-2"><T en="See all workers" hi="सभी कार्यकर्ता देखें" /></Link>
            </div>
            <div className="float-badge tl">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--success)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              <span><T en="ID + Skill Verified" hi="आईडी + कौशल सत्यापित" /></span>
            </div>
            <div className="float-badge br">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              <span><T en="Fair wage guaranteed" hi="उचित वेतन की गारंटी" /></span>
            </div>
          </div>
        </div>
      </header>

      {/* ===== STRIP ===== */}
      <div className="strip">
        <div className="strip-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} style={{ display: "inline-flex", gap: 48 }}>
              <span>⚡ Electricians</span><span>🔧 Plumbers</span><span>🪚 Carpenters</span><span>🎨 Painters</span><span>🧹 Cleaners</span><span>👶 Caregivers</span><span>🚗 Drivers</span><span>🌿 Gardeners</span><span>🏠 Domestic Help</span><span>🛠️ Technicians</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== SERVICES ===== */}
      <section className="section" id="services">
        <div className="wrap">
          <Reveal className="sec-head center">
            <span className="eyebrow"><T en="What we offer" hi="हम क्या प्रदान करते हैं" /></span>
            <h2 className="h-section balance"><T en="Every household & community service, in one cooperative app" hi="हर घरेलू और सामुदायिक सेवा, एक सहकारी ऐप में" /></h2>
            <p className="lead"><T en="Skilled professionals from Labour Cooperative Societies — background-checked, skill-certified and welfare-protected." hi="श्रमिक सहकारी समितियों के कुशल पेशेवर — पृष्ठभूमि जाँच, कौशल-प्रमाणित और कल्याण-संरक्षित।" /></p>
          </Reveal>
          <div className="grid grid-4">
            {[
              { ic: "⚡", cls: "", rate: "₹299+", en: "Electricians", hi: "इलेक्ट्रीशियन", den: "1,840 pros · wiring, repairs", dhi: "1,840 पेशेवर · वायरिंग, मरम्मत" },
              { ic: "🔧", cls: "info", rate: "₹249+", en: "Plumbers", hi: "प्लंबर", den: "1,210 pros · leaks, taps", dhi: "1,210 पेशेवर · लीक, नल" },
              { ic: "🪚", cls: "amber", rate: "₹399+", en: "Carpenters", hi: "बढ़ई", den: "960 pros · furniture, doors", dhi: "960 पेशेवर · फर्नीचर, दरवाजे" },
              { ic: "🎨", cls: "success", rate: "₹499+", en: "Painters", hi: "पेंटर", den: "720 pros · interior & exterior", dhi: "720 पेशेवर · आंतरिक व बाहरी" },
              { ic: "🧹", cls: "", rate: "₹199+", en: "Cleaners", hi: "सफाईकर्मी", den: "2,050 pros · deep cleaning", dhi: "2,050 पेशेवर · गहरी सफाई" },
              { ic: "👶", cls: "amber", rate: "₹599+", en: "Caregivers", hi: "देखभालकर्ता", den: "640 pros · elder & child care", dhi: "640 पेशेवर · बुजुर्ग व शिशु" },
              { ic: "🚗", cls: "info", rate: "₹349+", en: "Drivers", hi: "ड्राइवर", den: "880 pros · hourly & on-demand", dhi: "880 पेशेवर · प्रति घंटा" },
              { ic: "🌿", cls: "success", rate: "₹299+", en: "Gardeners", hi: "माली", den: "410 pros · lawn & landscaping", dhi: "410 पेशेवर · लॉन व बागवानी" },
            ].map((s) => (
              <Reveal className="card card-hover svc-card" key={s.en}>
                <div className="top"><span className={"icon-chip " + s.cls}>{s.ic}</span><span className="rate">{s.rate}</span></div>
                <div><h3><T en={s.en} hi={s.hi} /></h3><span className="count"><T en={s.den} hi={s.dhi} /></span></div>
              </Reveal>
            ))}
          </div>
          <div className="center mt-4"><Link href="/services" className="btn btn-ghost btn-lg"><T en="Explore all services" hi="सभी सेवाएँ देखें" /></Link></div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow"><T en="How it works" hi="यह कैसे काम करता है" /></span>
            <h2 className="h-section"><T en="Book a trusted professional in four steps" hi="चार चरणों में भरोसेमंद पेशेवर बुक करें" /></h2>
          </Reveal>
          <div className="grid grid-4">
            {[
              { en: "Search & match", hi: "खोजें व मिलान करें", den: "Enter your location — we geo-match the nearest available, verified cooperative workers.", dhi: "अपना स्थान दर्ज करें — हम निकटतम सत्यापित कार्यकर्ता खोजते हैं।" },
              { en: "Schedule", hi: "समय तय करें", den: "Pick a slot that suits you, or request an emergency on-demand booking within minutes.", dhi: "अपने अनुसार समय चुनें, या मिनटों में आपातकालीन बुकिंग करें।" },
              { en: "Service done", hi: "सेवा पूरी", den: "Your professional arrives on time. Track status live and pay securely, digitally.", dhi: "पेशेवर समय पर पहुँचता है। स्थिति ट्रैक करें और सुरक्षित भुगतान करें।" },
              { en: "Rate & invoice", hi: "रेटिंग व चालान", den: "Rate the service, get a GST invoice instantly, and rebook your favourites anytime.", dhi: "सेवा को रेट करें, तुरंत चालान पाएँ और दोबारा बुक करें।" },
            ].map((s) => (
              <Reveal className="step" key={s.en}>
                <h3><T en={s.en} hi={s.hi} /></h3>
                <p><T en={s.den} hi={s.dhi} /></p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section" id="features">
        <div className="wrap">
          <Reveal className="sec-head center">
            <span className="eyebrow"><T en="Platform capabilities" hi="प्लेटफॉर्म क्षमताएँ" /></span>
            <h2 className="h-section balance"><T en="Built for cooperatives. Powered by technology." hi="सहकारी के लिए बना। तकनीक से सशक्त।" /></h2>
          </Reveal>
          <div className="grid grid-3">
            {[
              { cls: "", ic: <path d="M20 6L9 17l-5-5" />, en: "Verification & trust", hi: "सत्यापन व भरोसा", den: "Aadhaar-based KYC, police verification, and cooperative-society endorsement for every worker.", dhi: "प्रत्येक कार्यकर्ता के लिए आधार KYC, पुलिस सत्यापन और सहकारी समिति की स्वीकृति।" },
              { cls: "info", ic: <><path d="M12 21s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>, en: "Geo-location matching", hi: "जियो-लोकेशन मिलान", den: "Real-time geospatial matching connects you with the nearest available skilled worker instantly.", dhi: "रीयल-टाइम भू-स्थानिक मिलान आपको निकटतम कुशल कार्यकर्ता से जोड़ता है।" },
              { cls: "amber", ic: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>, en: "Digital payments & invoicing", hi: "डिजिटल भुगतान व चालान", den: "UPI, cards and cooperative wallet. Transparent pricing with instant GST-compliant invoices.", dhi: "UPI, कार्ड और सहकारी वॉलेट। पारदर्शी मूल्य और तुरंत चालान।" },
              { cls: "success", ic: <><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" /></>, en: "Emergency & on-demand", hi: "आपातकालीन व ऑन-डिमांड", den: "Urgent leak or power fault? Priority on-demand booking dispatches help in minutes.", dhi: "तत्काल लीक या बिजली दोष? प्राथमिकता बुकिंग मिनटों में मदद भेजती है।" },
              { cls: "", ic: <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z" />, en: "Ratings & feedback", hi: "रेटिंग व प्रतिक्रिया", den: "Two-way ratings keep quality high and build a fair, transparent reputation for workers.", dhi: "दो-तरफा रेटिंग गुणवत्ता बनाए रखती है और कार्यकर्ताओं की निष्पक्ष प्रतिष्ठा बनाती है।" },
              { cls: "info", ic: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>, en: "AI demand forecasting", hi: "AI मांग पूर्वानुमान", den: "Machine-learning predicts service demand and allocates the workforce for maximum utilisation.", dhi: "मशीन-लर्निंग मांग की भविष्यवाणी करती है और कार्यबल आवंटित करती है।" },
            ].map((f) => (
              <Reveal className="card card-hover feature" key={f.en}>
                <span className={"icon-chip " + f.cls}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{f.ic}</svg></span>
                <h3><T en={f.en} hi={f.hi} /></h3>
                <p><T en={f.den} hi={f.dhi} /></p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WELFARE SPLIT ===== */}
      <section className="section" id="about" style={{ background: "var(--surface)" }}>
        <div className="wrap split">
          <Reveal>
            <span className="eyebrow"><T en="Worker-first" hi="कार्यकर्ता-प्रथम" /></span>
            <h2 className="h-section balance mt-1"><T en="Dignity, welfare & fair pay — the cooperative way" hi="सम्मान, कल्याण व उचित वेतन — सहकारी तरीका" /></h2>
            <p className="lead mt-1"><T en="Unlike private aggregators, AeviWork is owned by the workers' cooperative. Earnings stay in the community and every professional is protected." hi="निजी एग्रीगेटर्स के विपरीत, AeviWork कार्यकर्ताओं की सहकारी के स्वामित्व में है।" /></p>
            <ul className="check-list">
              {[
                { en: "Guaranteed fair wages", hi: "उचित वेतन की गारंटी", den: "Transparent, society-set rates with low platform commission.", dhi: "पारदर्शी दरें, कम प्लेटफॉर्म कमीशन।" },
                { en: "Insurance & welfare fund", hi: "बीमा व कल्याण कोष", den: "Accident cover, health benefits and a cooperative welfare fund.", dhi: "दुर्घटना कवर, स्वास्थ्य लाभ और कल्याण कोष।" },
                { en: "Skill certification", hi: "कौशल प्रमाणन", den: "NCCT-aligned upskilling and recognised certification badges.", dhi: "NCCT-संरेखित प्रशिक्षण और मान्यता प्राप्त प्रमाणन।" },
                { en: "Steady work, all year", hi: "साल भर स्थिर काम", den: "AI workforce allocation smooths demand so workers stay busy.", dhi: "AI कार्यबल आवंटन से कार्यकर्ता व्यस्त रहते हैं।" },
              ].map((c) => (
                <li key={c.en}>
                  <span className="tick">{check}</span>
                  <div><b><T en={c.en} hi={c.hi} /></b><span><T en={c.den} hi={c.dhi} /></span></div>
                </li>
              ))}
            </ul>
            <Link href="/register" className="btn btn-primary btn-lg mt-3"><T en="Join the cooperative" hi="सहकारी में शामिल हों" /></Link>
          </Reveal>
          <Reveal>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ background: "var(--ink)", color: "#fff", padding: 24 }}>
                <div className="between">
                  <span className="ai-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 5 5 .5-4 3.5 1.5 5L12 18l-4.5 3 1.5-5-4-3.5 5-.5z" /></svg> Worker Welfare</span>
                  <span className="pill pill-success"><span className="dot" /> Protected</span>
                </div>
                <div className="mt-3">
                  <span style={{ fontSize: ".8rem", color: "rgba(233,245,241,.6)" }}><T en="This month's welfare contribution" hi="इस माह का कल्याण योगदान" /></span>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 700 }}>₹18,42,000</div>
                </div>
              </div>
              <div style={{ padding: 24 }} className="grid grid-2">
                {[
                  { v: "₹0", en: "Registration fee", hi: "पंजीकरण शुल्क" },
                  { v: "92%", en: "Earnings to worker", hi: "कार्यकर्ता को आय" },
                  { v: "₹5 Lakh", en: "Accident insurance cover", hi: "दुर्घटना बीमा कवर" },
                  { v: "24×7", en: "Support helpline", hi: "सहायता हेल्पलाइन" },
                ].map((k) => (
                  <div key={k.en}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700 }}>{k.v}</div>
                    <span className="text-muted text-sm"><T en={k.en} hi={k.hi} /></span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="section-sm">
        <div className="wrap">
          <Reveal className="stats-band">
            <div className="stats-grid">
              <div className="stat"><b><Counter to={12500} suffix="+" /></b><span><T en="Cooperative workers onboarded" hi="सहकारी कार्यकर्ता" /></span></div>
              <div className="stat"><b><Counter to={86000} suffix="+" /></b><span><T en="Services completed" hi="पूर्ण सेवाएँ" /></span></div>
              <div className="stat"><b>₹<Counter to={42} suffix=" Cr" /></b><span><T en="Paid to workers" hi="कार्यकर्ताओं को भुगतान" /></span></div>
              <div className="stat"><b><Counter to={28} /></b><span><T en="States & UTs covered" hi="राज्य व केंद्र शासित प्रदेश" /></span></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section">
        <div className="wrap">
          <Reveal className="sec-head center">
            <span className="eyebrow"><T en="Voices" hi="आवाज़ें" /></span>
            <h2 className="h-section"><T en="Trusted by households and workers alike" hi="परिवारों और कार्यकर्ताओं का समान भरोसा" /></h2>
          </Reveal>
          <div className="grid grid-3">
            {[
              { q_en: "Booked a plumber in ten minutes during a midnight leak. Verified, polite, and the bill was exactly as quoted.", q_hi: "आधी रात लीक पर दस मिनट में प्लंबर बुक किया। सत्यापित और बिल बिल्कुल वैसा ही।", i: "SM", n: "Sunita Mehta", r: "Customer · Pune", c: "linear-gradient(135deg,#2dd4bf,#0d9488)" },
              { q_en: "Since joining the cooperative platform I get steady work and fair pay. The insurance cover gives my family real security.", q_hi: "सहकारी प्लेटफॉर्म से जुड़ने के बाद स्थिर काम और उचित वेतन मिलता है। बीमा से परिवार सुरक्षित है।", i: "RS", n: "Ramesh Solanki", r: "Electrician · Ahmedabad", c: "linear-gradient(135deg,#fbbf24,#f59e0b)" },
              { q_en: "As a federation, the AI dashboard finally shows us where demand is rising so we can train and deploy workers ahead of time.", q_hi: "फेडरेशन के रूप में, AI डैशबोर्ड दिखाता है कि मांग कहाँ बढ़ रही है ताकि हम पहले से कार्यकर्ता तैनात करें।", i: "DK", n: "Dinesh Kapoor", r: "Federation Admin · Jaipur", c: "linear-gradient(135deg,#60a5fa,#2563eb)" },
            ].map((t) => (
              <Reveal className="card quote" key={t.i}>
                <span className="stars">★★★★★</span>
                <p>“<T en={t.q_en} hi={t.q_hi} />”</p>
                <div className="who">
                  <span className="avatar" style={{ width: 40, height: 40, background: t.c }}>{t.i}</span>
                  <div><b>{t.n}</b><div className="text-muted text-sm">{t.r}</div></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-sm" id="contact">
        <div className="wrap">
          <Reveal className="cta-band">
            <h2 className="h-section"><T en="Ready to experience cooperative services?" hi="सहकारी सेवाओं का अनुभव करने के लिए तैयार हैं?" /></h2>
            <p><T en="Join thousands of households and workers building a fairer service economy — together." hi="हजारों परिवारों और कार्यकर्ताओं के साथ एक निष्पक्ष सेवा अर्थव्यवस्था बनाएँ।" /></p>
            <div className="hero-cta" style={{ justifyContent: "center", position: "relative" }}>
              <Link href="/booking" className="btn btn-lg" style={{ background: "#fff", color: "var(--ink)" }}><T en="Book a Service" hi="सेवा बुक करें" /></Link>
              <Link href="/register" className="btn btn-ink btn-lg"><T en="Become a Worker" hi="कार्यकर्ता बनें" /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
