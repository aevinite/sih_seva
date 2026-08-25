"use client";
import { useState } from "react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import { T, useT, useToast } from "@/lib/providers";

const SKILLS = [
  { ic: "⚡", en: "Electrician", hi: "इलेक्ट्रीशियन" },
  { ic: "🔧", en: "Plumber", hi: "प्लंबर" },
  { ic: "🪚", en: "Carpenter", hi: "बढ़ई" },
  { ic: "🎨", en: "Painter", hi: "पेंटर" },
  { ic: "🧱", en: "Mason", hi: "राजमिस्त्री" },
  { ic: "🧹", en: "Cleaner", hi: "सफाईकर्मी" },
  { ic: "🏠", en: "Domestic Help", hi: "घरेलू सहायक" },
  { ic: "👶", en: "Caregiver", hi: "देखभालकर्ता" },
  { ic: "🚗", en: "Driver", hi: "ड्राइवर" },
  { ic: "🌿", en: "Gardener", hi: "माली" },
  { ic: "❄️", en: "AC Technician", hi: "एसी तकनीशियन" },
  { ic: "🔌", en: "Appliance Repair", hi: "उपकरण मरम्मत" },
];

const tick = (
  <span className="tick">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
  </span>
);

export default function RegisterPage() {
  const t = useT();
  const { show } = useToast();
  const [skills, setSkills] = useState<Set<number>>(new Set());
  const [welfare, setWelfare] = useState(true);
  const [pledge, setPledge] = useState(false);

  const toggleSkill = (i: number) =>
    setSkills((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    show("Application submitted! Your cooperative society will verify your details within 48 hours.");
  };

  return (
    <>
      <Navbar />

      <header className="page-head">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/"><T en="Home" hi="होम" /></Link> / <span><T en="Join as Worker" hi="कार्यकर्ता बनें" /></span>
          </div>
          <h1 className="balance"><T en="Become a verified cooperative professional" hi="एक सत्यापित सहकारी पेशेवर बनें" /></h1>
          <p className="pretty">
            <T
              en="Register with your Labour Cooperative Society to get fair wages, ₹5 lakh insurance, free skill certification and steady, year-round work — with zero joining fee."
              hi="अपनी श्रमिक सहकारी समिति के साथ पंजीकरण करें — उचित वेतन, ₹5 लाख बीमा, निःशुल्क कौशल प्रमाणन और साल भर स्थिर काम, शून्य शुल्क के साथ।"
            />
          </p>
        </div>
      </header>

      <section className="section">
        <div className="wrap split">
          {/* LEFT: FORM */}
          <div className="reveal in">
            <form className="card" onSubmit={submit}>
              {/* Progress */}
              <div className="progress">
                <div className="node current"><span className="num">1</span><span className="label"><T en="Personal" hi="व्यक्तिगत" /></span></div>
                <span className="bar" />
                <div className="node"><span className="num">2</span><span className="label"><T en="Skills" hi="कौशल" /></span></div>
                <span className="bar" />
                <div className="node"><span className="num">3</span><span className="label"><T en="Verification" hi="सत्यापन" /></span></div>
                <span className="bar" />
                <div className="node"><span className="num">4</span><span className="label"><T en="Bank & Welfare" hi="बैंक व कल्याण" /></span></div>
              </div>

              {/* Personal details */}
              <h3><T en="Personal details" hi="व्यक्तिगत विवरण" /></h3>
              <div className="form-grid two mt-2">
                <div className="field">
                  <label><T en="Full name" hi="पूरा नाम" /></label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
                    <input className="input" type="text" required placeholder={t("e.g. Ramesh Solanki", "जैसे रमेश सोलंकी")} />
                  </div>
                </div>
                <div className="field">
                  <label><T en="Mobile number" hi="मोबाइल नंबर" /></label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
                    <input className="input" type="tel" required placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="field">
                  <label><T en="Email address" hi="ईमेल पता" /></label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                    <input className="input" type="email" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="field">
                  <label><T en="Date of birth" hi="जन्म तिथि" /></label>
                  <input className="input" type="date" />
                </div>
                <div className="field">
                  <label><T en="Gender" hi="लिंग" /></label>
                  <select className="select" defaultValue="">
                    <option value="">{t("Select gender", "लिंग चुनें")}</option>
                    <option>{t("Female", "महिला")}</option>
                    <option>{t("Male", "पुरुष")}</option>
                    <option>{t("Other", "अन्य")}</option>
                  </select>
                </div>
                <div className="field">
                  <label><T en="Preferred language" hi="पसंदीदा भाषा" /></label>
                  <select className="select">
                    <option>{t("Hindi", "हिंदी")}</option>
                    <option>{t("English", "अंग्रेज़ी")}</option>
                    <option>{t("Marathi", "मराठी")}</option>
                    <option>{t("Gujarati", "गुजराती")}</option>
                    <option>{t("Tamil", "तमिल")}</option>
                    <option>{t("Bengali", "बंगाली")}</option>
                  </select>
                </div>
                <div className="field col-span-2">
                  <label><T en="Residential address" hi="आवासीय पता" /></label>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                    <input className="input" type="text" placeholder={t("House / Street, Area, City, PIN", "मकान / गली, क्षेत्र, शहर, पिन")} />
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Cooperative society */}
              <h3><T en="Cooperative society" hi="सहकारी समिति" /></h3>
              <p className="hint mt-1"><T en="Choose the Labour Cooperative Society you are affiliated with — it will endorse your registration." hi="वह श्रमिक सहकारी समिति चुनें जिससे आप संबद्ध हैं — यह आपके पंजीकरण की पुष्टि करेगी।" /></p>
              <div className="form-grid two mt-2">
                <div className="field">
                  <label><T en="Labour Cooperative Society" hi="श्रमिक सहकारी समिति" /></label>
                  <select className="select" defaultValue="">
                    <option value="">{t("Select society", "समिति चुनें")}</option>
                    <option>Sahakar Shramik Sahakari Samiti, Pune</option>
                    <option>Ekta Labour Cooperative Society, Ahmedabad</option>
                    <option>Jan Seva Shramik Sangh, Jaipur</option>
                    <option>Navjeevan Labour Cooperative, Nagpur</option>
                    <option>Pragati Shramik Sahakari Samiti, Lucknow</option>
                    <option>{t("Not yet a member — help me join", "अभी सदस्य नहीं — मुझे जुड़ने में मदद करें")}</option>
                  </select>
                </div>
                <div className="field">
                  <label><T en="State & district" hi="राज्य व जिला" /></label>
                  <select className="select" defaultValue="">
                    <option value="">{t("Select location", "स्थान चुनें")}</option>
                    <option>Maharashtra — Pune</option>
                    <option>Gujarat — Ahmedabad</option>
                    <option>Rajasthan — Jaipur</option>
                    <option>Uttar Pradesh — Lucknow</option>
                    <option>Maharashtra — Nagpur</option>
                    <option>Tamil Nadu — Chennai</option>
                    <option>West Bengal — Kolkata</option>
                  </select>
                </div>
              </div>

              <div className="divider" />

              {/* Skill profiling */}
              <h3><T en="Skill profiling" hi="कौशल प्रोफाइलिंग" /></h3>
              <p className="hint mt-1"><T en="Select all the skills you can offer. You can add certifications later from your dashboard." hi="वे सभी कौशल चुनें जो आप प्रदान कर सकते हैं। आप बाद में प्रमाणपत्र जोड़ सकते हैं।" /></p>
              <div className="chip-select mt-2">
                {SKILLS.map((s, i) => (
                  <span key={s.en} className={"chip" + (skills.has(i) ? " active" : "")} onClick={() => toggleSkill(i)}>
                    {s.ic} <span><T en={s.en} hi={s.hi} /></span>
                  </span>
                ))}
              </div>
              <div className="form-grid two mt-3">
                <div className="field">
                  <label><T en="Years of experience" hi="अनुभव के वर्ष" /></label>
                  <select className="select">
                    <option>{t("Less than 1 year", "1 वर्ष से कम")}</option>
                    <option>{t("1 – 3 years", "1 – 3 वर्ष")}</option>
                    <option>{t("3 – 5 years", "3 – 5 वर्ष")}</option>
                    <option>{t("5 – 10 years", "5 – 10 वर्ष")}</option>
                    <option>{t("More than 10 years", "10 वर्ष से अधिक")}</option>
                  </select>
                </div>
                <div className="field">
                  <label><T en="Service radius" hi="सेवा दायरा" /></label>
                  <select className="select">
                    <option>3 km</option>
                    <option>5 km</option>
                    <option>10 km</option>
                    <option>15 km</option>
                    <option>{t("City-wide", "पूरे शहर में")}</option>
                  </select>
                </div>
                <div className="field col-span-2">
                  <label><T en="Describe your experience" hi="अपने अनुभव का वर्णन करें" /></label>
                  <textarea className="textarea" placeholder={t("Tell customers about your work, specialities and past projects…", "ग्राहकों को अपने काम, विशेषज्ञता और पिछली परियोजनाओं के बारे में बताएँ…")} />
                </div>
              </div>

              <div className="divider" />

              {/* Verification documents */}
              <h3><T en="Verification documents" hi="सत्यापन दस्तावेज़" /></h3>
              <p className="hint mt-1"><T en="We verify every professional to keep customers safe. Police verification is initiated by your cooperative society after submission." hi="हम प्रत्येक पेशेवर का सत्यापन करते हैं। सबमिट करने के बाद आपकी सहकारी समिति द्वारा पुलिस सत्यापन शुरू किया जाता है।" /></p>
              <div className="field mt-2">
                <label><T en="Aadhaar number" hi="आधार संख्या" /></label>
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="11" r="2" /><path d="M5 16a3 3 0 0 1 6 0M14 10h4M14 14h3" /></svg>
                  <input className="input" type="text" inputMode="numeric" placeholder="XXXX XXXX XXXX" />
                </div>
                <span className="hint"><T en="Used only for KYC. Your Aadhaar is encrypted and never shown to customers." hi="केवल KYC के लिए। आपका आधार एन्क्रिप्टेड है और ग्राहकों को कभी नहीं दिखाया जाता।" /></span>
              </div>

              <div className="grid mt-3" style={{ gap: 14 }}>
                {[
                  { chip: "", icon: (<><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>), en: "Aadhaar card", hi: "आधार कार्ड", den: "PDF or image, max 5 MB", dhi: "PDF या छवि, अधिकतम 5 MB" },
                  { chip: "info", icon: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>), en: "Passport-size photo", hi: "पासपोर्ट आकार की फोटो", den: "Clear, front-facing, JPG/PNG", dhi: "स्पष्ट, सामने से, JPG/PNG" },
                  { chip: "amber", icon: (<path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z" />), en: "Skill certificate (optional)", hi: "कौशल प्रमाणपत्र (वैकल्पिक)", den: "ITI / NCVT / prior training proof", dhi: "ITI / NCVT / पूर्व प्रशिक्षण प्रमाण" },
                ].map((u) => (
                  <div key={u.en} className="row between" style={{ border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: 14, gap: 14, flexWrap: "wrap" }}>
                    <div className="row" style={{ gap: 12 }}>
                      <span className={"icon-chip " + u.chip}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{u.icon}</svg></span>
                      <div><b><T en={u.en} hi={u.hi} /></b><div className="hint"><T en={u.den} hi={u.dhi} /></div></div>
                    </div>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => show(t("File selected (demo)", "फ़ाइल चयनित (डेमो)"))}><T en="Choose file" hi="फ़ाइल चुनें" /></button>
                  </div>
                ))}
              </div>

              <div className="divider" />

              {/* Bank & welfare */}
              <h3><T en="Bank & welfare" hi="बैंक व कल्याण" /></h3>
              <p className="hint mt-1"><T en="Payments are transferred directly to your bank account after every job." hi="प्रत्येक कार्य के बाद भुगतान सीधे आपके बैंक खाते में स्थानांतरित किया जाता है।" /></p>
              <div className="form-grid two mt-2">
                <div className="field">
                  <label><T en="Bank account number" hi="बैंक खाता संख्या" /></label>
                  <input className="input" type="text" inputMode="numeric" placeholder={t("Account number", "खाता संख्या")} />
                </div>
                <div className="field">
                  <label><T en="IFSC code" hi="IFSC कोड" /></label>
                  <input className="input" type="text" placeholder={t("e.g. SBIN0001234", "जैसे SBIN0001234")} />
                </div>
              </div>

              <div className={"pay-method mt-3" + (welfare ? " active" : "")} onClick={() => setWelfare((v) => !v)} style={{ alignItems: "flex-start" }}>
                <div className="radio" />
                <div>
                  <b><T en="Enrol in the Cooperative Welfare & Insurance Fund" hi="सहकारी कल्याण व बीमा कोष में नामांकन करें" /></b>
                  <div className="hint mt-1"><T en="Includes ₹5 lakh accident cover, health benefits and a savings-linked welfare fund. Recommended for all members." hi="इसमें ₹5 लाख दुर्घटना कवर, स्वास्थ्य लाभ और बचत-आधारित कल्याण कोष शामिल है। सभी सदस्यों के लिए अनुशंसित।" /></div>
                </div>
              </div>

              <div className={"pay-method mt-2" + (pledge ? " active" : "")} onClick={() => setPledge((v) => !v)} style={{ alignItems: "flex-start" }}>
                <div className="radio" />
                <div>
                  <b><T en="I agree to the cooperative code of conduct & fair-service pledge" hi="मैं सहकारी आचार संहिता और निष्पक्ष-सेवा प्रतिज्ञा से सहमत हूँ" /></b>
                  <div className="hint mt-1"><T en="Uphold quality, honesty and respectful service to every customer." hi="प्रत्येक ग्राहक के लिए गुणवत्ता, ईमानदारी और सम्मानजनक सेवा बनाए रखें।" /></div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block mt-4">
                <T en="Submit Application" hi="आवेदन जमा करें" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
              <p className="hint center mt-2"><T en="No joining fee. Verification is completed within 48 hours by your cooperative society." hi="कोई शामिल होने का शुल्क नहीं। सत्यापन आपकी सहकारी समिति द्वारा 48 घंटों में पूरा किया जाता है।" /></p>
            </form>
          </div>

          {/* RIGHT: WHY JOIN */}
          <div className="reveal in">
            <div className="card">
              <span className="eyebrow"><T en="Worker-first" hi="कार्यकर्ता-प्रथम" /></span>
              <h3 className="mt-2"><T en="Why join AeviWork" hi="AeviWork में क्यों शामिल हों" /></h3>
              <ul className="check-list mt-2">
                {[
                  { en: "Fair wages — keep 92% of earnings", hi: "उचित वेतन — 92% आय आपकी", den: "Society-set rates and low platform commission.", dhi: "समिति-निर्धारित दरें और कम प्लेटफॉर्म कमीशन।" },
                  { en: "₹5 lakh accident insurance", hi: "₹5 लाख दुर्घटना बीमा", den: "Health benefits and welfare fund included.", dhi: "स्वास्थ्य लाभ और कल्याण कोष शामिल।" },
                  { en: "Free skill certification", hi: "निःशुल्क कौशल प्रमाणन", den: "NCCT-aligned upskilling and recognised badges.", dhi: "NCCT-संरेखित प्रशिक्षण और मान्यता प्राप्त बैज।" },
                  { en: "Steady, year-round work", hi: "साल भर स्थिर काम", den: "AI workforce allocation smooths demand.", dhi: "AI कार्यबल आवंटन मांग को संतुलित करता है।" },
                  { en: "Zero registration fee", hi: "शून्य पंजीकरण शुल्क", den: "Joining the cooperative is completely free.", dhi: "सहकारी में शामिल होना पूरी तरह निःशुल्क है।" },
                  { en: "Direct-to-bank payments", hi: "सीधे बैंक में भुगतान", den: "Fast, digital settlement after every job.", dhi: "प्रत्येक कार्य के बाद तेज़, डिजिटल निपटान।" },
                ].map((c) => (
                  <li key={c.en}>
                    {tick}
                    <div><b><T en={c.en} hi={c.hi} /></b><span><T en={c.den} hi={c.dhi} /></span></div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card mt-3">
              <div className="grid grid-3" style={{ gap: 16, textAlign: "center" }}>
                <div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>₹0</div><span className="text-muted text-sm"><T en="Joining fee" hi="शामिल होने का शुल्क" /></span></div>
                <div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>48 <span className="text-sm">hr</span></div><span className="text-muted text-sm"><T en="Verification" hi="सत्यापन" /></span></div>
                <div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>24×7</div><span className="text-muted text-sm"><T en="Support" hi="सहायता" /></span></div>
              </div>
            </div>

            <div className="card quote mt-3">
              <span className="stars" style={{ color: "var(--accent)" }}>★★★★★</span>
              <p>“<T en="Since joining the cooperative platform I get steady work and fair pay. The insurance cover gives my family real security." hi="सहकारी प्लेटफॉर्म से जुड़ने के बाद स्थिर काम और उचित वेतन मिलता है। बीमा से परिवार सुरक्षित है।" />”</p>
              <div className="who">
                <span className="avatar" style={{ width: 40, height: 40, background: "linear-gradient(135deg,#fbbf24,#f59e0b)" }}>RS</span>
                <div><b>Ramesh Solanki</b><div className="text-muted text-sm"><T en="Electrician · Ahmedabad" hi="इलेक्ट्रीशियन · अहमदाबाद" /></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
