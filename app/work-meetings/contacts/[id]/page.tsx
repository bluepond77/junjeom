"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

type Contact = { id: string; name: string; type: string };
type Meeting = {
  id: string;
  occurred_at: string;
  content: string;
  follow_up: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ContactHistoryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const [{ data: contactData, error: contactError }, { data: meetingData, error: meetingError }] =
        await Promise.all([
          supabase.from("contacts").select("id, name, type").eq("id", params.id).single(),
          supabase
            .from("work_meetings")
            .select("id, occurred_at, content, follow_up")
            .eq("contact_id", params.id)
            .order("occurred_at", { ascending: false }),
        ]);

      if (contactError || meetingError) {
        setError("히스토리를 불러오지 못했어요.");
        setLoading(false);
        return;
      }

      setContact(contactData);
      setMeetings(meetingData ?? []);
      setLoading(false);
    }

    load();
  }, [params.id]);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </button>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && contact && (
          <>
            <div className="mb-8 flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{contact.name} 님</h1>
              <Badge variant="secondary">{contact.type}</Badge>
            </div>

            <h2 className="mb-4 text-lg font-semibold text-foreground">접점 히스토리</h2>

            {meetings.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">
                아직 기록된 미팅이 없어요.
              </p>
            ) : (
              <div className="relative space-y-6 border-l-2 border-border pl-6">
                {meetings.map((m) => (
                  <div key={m.id} className="relative">
                    <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10" />
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(m.occurred_at)}
                        </span>
                        <Badge variant="secondary">업무</Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">{m.content}</p>
                      {m.follow_up && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          후속작업: {m.follow_up}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
