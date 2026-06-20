import { supabaseAdmin } from "@/lib/supabase-admin";

async function getOwnerAccessToken(): Promise<string | null> {
  const { data: owner } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("role", "owner")
    .single();

  if (!owner) return null;

  const { data: tokenRow } = await supabaseAdmin
    .from("google_tokens")
    .select("refresh_token")
    .eq("owner_id", owner.id)
    .maybeSingle();

  if (!tokenRow) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: tokenRow.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!res.ok) return null;
  return data.access_token as string;
}

export async function isCalendarConnected(): Promise<boolean> {
  const { data: owner } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("role", "owner")
    .single();

  if (!owner) return false;

  const { data } = await supabaseAdmin
    .from("google_tokens")
    .select("owner_id")
    .eq("owner_id", owner.id)
    .maybeSingle();

  return !!data;
}

export async function createFollowUpEvent(params: {
  summary: string;
  description: string;
  dueDate: string;
}): Promise<string | null> {
  const accessToken = await getOwnerAccessToken();
  if (!accessToken) return null;

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: params.summary,
        description: params.description,
        start: { date: params.dueDate },
        end: { date: params.dueDate },
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) return null;
  return data.id as string;
}
