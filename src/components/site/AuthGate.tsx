"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/providers";

/** Gates the whole site: unauthenticated visitors always land on /login. */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = ["/login", "/login/", "/signup", "/signup/"].includes(pathname);
  const isHome = pathname === "/";
  const dashFor = (role: string) =>
    role === "worker" ? "/dashboard-worker"
    : role === "federation" ? "/dashboard-admin"
    : role === "superadmin" ? "/aevinite"
    : "/dashboard-customer";

  useEffect(() => {
    if (!ready) return;
    if (!session && !isPublic) { router.replace("/login"); return; }
    // logged-in users get their app (marketplace/dashboard) as "Home", not the marketing page
    if (session && isHome) router.replace(dashFor(session.role));
  }, [ready, session, isPublic, isHome, router]);

  // public auth pages always render (and prerender their content)
  if (isPublic) return <>{children}</>;

  // brief branded loader while we read the session / redirect Home → dashboard
  if (!ready || !session || (session && isHome)) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--background)" }}>
        <span className="brand-mark" style={{ width: 60, height: 60, animation: "viewIn .5s ease" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 34, height: 34 }}>
            <path d="M12 2.5 4.7 5.9v5.6c0 4.8 3.2 7.9 7.3 9.9 4.1-2 7.3-5.1 7.3-9.9V5.9z" />
            <path d="M8.5 12.3l2.6 2.6 4.7-5.2" />
          </svg>
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
