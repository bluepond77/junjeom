"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Info, HeartHandshake, StickyNote, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

export type PersonalMeetingData = {
  contact_name: string;
  occurred_at: string;
  family_info: string;
  birthday: string;
  baptismal_name: string;
  religion: string;
  health_notes: string;
  recent_joy: string;
  values_notes: string;
  follow_up: string;
  follow_up_due: string;
};

const EMPTY: PersonalMeetingData = {
  contact_name: "",
  occurred_at: "",
  family_info: "",
  birthday: "",
  baptismal_name: "",
  religion: "",
  health_notes: "",
  recent_joy: "",
  values_notes: "",
  follow_up: "",
  follow_up_due: "",
};

export function PersonalMeetingForm({
  meetingId,
  initial,
}: {
  meetingId?: string;
  initial?: PersonalMeetingData;
}) {
  const router = useRouter();
  const [form, setForm] = useState<PersonalMeetingData>(initial ?? EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof PersonalMeetingData>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);

    const payload = {
      contact_name: form.contact_name,
      occurred_at: new Date(form.occurred_at).toISOString(),
      family_info: form.family_info || null,
      birthday: form.birthday || null,
      baptismal_name: form.baptismal_name || null,
      religion: form.religion || null,
      health_notes: form.health_notes || null,
      recent_joy: form.recent_joy || null,
      values_notes: form.values_notes || null,
      follow_up: form.follow_up || null,
      follow_up_due: form.follow_up_due || null,
    };

    if (meetingId) {
      const { error } = await supabase
        .from("personal_meetings")
        .update(payload)
        .eq("id", meetingId);

      if (error) {
        setError("저장하지 못했어요.");
        setSubmitting(false);
        return;
      }
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const ownerId = userData.user?.id;
      if (!ownerId) {
        setError("로그인 정보를 확인할 수 없어요.");
        setSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from("personal_meetings")
        .insert({ ...payload, owner_id: ownerId })
        .select("id")
        .single();

      if (error || !data) {
        setError("저장하지 못했어요.");
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      router.push(`/personal-meetings/${data.id}`);
      return;
    }

    setSubmitting(false);
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로
      </button>

      <h1 className="mb-6 text-2xl font-bold text-foreground">
        {form.contact_name ? `${form.contact_name} 님` : "새 개인미팅 작성"}
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <Info className="h-4 w-4" />
            <h2 className="text-xs font-bold uppercase tracking-wider">기본 정보</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="occurred_at">일시</Label>
              <Input
                id="occurred_at"
                type="datetime-local"
                required
                value={form.occurred_at}
                onChange={(e) => set("occurred_at", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_name">대상자</Label>
              <Input
                id="contact_name"
                required
                placeholder="이름 입력"
                value={form.contact_name}
                onChange={(e) => set("contact_name", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <HeartHandshake className="h-4 w-4" />
            <h2 className="text-xs font-bold uppercase tracking-wider">가족관계</h2>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="family_info">배우자·자녀 이름 등</Label>
            <Textarea
              id="family_info"
              placeholder="예: 배우자 김OO, 자녀 김OO(10), 김OO(8)"
              value={form.family_info}
              onChange={(e) => set("family_info", e.target.value)}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">기타 정보</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="birthday">생일</Label>
              <Input
                id="birthday"
                type="date"
                value={form.birthday}
                onChange={(e) => set("birthday", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="baptismal_name">세례명</Label>
              <Input
                id="baptismal_name"
                placeholder="세례명 입력"
                value={form.baptismal_name}
                onChange={(e) => set("baptismal_name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="religion">종교</Label>
              <Select value={form.religion} onValueChange={(v) => set("religion", v)}>
                <SelectTrigger id="religion" className="w-full">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="기독교">기독교</SelectItem>
                  <SelectItem value="천주교">천주교</SelectItem>
                  <SelectItem value="불교">불교</SelectItem>
                  <SelectItem value="무교">무교</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1 text-primary">
            <StickyNote className="h-4 w-4" />
            <h2 className="text-xs font-bold uppercase tracking-wider">상세 로그</h2>
          </div>
          <div className="space-y-1.5 rounded-xl border border-border bg-card p-5 shadow-sm">
            <Label htmlFor="health_notes" className="font-bold uppercase tracking-wide text-primary">
              건강이슈
            </Label>
            <Textarea
              id="health_notes"
              placeholder="최근 건강 상태나 유의사항을 기록하세요..."
              value={form.health_notes}
              onChange={(e) => set("health_notes", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1.5 rounded-xl border border-border bg-card p-5 shadow-sm">
              <Label htmlFor="recent_joy" className="font-bold uppercase tracking-wide">
                최근 기쁜 일
              </Label>
              <Textarea
                id="recent_joy"
                placeholder="축하할 만한 최근 소식..."
                value={form.recent_joy}
                onChange={(e) => set("recent_joy", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 rounded-xl border border-border bg-card p-5 shadow-sm">
              <Label htmlFor="values_notes" className="font-bold uppercase tracking-wide">
                중요 가치/말
              </Label>
              <Textarea
                id="values_notes"
                placeholder="대화 중 강조한 생각이나 가치관..."
                value={form.values_notes}
                onChange={(e) => set("values_notes", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-secondary bg-secondary/20 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <ClipboardCheck className="h-4 w-4" />
            <h2 className="text-xs font-bold uppercase tracking-wider">후속작업</h2>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="follow_up">내용 (선택)</Label>
            <Input
              id="follow_up"
              placeholder="다음 방문이나 연락 예정 업무 입력"
              value={form.follow_up}
              onChange={(e) => set("follow_up", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="follow_up_due">마감일 (선택)</Label>
            <Input
              id="follow_up_due"
              type="date"
              value={form.follow_up_due}
              onChange={(e) => set("follow_up_due", e.target.value)}
            />
          </div>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-primary">저장됐어요.</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4" />
              저장하기
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
