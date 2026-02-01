"use client";

import { useQuery } from "@tanstack/react-query";

export type LocationOption = {
  id: string;
  subType: "CITY" | "AIRPORT";
  code: string;
  name: string;
  city: string;
  countryCode: string;
};

async function fetchLocations(q: string) {
  const resp = await fetch(`/api/locations/search?q=${encodeURIComponent(q)}`);
  if (!resp.ok) throw new Error(await resp.text());
  const json = (await resp.json()) as { data: LocationOption[] };
  return json.data;
}

export function useLocations(q: string) {
  return useQuery({
    queryKey: ["locations", q],
    queryFn: () => fetchLocations(q),
    enabled: q.trim().length >= 2,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
