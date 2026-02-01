"use client";

import * as React from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Grid,
  Typography,
} from "@mui/material";

import type { FlightSearchParams } from "@/hooks/useFlightOffers";
import { useFlightOffers } from "@/hooks/useFlightOffers";
import { toOfferCards } from "@/hooks/transformOffers";
import FlightCard from "@/components/FlightCard";
import FlightFilters, {
  type FlightFiltersState,
} from "@/components/FlightFilters";
import PriceGraph from "./Pricegraph";

export default function FlightResults({
  params,
  enabled,
}: {
  params: FlightSearchParams | null;
  enabled: boolean;
}) {
  const q = useFlightOffers(params, enabled);

  const cards = React.useMemo(() => toOfferCards(q.data), [q.data]);

  const currency = cards[0]?.currency ?? "USD";

  const priceBounds = React.useMemo<[number, number]>(() => {
    if (!cards.length) return [0, 0];
    let min = Infinity;
    let max = -Infinity;
    for (const c of cards) {
      if (c.priceTotal < min) min = c.priceTotal;
      if (c.priceTotal > max) max = c.priceTotal;
    }
    return [Math.floor(min), Math.ceil(max)];
  }, [cards]);

  const airlinesOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const c of cards) {
      for (const a of c.airlineCodes) set.add(a);
    }
    return Array.from(set).sort();
  }, [cards]);

  const [filters, setFilters] = React.useState<FlightFiltersState>({
    stops: "any",
    priceRange: [0, 0],
    airlines: [],
  });

  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: priceBounds,
    }));
  }, [priceBounds[0], priceBounds[1]]);

  const filteredCards = React.useMemo(() => {
    if (!cards.length) return [];
    const [minP, maxP] = filters.priceRange;

    return cards.filter((c) => {
      // Stops
      if (filters.stops === "0" && c.stops !== 0) return false;
      if (filters.stops === "1" && c.stops !== 1) return false;
      if (filters.stops === "2+" && c.stops < 2) return false;

      // Price
      if (c.priceTotal < minP || c.priceTotal > maxP) return false;

      // Airlines (match ANY selected)
      if (filters.airlines.length > 0) {
        const has = filters.airlines.some((a) => c.airlineCodes.includes(a));
        if (!has) return false;
      }

      return true;
    });
  }, [cards, filters]);

  if (!enabled) return null;

  if (q.isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}>
        <CircularProgress size={22} />
        <Typography color="text.secondary">Searching flights…</Typography>
      </Box>
    );
  }

  if (q.isError) {
    return (
      <Alert severity="error">
        {(q.error as Error).message || "Failed to fetch flight offers"}
      </Alert>
    );
  }

  if (!cards.length) {
    return (
      <Alert severity="info">
        No flight offers found for this route/date. Try different dates.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        spacing={2}
        alignItems="stretch"
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mb: 1.5 }}
          >
            <Typography color="text.secondary">
              Showing {filteredCards.length} of {cards.length} offers
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {filteredCards.map((c) => (
              <Grid key={c.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <FlightCard offer={c} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ width: { xs: "100%", md: 360 }, flexShrink: 0 }}>
          <FlightFilters
            currency={currency}
            airlinesOptions={airlinesOptions}
            priceBounds={priceBounds}
            value={filters}
            onChange={setFilters}
          />
          <PriceGraph offers={filteredCards} currency={currency} />
        </Box>
      </Stack>
    </Box>
  );
}
