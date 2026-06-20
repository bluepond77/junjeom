"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ChevronRight, Briefcase, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

type FollowUp = {
  key: string;
  due: string;
  title: string;
  subtitle: string;
  kind: "업무" | "개인";
  href: string;
};

type RecentItem = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
};

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

function formatMd(iso: string) {
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function Home() {
  const [displayName, setDisplayName] = useState("");
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [recentWork, setRecentWork] = useState<RecentItem[]>([]);
  const [recentPersonal, setRecentPersonal] = useState<RecentItem[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("id", userId)
        .single();

      const owner = profile?.role === "owner";
      setDisplayName(profile?.display_name ?? "");
      setIsOwner(owner);

      const { data: workData, error: workError } = await supabase
        .from("work_meetings")
        .select("id, occurred_at, content, follow_up, follow_up_due, contact:contacts(name)")
        .order("occurred_at", { ascending: false })
        .limit(5);

      const personalQuery = owner
        ? supabase
            .from("personal_meetings")
            .select("id, occurred_at, contact_name, follow_up, follow_up_due")
            .order("occurred_at", { ascending: false })
            .limit(5)
        : Promise.resolve({ data: [], error: null });

      const { data: personalData, error: personalError } = await personalQuery;

      if (workError || personalError) {
        setError("대시보드를 불러오지 못했어요.");
        setLoading(false);
        return;
      }

      type WorkRow = {
        id: string;
        occurred_at: string;
        content: string;
        follow_up: string | null;
        follow_up_due: string | null;
        contact: { name: string } | null;
      };
      type PersonalRow = {
        id: string;
        occurred_at: string;
        contact_name: string;
        follow_up: string | null;
        follow_up_due: string | null;
      };

      const work = (workData ?? []) as unknown as WorkRow[];
      const personal = (personalData ?? []) as PersonalRow[];

      const ups: FollowUp[] = [
        ...work
          .filter((m) => m.follow_up && m.follow_up_due)
          .map((m) => ({
            key: `work-${m.id}`,
            due: m.follow_up_due as string,
            title: m.contact?.name ?? "알 수 없음",
            subtitle: m.follow_up as string,
            kind: "업무" as const,
            href: "/work-meetings",
          })),
        ...personal
          .filter((m) => m.follow_up && m.follow_up_due)
          .map((m) => ({
            key: `personal-${m.id}`,
            due: m.follow_up_due as string,
            title: m.contact_name,
            subtitle: m.follow_up as string,
            kind: "개인" as const,
            href: `/personal-meetings/${m.id}`,
          })),
      ].sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

      setFollowUps(ups);

      setRecentWork(
        work.slice(0, 3).map((m) => ({
          id: m.id,
          title: m.content,
          subtitle: m.contact?.name ?? "알 수 없음",
          date: formatMd(m.occurred_at),
        }))
      );

      setRecentPersonal(
        personal.slice(0, 3).map((m) => ({
          id: m.id,
          title: m.contact_name,
          subtitle: "",
          date: formatMd(m.occurred_at),
        }))
      );

      setLoading(false);
    }

    load();
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            안녕하세요, {displayName}님
          </h1>
          <p className="mt-1 text-muted-foreground">오늘의 후속 작업을 확인하세요.</p>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border bg-muted px-5 py-3">
                <h2 className="font-semibold text-foreground">다가오는 후속작업</h2>
              </div>
              {followUps.length === 0 ? (
                <p className="px-5 py-8 text-center text-muted-foreground">
                  예정된 후속작업이 없어요.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {followUps.map((f) => (
                    <Link
                      key={f.key}
                      href={f.href}
                      className="flex items-center justify-between px-5 py-3 hover:bg-muted/60"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {formatShortDate(f.due)}
                          </span>
                          <span className="font-medium text-foreground">{f.title}</span>
                          <Badge variant="secondary">{f.kind}</Badge>
                        </div>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {f.subtitle}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <section className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 text-primary">
                  <Briefcase className="h-4 w-4" />
                  <h3 className="font-semibold text-foreground">최근 업무미팅</h3>
                </div>
                {recentWork.length === 0 ? (
                  <p className="text-sm text-muted-foreground">아직 등록된 업무미팅이 없어요.</p>
                ) : (
                  <div className="space-y-3">
                    {recentWork.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.subtitle}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">{r.title}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{r.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {isOwner && (
                <section className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-secondary-foreground">
                    <UserIcon className="h-4 w-4" />
                    <h3 className="font-semibold text-foreground">최근 개인미팅</h3>
                  </div>
                  {recentPersonal.length === 0 ? (
                    <p className="text-sm text-muted-foreground">아직 등록된 개인미팅이 없어요.</p>
                  ) : (
                    <div className="space-y-3">
                      {recentPersonal.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                        >
                          <p className="text-sm font-medium text-foreground">{r.title}</p>
                          <span className="text-xs text-muted-foreground">{r.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
