"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/providers";
import { LoaderScreen } from "@/components/site/AppLoader";

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

  // brief branded loader while we read the session / redirect Home → dashboard.
  // Reuses the boot loader's look so the two never appear as separate screens.
  if (!ready || !session || (session && isHome)) {
    return <LoaderScreen />;
  }

  return <>{children}</>;
}
