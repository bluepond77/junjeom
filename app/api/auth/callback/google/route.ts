import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const ownerId = url.searchParams.get("state");

  if (!code || !ownerId) {
    return NextResponse.redirect(`${url.origin}/?calendar=error`);
  }

  const redirectUri = `${url.origin}/api/auth/callback/google`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || !tokenData.refresh_token) {
    return NextResponse.redirect(`${url.origin}/?calendar=error`);
  }

  await supabaseAdmin
    .from("google_tokens")
    .upsert({ owner_id: ownerId, refresh_token: tokenData.refresh_token });

  return NextResponse.redirect(`${url.origin}/?calendar=connected`);
}
