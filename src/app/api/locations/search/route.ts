import { NextResponse } from "next/server";

async function getToken(req: Request) {
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;
  const resp = await fetch(`${origin}/api/amadeus/token`, { method: "POST" });

  if (!resp.ok) {
    throw new Error("Token request failed");
  }

  return (await resp.json()) as { access_token: string };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    if (q.length < 2) {
      return NextResponse.json({ data: [] });
    }

    const baseUrl =
      process.env.AMADEUS_BASE_URL ?? "https://test.api.amadeus.com";

    const { access_token } = await getToken(req);

    const amadeusParams = new URLSearchParams({
      keyword: q,
      subType: "CITY,AIRPORT",
    });

    const resp = await fetch(
      `${baseUrl}/v1/reference-data/locations?${amadeusParams}`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    if (!resp.ok) {
      console.error("Amadeus error:", await resp.text());

      return NextResponse.json(
        { error: "Failed to load airports" },
        { status: 500 },
      );
    }

    const json = await resp.json();

    const mapped = (json?.data ?? []).map((x: any) => ({
      id: x.id,
      subType: x.subType,
      code: x.iataCode ?? "",
      name: x.name ?? "",
      city: x.address?.cityName ?? "",
      countryCode: x.address?.countryCode ?? "",
    }));

    const filtered = mapped.filter((m: any) => m.code && m.code.length === 3);

    return NextResponse.json({ data: filtered });
  } catch (err) {
    console.error("Location search failed:", err);

    return NextResponse.json(
      { error: "Failed to load airports" },
      { status: 500 },
    );
  }
}
