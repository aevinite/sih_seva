"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Reveal from "@/components/site/Reveal";
import { T, useT } from "@/lib/providers";

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.7L12 17.3 5.8 20.8l1.6-6.7L2.2 8.9l6.9-.6z" /></svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
const JobsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const CheckSm = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
);

type Tag = { en: string; hi: string };
type Worker = {
  initials: string; avatar: string; name: string; roleEn: string; roleHi: string;
  category: string; rating: number; dist: number; distEn: string; distHi: string;
  jobs: number; jobsEn: string; jobsHi: string; expEn: string; expHi: string;
  tags: Tag[]; price: number;
};

const WORKERS: Worker[] = [
  { initials: "RS", avatar: "linear-gradient(135deg,#2dd4bf,#0d9488)", name: "Ramesh Solanki", roleEn: "Electrician · Gandhinagar Labour Co-op", roleHi: "इलेक्ट्रीशियन · गांधीनगर श्रमिक सहकारी", category: "Electrician", rating: 4.9, dist: 1.2, distEn: "1.2 km away", distHi: "1.2 किमी दूर", jobs: 320, jobsEn: "320 jobs", jobsHi: "320 काम", expEn: "8 yrs exp", expHi: "8 वर्ष अनुभव", tags: [{ en: "Wiring", hi: "वायरिंग" }, { en: "Repairs", hi: "मरम्मत" }, { en: "Fittings", hi: "फिटिंग" }], price: 299 },
  { initials: "AV", avatar: "linear-gradient(135deg,#60a5fa,#2563eb)", name: "Anil Verma", roleEn: "Plumber · Sabarmati Labour Co-op", roleHi: "प्लंबर · साबरमती श्रमिक सहकारी", category: "Plumber", rating: 4.7, dist: 2.1, distEn: "2.1 km away", distHi: "2.1 किमी दूर", jobs: 210, jobsEn: "210 jobs", jobsHi: "210 काम", expEn: "6 yrs exp", expHi: "6 वर्ष अनुभव", tags: [{ en: "Leaks", hi: "लीक" }, { en: "Taps", hi: "नल" }, { en: "Drainage", hi: "नाली" }], price: 249 },
  { initials: "SP", avatar: "linear-gradient(135deg,#fbbf24,#f59e0b)", name: "Suresh Patel", roleEn: "Carpenter · Kalol Labour Co-op", roleHi: "बढ़ई · कलोल श्रमिक सहकारी", category: "Carpenter", rating: 4.8, dist: 3.4, distEn: "3.4 km away", distHi: "3.4 किमी दूर", jobs: 415, jobsEn: "415 jobs", jobsHi: "415 काम", expEn: "12 yrs exp", expHi: "12 वर्ष अनुभव", tags: [{ en: "Furniture", hi: "फर्नीचर" }, { en: "Doors", hi: "दरवाजे" }, { en: "Repairs", hi: "मरम्मत" }], price: 399 },
  { initials: "MJ", avatar: "linear-gradient(135deg,#34d399,#059669)", name: "Meena Joshi", roleEn: "Painter · Naroda Labour Co-op", roleHi: "पेंटर · नरोदा श्रमिक सहकारी", category: "Painter", rating: 5.0, dist: 1.8, distEn: "1.8 km away", distHi: "1.8 किमी दूर", jobs: 185, jobsEn: "185 jobs", jobsHi: "185 काम", expEn: "5 yrs exp", expHi: "5 वर्ष अनुभव", tags: [{ en: "Interior", hi: "आंतरिक" }, { en: "Exterior", hi: "बाहरी" }, { en: "Texture", hi: "टेक्सचर" }], price: 499 },
  { initials: "PK", avatar: "linear-gradient(135deg,#f472b6,#db2777)", name: "Priya Kumari", roleEn: "Caregiver · Vastral Labour Co-op", roleHi: "देखभालकर्ता · वस्त्राल श्रमिक सहकारी", category: "Caregiver", rating: 5.0, dist: 0.8, distEn: "0.8 km away", distHi: "0.8 किमी दूर", jobs: 260, jobsEn: "260 jobs", jobsHi: "260 काम", expEn: "9 yrs exp", expHi: "9 वर्ष अनुभव", tags: [{ en: "Elder care", hi: "बुजुर्ग देखभाल" }, { en: "Child care", hi: "शिशु देखभाल" }], price: 599 },
  { initials: "DK", avatar: "linear-gradient(135deg,#a78bfa,#7c3aed)", name: "Deepak Chauhan", roleEn: "Driver · Adalaj Labour Co-op", roleHi: "ड्राइवर · अडालज श्रमिक सहकारी", category: "Driver", rating: 4.6, dist: 2.6, distEn: "2.6 km away", distHi: "2.6 किमी दूर", jobs: 540, jobsEn: "540 jobs", jobsHi: "540 काम", expEn: "11 yrs exp", expHi: "11 वर्ष अनुभव", tags: [{ en: "Hourly", hi: "प्रति घंटा" }, { en: "Outstation", hi: "आउटस्टेशन" }], price: 349 },
  { initials: "LD", avatar: "linear-gradient(135deg,#38bdf8,#0284c7)", name: "Lakshmi Devi", roleEn: "Cleaner · Ranip Labour Co-op", roleHi: "सफाईकर्मी · रणिप श्रमिक सहकारी", category: "Cleaner", rating: 4.8, dist: 1.5, distEn: "1.5 km away", distHi: "1.5 किमी दूर", jobs: 390, jobsEn: "390 jobs", jobsHi: "390 काम", expEn: "7 yrs exp", expHi: "7 वर्ष अनुभव", tags: [{ en: "Deep clean", hi: "गहरी सफाई" }, { en: "Kitchen", hi: "रसोई" }, { en: "Bathroom", hi: "स्नानघर" }], price: 199 },
  { initials: "GT", avatar: "linear-gradient(135deg,#4ade80,#16a34a)", name: "Ganesh Thakor", roleEn: "Gardener · Chiloda Labour Co-op", roleHi: "माली · चिलोडा श्रमिक सहकारी", category: "Gardener", rating: 4.7, dist: 4.2, distEn: "4.2 km away", distHi: "4.2 किमी दूर", jobs: 150, jobsEn: "150 jobs", jobsHi: "150 काम", expEn: "10 yrs exp", expHi: "10 वर्ष अनुभव", tags: [{ en: "Lawn care", hi: "लॉन देखभाल" }, { en: "Landscaping", hi: "भू-दृश्य" }], price: 299 },
  { initials: "HM", avatar: "linear-gradient(135deg,#fb923c,#ea580c)", name: "Harish Makwana", roleEn: "AC Technician · Odhav Labour Co-op", roleHi: "एसी तकनीशियन · ओढव श्रमिक सहकारी", category: "Technician", rating: 4.9, dist: 3.0, distEn: "3.0 km away", distHi: "3.0 किमी दूर", jobs: 280, jobsEn: "280 jobs", jobsHi: "280 काम", expEn: "9 yrs exp", expHi: "9 वर्ष अनुभव", tags: [{ en: "AC service", hi: "एसी सर्विस" }, { en: "Appliances", hi: "उपकरण" }], price: 449 },
];

const CHIPS: Tag[] = [
  { en: "All", hi: "सभी" }, { en: "Electrician", hi: "इलेक्ट्रीशियन" }, { en: "Plumber", hi: "प्लंबर" },
  { en: "Carpenter", hi: "बढ़ई" }, { en: "Painter", hi: "पेंटर" }, { en: "Cleaner", hi: "सफाईकर्मी" },
  { en: "Caregiver", hi: "देखभालकर्ता" }, { en: "Driver", hi: "ड्राइवर" }, { en: "Gardener", hi: "माली" },
];

export default function ServicesPage() {
  const t = useT();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("nearest");

  const list = useMemo(() => {
    let out = WORKERS.filter((w) => filter === "All" || w.category === filter);
    const q = query.trim().toLowerCase();
    if (q) out = out.filter((w) => (w.name + " " + w.roleEn).toLowerCase().includes(q));
    out = [...out].sort((a, b) =>
      sort === "rating" ? b.rating - a.rating : sort === "price" ? a.price - b.price : a.dist - b.dist
    );
    return out;
  }, [filter, query, sort]);

  return (
    <>
      <Navbar />

      <header className="page-head">
        <div className="wrap">
          <div className="breadcrumb"><Link href="/"><T en="Home" hi="होम" /></Link> / <span><T en="Services" hi="सेवाएँ" /></span></div>
          <h1 className="balance"><T en="Find verified professionals near you" hi="अपने पास सत्यापित पेशेवर खोजें" /></h1>
          <p className="pretty"><T en="Geo-location matching connects you with the nearest available, background-checked and skill-certified workers from your local Labour Cooperative Society." hi="जियो-लोकेशन मिलान आपको आपकी स्थानीय श्रमिक सहकारी समिति के निकटतम उपलब्ध, सत्यापित और कौशल-प्रमाणित कार्यकर्ताओं से जोड़ता है।" /></p>
        </div>
      </header>

      <section className="section">
        <div className="wrap">
          {/* Geo banner */}
          <Reveal className="card" style={{ marginBottom: 22 }}>
            <div className="between wrap-flex">
              <div className="row">
                <span className="icon-chip"><PinIcon /></span>
                <div>
                  <div className="text-xs text-muted"><T en="Your location" hi="आपका स्थान" /></div>
                  <b><T en="Showing skilled workers near Sector 12, Gandhinagar" hi="सेक्टर 12, गांधीनगर के पास कुशल कार्यकर्ता दिखा रहे हैं" /></b>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                <T en="Change location" hi="स्थान बदलें" />
              </button>
            </div>
            <div className="map-box" style={{ marginTop: 18 }}>
              <div className="grid-lines" />
              <div className="map-pin pulse" style={{ top: "32%", left: "28%" }} />
              <div className="map-pin" style={{ top: "54%", left: "60%" }} />
              <div className="map-pin" style={{ top: "24%", left: "72%" }} />
              <div className="map-pin" style={{ top: "68%", left: "38%" }} />
              <div className="pill pill-primary" style={{ position: "relative", zIndex: 2 }}>
                <span className="dot" /> <span><T en="Live worker map — 18 available within 5 km" hi="लाइव कार्यकर्ता मानचित्र — 5 किमी में 18 उपलब्ध" /></span>
              </div>
            </div>
          </Reveal>

          {/* Search + sort */}
          <div className="filter-bar">
            <div className="search-box">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                <input className="input" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search a service or worker…", "कोई सेवा या कार्यकर्ता खोजें…")} aria-label="Search" />
              </div>
            </div>
            <select className="select" style={{ maxWidth: 220 }} aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="nearest">{t("Sort by: Nearest", "क्रमबद्ध करें: निकटतम")}</option>
              <option value="rating">{t("Sort by: Top rated", "क्रमबद्ध करें: शीर्ष रेटेड")}</option>
              <option value="price">{t("Sort by: Lowest price", "क्रमबद्ध करें: न्यूनतम कीमत")}</option>
            </select>
          </div>

          {/* Category chips */}
          <div className="filter-bar" style={{ marginBottom: 26 }}>
            {CHIPS.map((c) => (
              <span key={c.en} className={"chip" + (filter === c.en ? " active" : "")} style={{ cursor: "pointer" }} onClick={() => setFilter(c.en)}>
                <T en={c.en} hi={c.hi} />
              </span>
            ))}
          </div>

          {/* Worker grid */}
          <div className="grid grid-3">
            {list.map((w) => (
              <Reveal className="card card-hover worker-card" key={w.initials + w.name}>
                <div className="body">
                  <div className="head">
                    <span className="avatar" style={{ background: w.avatar }}>{w.initials}</span>
                    <div className="flex-1">
                      <h3>{w.name}</h3>
                      <div className="role"><T en={w.roleEn} hi={w.roleHi} /></div>
                    </div>
                  </div>
                  <div className="between">
                    <span className="verified"><CheckSm /> <span><T en="Verified" hi="सत्यापित" /></span></span>
                    <span className="rating"><StarIcon /> {w.rating.toFixed(1)}</span>
                  </div>
                  <div className="worker-meta">
                    <span className="m"><PinIcon /><span><T en={w.distEn} hi={w.distHi} /></span></span>
                    <span className="m"><JobsIcon /><span><T en={w.jobsEn} hi={w.jobsHi} /></span></span>
                    <span className="m"><ClockIcon /><span><T en={w.expEn} hi={w.expHi} /></span></span>
                  </div>
                  <div className="row wrap-flex gap-sm">
                    {w.tags.map((tag) => (
                      <span className="chip" key={tag.en}><T en={tag.en} hi={tag.hi} /></span>
                    ))}
                  </div>
                </div>
                <div className="foot">
                  <span className="price"><span className="text-muted text-sm"><T en="From" hi="से" /></span> <b>₹{w.price}</b></span>
                  <Link href="/booking" className="btn btn-primary btn-sm"><T en="Book Now" hi="बुक करें" /></Link>
                </div>
              </Reveal>
            ))}
            {list.length === 0 && (
              <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
                <T en="No workers match your search." hi="आपकी खोज से कोई कार्यकर्ता मेल नहीं खाता।" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="wrap">
          <Reveal className="cta-band">
            <h2 className="h-section"><T en="Can't find what you need?" hi="जो चाहिए वह नहीं मिला?" /></h2>
            <p><T en="Post a custom request and let your local cooperative society match the right professional for the job." hi="एक कस्टम अनुरोध पोस्ट करें और अपनी स्थानीय सहकारी समिति को सही पेशेवर से मिलान करने दें।" /></p>
            <div className="hero-cta" style={{ justifyContent: "center", position: "relative" }}>
              <Link href="/booking" className="btn btn-lg" style={{ background: "#fff", color: "var(--ink)" }}><T en="Post a custom request" hi="कस्टम अनुरोध पोस्ट करें" /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
