"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/providers";

/** Gates the whole site: unauthenticated visitors always land on /login. */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login" || pathname === "/login/";

  useEffect(() => {
    if (ready && !session && !isLogin) router.replace("/login");
  }, [ready, session, isLogin, router]);

  // brief branded loader while we read the session (avoids landing-page flash)
  if (!ready || (!session && !isLogin)) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--background)" }}>
        <span className="brand-mark" style={{ width: 60, height: 60, animation: "viewIn .5s ease" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 34, height: 34 }}>
            <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
