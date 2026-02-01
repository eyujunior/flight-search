import type { FlightCardVM } from "@/components/FlightCard";

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function toOfferCards(amadeusJson: any): FlightCardVM[] {
  const offers = amadeusJson?.data ?? [];

  return offers
    .map((o: any): FlightCardVM | null => {
      const itineraries = o?.itineraries ?? [];
      const outbound = itineraries[0];
      const segments = outbound?.segments ?? [];

      if (!outbound || segments.length === 0) return null;

      const firstSeg = segments[0];
      const lastSeg = segments[segments.length - 1];

      const fromIata = firstSeg?.departure?.iataCode ?? "";
      const toIata = lastSeg?.arrival?.iataCode ?? "";

      const stopIatas =
        segments.length <= 1
          ? []
          : segments
              .slice(0, -1)
              .map((s: any) => s?.arrival?.iataCode)
              .filter(Boolean);

      const airlineCodes =
        (o?.validatingAirlineCodes?.length
          ? o.validatingAirlineCodes
          : uniq(segments.map((s: any) => s?.carrierCode).filter(Boolean))) ??
        [];

      const currency = o?.price?.currency ?? "";
      const priceStr = o?.price?.grandTotal ?? o?.price?.total ?? "0";
      const priceTotal = Number(priceStr);

      return {
        id: String(o?.id ?? crypto.randomUUID()),
        airlineCodes,
        currency,
        priceTotal: Number.isFinite(priceTotal) ? priceTotal : 0,
        stops: Math.max(0, segments.length - 1),

        // ISO strings
        departAt: firstSeg?.departure?.at ?? "",
        arriveAt: lastSeg?.arrival?.at ?? "",

        // ISO duration like "PT6H6M"
        duration: outbound?.duration ?? "",

        // New fields for tooltip
        fromIata,
        toIata,
        stopIatas,
      };
    })
    .filter(Boolean) as FlightCardVM[];
}
