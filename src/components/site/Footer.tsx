"use client";
import Link from "next/link";
import { BrandMark } from "./Navbar";
import { T } from "@/lib/providers";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand">
              <BrandMark />
              <span>
                AeviWork<small>Sahkar se Samriddhi</small>
              </span>
            </Link>
            <p className="desc">
              <T
                en="A cooperative-owned digital service marketplace connecting verified Labour Cooperative Society workers with households and institutions — fair wages, worker welfare, and consumer trust, by design."
                hi="सत्यापित श्रमिक सहकारी समिति कार्यकर्ताओं को घरों और संस्थानों से जोड़ने वाला सहकारी स्वामित्व वाला डिजिटल सेवा बाज़ार — उचित वेतन, कार्यकर्ता कल्याण और उपभोक्ता विश्वास।"
              />
            </p>
            <div className="row mt-2" style={{ gap: 10 }}>
              <span className="pill pill-primary"><span className="dot" /> Ministry of Cooperation</span>
              <span className="pill pill-info"><span className="dot" /> NCCT Initiative</span>
            </div>
          </div>
          <div>
            <h4><T en="Platform" hi="प्लेटफ़ॉर्म" /></h4>
            <Link href="/services"><T en="Browse Services" hi="सेवाएँ देखें" /></Link>
            <Link href="/booking"><T en="Book a Service" hi="सेवा बुक करें" /></Link>
            <Link href="/booking"><T en="Emergency Booking" hi="आपातकालीन बुकिंग" /></Link>
            <Link href="/services"><T en="Geo Matching" hi="जियो मैचिंग" /></Link>
          </div>
          <div>
            <h4><T en="For Workers" hi="कार्यकर्ताओं हेतु" /></h4>
            <Link href="/register"><T en="Join the Cooperative" hi="सहकारी में शामिल हों" /></Link>
            <Link href="/register"><T en="Skill Certification" hi="कौशल प्रमाणन" /></Link>
            <Link href="/dashboard-worker"><T en="Worker Dashboard" hi="कार्यकर्ता डैशबोर्ड" /></Link>
            <Link href="/dashboard-worker"><T en="Welfare & Insurance" hi="कल्याण व बीमा" /></Link>
          </div>
          <div>
            <h4><T en="Cooperative" hi="सहकारी" /></h4>
            <Link href="/dashboard-admin"><T en="Federation Dashboard" hi="फेडरेशन डैशबोर्ड" /></Link>
            <Link href="/aevinite"><T en="Super Admin Console" hi="सुपर एडमिन कंसोल" /></Link>
            <Link href="/dashboard-admin"><T en="Demand Forecasting" hi="मांग पूर्वानुमान" /></Link>
            <Link href="/login"><T en="Contact & Support" hi="संपर्क व सहायता" /></Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AeviWork · Built for Smart India Hackathon · PS 26089</span>
          <span>Cooperative Gig Services Platform · Made with cooperative spirit</span>
        </div>
      </div>
    </footer>
  );
}
