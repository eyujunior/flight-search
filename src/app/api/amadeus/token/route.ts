import { NextResponse } from "next/server";

let cached: { token: string; expiresAt: number } | null = null;

export async function POST() {
  const now = Date.now();

  if (cached && cached.expiresAt > now + 10_000) {
    return NextResponse.json({ access_token: cached.token });
  }

  const baseUrl =
    process.env.AMADEUS_BASE_URL ?? "https://test.api.amadeus.com";
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error: "missing_env",
        message:
          "Set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET in .env.local",
      },
      { status: 500 },
    );
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const resp = await fetch(`${baseUrl}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = await resp.text();

  if (!resp.ok) {
    return NextResponse.json(
      { error: "token_failed", details: text },
      { status: resp.status },
    );
  }

  const data = JSON.parse(text) as { access_token: string; expires_in: number };

  cached = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return NextResponse.json({ access_token: data.access_token });
}
