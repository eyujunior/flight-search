"use client";

import { useQuery } from "@tanstack/react-query";

export type FlightSearchParams = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
};

async function fetchFlightOffers(p: FlightSearchParams) {
  const qs = new URLSearchParams({
    origin: p.origin,
    destination: p.destination,
    departureDate: p.departureDate,
    adults: String(p.adults),
  });

  if (p.returnDate) qs.set("returnDate", p.returnDate);

  const resp = await fetch(`/api/flights/search?${qs.toString()}`);
  const json = await resp.json().catch(() => null);

  if (!resp.ok) {
    const msg =
      (json && (json.error || json.message)) || "Failed to fetch flight offers";
    throw new Error(msg);
  }

  return json;
}

export function useFlightOffers(
  params: FlightSearchParams | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["flightOffers", params],
    queryFn: () => {
      if (!params) throw new Error("Missing params");
      return fetchFlightOffers(params);
    },
    enabled: enabled && !!params,
    staleTime: 60_000,
    retry: 1,
  });
}
