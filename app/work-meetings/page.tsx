"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Loader2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  CalendarSync,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

type WorkMeeting = {
  id: string;
  occurred_at: string;
  content: string;
  follow_up: string | null;
  follow_up_due: string | null;
  contact: { id: string; name: string; type: string } | null;
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function dDay(due: string | null) {
  if (!due) return null;
  const diff = Math.ceil(
    (new Date(due).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000
  );
  if (diff < 0) return { label: "기한 지남", overdue: true };
  if (diff === 0) return { label: "D-Day", overdue: false };
  return { label: `D-${diff}`, overdue: false };
}

export default function WorkMeetingsPage() {
  const [meetings, setMeetings] = useState<WorkMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [content, setContent] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [followUpDue, setFollowUpDue] = useState("");
  const [syncToCalendar, setSyncToCalendar] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function loadMeetings() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("work_meetings")
      .select("id, occurred_at, content, follow_up, follow_up_due, contact:contacts(id, name, type)")
      .order("occurred_at", { ascending: false });

    if (error) {
      setError("미팅 목록을 불러오지 못했어요.");
      setLoading(false);
      return;
    }

    setMeetings((data ?? []) as unknown as WorkMeeting[]);
    setLoading(false);
  }

  useEffect(() => {
    loadMeetings();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setSubmitError("로그인 정보를 확인할 수 없어요.");
      setSubmitting(false);
      return;
    }

    let contactId: string;
    const { data: existing } = await supabase
      .from("contacts")
      .select("id")
      .eq("name", contactName)
      .maybeSingle();

    if (existing) {
      contactId = existing.id;
    } else {
      const { data: newContact, error: contactError } = await supabase
        .from("contacts")
        .insert({ name: contactName, type: "기부자", created_by: userId })
        .select("id")
        .single();

      if (contactError || !newContact) {
        setSubmitError("대상자를 저장하지 못했어요.");
        setSubmitting(false);
        return;
      }
      contactId = newContact.id;
    }

    const { data: newMeeting, error: meetingError } = await supabase
      .from("work_meetings")
      .insert({
        contact_id: contactId,
        occurred_at: new Date(occurredAt).toISOString(),
        content,
        follow_up: followUp || null,
        follow_up_due: followUpDue || null,
        created_by: userId,
      })
      .select("id")
      .single();

    if (meetingError || !newMeeting) {
      setSubmitError("미팅을 저장하지 못했어요.");
      setSubmitting(false);
      return;
    }

    if (syncToCalendar && followUp && followUpDue) {
      await fetch("/api/calendar/create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingType: "work",
          meetingId: newMeeting.id,
          summary: `[업무] ${contactName} - 후속작업`,
          description: followUp,
          dueDate: followUpDue,
        }),
      });
    }

    setSubmitting(false);
    setDialogOpen(false);
    setContactName("");
    setOccurredAt("");
    setContent("");
    setFollowUp("");
    setFollowUpDue("");
    loadMeetings();
  }

  const filtered = meetings.filter((m) =>
    m.contact?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">업무미팅</h1>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            새 미팅 작성
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

        <div className="mt-6 space-y-3">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              아직 등록된 업무미팅이 없어요.
            </p>
          )}

          {!loading &&
            !error &&
            filtered.map((meeting) => {
              const expanded = expandedId === meeting.id;
              const due = dDay(meeting.follow_up_due);
              return (
                <div
                  key={meeting.id}
                  className="rounded-xl border border-border bg-card shadow-sm"
                >
                  <button
                    className="flex w-full items-center justify-between p-4 text-left"
                    onClick={() => setExpandedId(expanded ? null : meeting.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {meeting.contact?.name ?? "알 수 없음"}
                        </h3>
                        <Badge variant="secondary">업무</Badge>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDateTime(meeting.occurred_at)}
                      </p>
                      {!expanded && (
                        <p className="mt-1 max-w-md truncate text-sm text-muted-foreground">
                          {meeting.content}
                        </p>
                      )}
                    </div>
                    {expanded ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                  </button>

                  {expanded && (
                    <div className="space-y-4 border-t border-border p-4 pt-4">
                      <div>
                        <Label className="text-xs uppercase text-muted-foreground">
                          내용 요약
                        </Label>
                        <p className="mt-1 rounded-lg bg-muted p-3 text-sm leading-relaxed text-foreground">
                          {meeting.content}
                        </p>
                      </div>

                      {meeting.follow_up && (
                        <div className="rounded-lg border border-secondary bg-secondary/40 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <Label className="flex items-center gap-1.5 text-sm font-bold">
                              <ClipboardCheck className="h-4 w-4" />
                              후속작업
                            </Label>
                            {due && (
                              <Badge variant={due.overdue ? "destructive" : "default"}>
                                {due.label}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground">{meeting.follow_up}</p>
                        </div>
                      )}

                      {meeting.contact && (
                        <Link
                          href={`/work-meetings/contacts/${meeting.contact.id}`}
                          className="text-sm font-medium text-[#66cc00] hover:underline"
                        >
                          {meeting.contact.name} 님과의 히스토리 보기 →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 업무미팅 작성</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="space-y-2">
              <Label htmlFor="contactName">대상자</Label>
              <Input
                id="contactName"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="예: 김후원"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occurredAt">일시</Label>
              <Input
                id="occurredAt"
                type="datetime-local"
                required
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="미팅 주요 내용을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followUp">후속작업 (선택)</Label>
              <Textarea
                id="followUp"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="해야 할 후속작업이 있다면 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followUpDue">후속작업 마감일 (선택)</Label>
              <Input
                id="followUpDue"
                type="date"
                value={followUpDue}
                onChange={(e) => setFollowUpDue(e.target.value)}
              />
            </div>

            {followUp && followUpDue && (
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label htmlFor="syncToCalendar" className="flex items-center gap-2">
                  <CalendarSync className="h-4 w-4 text-primary" />
                  캘린더에 자동 등록
                </Label>
                <Switch
                  id="syncToCalendar"
                  checked={syncToCalendar}
                  onCheckedChange={setSyncToCalendar}
                />
              </div>
            )}

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <DialogFooter>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
