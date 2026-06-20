import { NextRequest, NextResponse } from "next/server";
import { createFollowUpEvent } from "@/lib/google-calendar";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { meetingType, meetingId, summary, description, dueDate } = body as {
    meetingType: "work" | "personal";
    meetingId: string;
    summary: string;
    description: string;
    dueDate: string;
  };

  if (!meetingType || !meetingId || !summary || !dueDate) {
    return NextResponse.json({ error: "필수 정보가 없어요." }, { status: 400 });
  }

  const eventId = await createFollowUpEvent({ summary, description, dueDate });

  if (!eventId) {
    return NextResponse.json(
      { error: "구글 캘린더에 연결돼 있지 않거나 이벤트 생성에 실패했어요." },
      { status: 422 }
    );
  }

  const table = meetingType === "work" ? "work_meetings" : "personal_meetings";
  await supabaseAdmin.from(table).update({ calendar_event_id: eventId }).eq("id", meetingId);

  return NextResponse.json({ eventId });
}
