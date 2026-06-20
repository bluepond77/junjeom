"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

type PersonCard = {
  id: string;
  contact_name: string;
  occurred_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PersonalMeetingsPage() {
  const [people, setPeople] = useState<PersonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("personal_meetings")
        .select("id, contact_name, occurred_at")
        .order("occurred_at", { ascending: false });

      if (error) {
        setError("개인미팅 목록을 불러오지 못했어요.");
        setLoading(false);
        return;
      }

      const latestByPerson = new Map<string, PersonCard>();
      for (const row of data ?? []) {
        if (!latestByPerson.has(row.contact_name)) {
          latestByPerson.set(row.contact_name, row);
        }
      }

      setPeople(Array.from(latestByPerson.values()));
      setLoading(false);
    }

    load();
  }, []);

  const filtered = people.filter((p) =>
    p.contact_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell requireOwner>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">개인미팅</h1>
          <Button asChild>
            <Link href="/personal-meetings/new">
              <Plus className="h-4 w-4" />
              새 미팅 작성
            </Link>
          </Button>
        </div>

        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="대상자로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {loading && (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && error && (
            <p className="col-span-full text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-muted-foreground">
              아직 등록된 개인미팅이 없어요.
            </p>
          )}

          {!loading &&
            !error &&
            filtered.map((p) => (
              <Link
                key={p.id}
                href={`/personal-meetings/${p.id}`}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <UserIcon className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{p.contact_name}</h3>
                    <Badge variant="secondary">개인</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    최근 미팅: {formatDate(p.occurred_at)}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </AppShell>
  );
}
