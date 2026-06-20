"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Briefcase, User, LogOut, Loader2, CalendarCheck, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Profile = {
  display_name: string;
  role: "owner" | "colleague";
};

export function AppShell({
  children,
  requireOwner = false,
}: {
  children: React.ReactNode;
  requireOwner?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("id", user.id)
        .single();

      if (requireOwner && data?.role !== "owner") {
        router.replace("/");
        return;
      }

      if (active) {
        setProfile(data as Profile);
        setLoading(false);
      }

      if (data?.role === "owner") {
        const res = await fetch("/api/calendar/status");
        const status = await res.json();
        if (active) setCalendarConnected(!!status.connected);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [router, requireOwner]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const navItems = [
    { href: "/", label: "홈", icon: Home },
    { href: "/work-meetings", label: "업무미팅", icon: Briefcase },
    ...(profile.role === "owner"
      ? [{ href: "/personal-meetings", label: "개인미팅", icon: User }]
      : []),
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-56 flex-col border-r border-border bg-sidebar p-4">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-primary">접점</h1>
          <p className="mt-1 text-xs text-muted-foreground">{profile.display_name}</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "border-l-4 border-primary bg-secondary font-medium text-foreground"
                    : "border-l-4 border-transparent text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {profile.role === "owner" && (
          <a
            href="/api/auth/google/start"
            className={`mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              calendarConnected
                ? "text-muted-foreground"
                : "text-primary hover:bg-secondary"
            }`}
          >
            {calendarConnected ? (
              <>
                <CalendarCheck className="h-4 w-4" />
                캘린더 연결됨
              </>
            ) : (
              <>
                <CalendarPlus className="h-4 w-4" />
                구글 캘린더 연결
              </>
            )}
          </a>
        )}

        <Button variant="ghost" className="justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
