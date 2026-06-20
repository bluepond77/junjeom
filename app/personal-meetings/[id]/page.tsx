"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  PersonalMeetingForm,
  type PersonalMeetingData,
} from "@/components/personal-meeting-form";
import { supabase } from "@/lib/supabase";

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function PersonalMeetingDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<PersonalMeetingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data: row, error } = await supabase
        .from("personal_meetings")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !row) {
        setError("미팅 정보를 불러오지 못했어요.");
        setLoading(false);
        return;
      }

      setData({
        contact_name: row.contact_name ?? "",
        occurred_at: toDatetimeLocal(row.occurred_at),
        family_info: row.family_info ?? "",
        birthday: row.birthday ?? "",
        baptismal_name: row.baptismal_name ?? "",
        religion: row.religion ?? "",
        health_notes: row.health_notes ?? "",
        recent_joy: row.recent_joy ?? "",
        values_notes: row.values_notes ?? "",
        follow_up: row.follow_up ?? "",
        follow_up_due: row.follow_up_due ?? "",
      });
      setLoading(false);
    }

    load();
  }, [params.id]);

  return (
    <AppShell requireOwner>
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {!loading && error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && data && (
        <PersonalMeetingForm meetingId={params.id} initial={data} />
      )}
    </AppShell>
  );
}
