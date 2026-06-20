import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const { data: owner } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("role", "owner")
    .single();

  if (!owner) {
    return NextResponse.json({ error: "오너 계정을 찾을 수 없어요." }, { status: 404 });
  }

  const redirectUri = `${new URL(request.url).origin}/api/auth/callback/google`;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/calendar",
    access_type: "offline",
    prompt: "consent",
    state: owner.id,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
