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
            <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" />
            <path d="M8.4 12l2.7 2.7 5.1-5.6" />
          </svg>
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
