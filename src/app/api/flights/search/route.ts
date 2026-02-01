import { NextResponse } from "next/server";

async function getToken(req: Request) {
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;
  const resp = await fetch(`${origin}/api/amadeus/token`, { method: "POST" });

  if (!resp.ok) {
    const details = await resp.text();
    console.error("Token request failed:", details);
    return null;
  }

  return (await resp.json()) as { access_token: string };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const originCode = (searchParams.get("origin") ?? "").trim().toUpperCase();
    const destinationCode = (searchParams.get("destination") ?? "")
      .trim()
      .toUpperCase();

    const departureDate = (searchParams.get("departureDate") ?? "").trim();
    const returnDate = (searchParams.get("returnDate") ?? "").trim();
    const adults = (searchParams.get("adults") ?? "1").trim();

    if (!originCode || !destinationCode || !departureDate || !adults) {
      return NextResponse.json(
        { error: "Missing required params" },
        { status: 400 },
      );
    }

    const token = await getToken(req);
    if (!token?.access_token) {
      return NextResponse.json(
        { error: "Failed to authorize with Amadeus" },
        { status: 500 },
      );
    }

    const baseUrl =
      process.env.AMADEUS_BASE_URL ?? "https://test.api.amadeus.com";

    const params = new URLSearchParams({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate,
      adults,
      max: "50",
    });

    if (returnDate) params.set("returnDate", returnDate);

    const resp = await fetch(
      `${baseUrl}/v2/shopping/flight-offers?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      },
    );

    const text = await resp.text();

    if (!resp.ok) {
      console.error("Amadeus flight-offers error:", text);
      return NextResponse.json(
        { error: "Failed to fetch flight offers" },
        { status: resp.status },
      );
    }

    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Flight search route failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch flight offers" },
      { status: 500 },
    );
  }
}
