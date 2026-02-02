"use client";

import * as React from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

import type { FlightSearchParams } from "@/hooks/useFlightOffers";
import { useFlightOffers } from "@/hooks/useFlightOffers";
import { toOfferCards } from "@/hooks/transformOffers";
import FlightCard from "@/components/FlightCard";
import FlightFilters, {
  type FlightFiltersState,
} from "@/components/FlightFilters";
import FlightCardSkeleton from "./skeletons/FlightCardSkeleton";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
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
    sort: "price_asc",
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

    const filtered = cards.filter((c) => {
      if (filters.stops === "0" && c.stops !== 0) return false;
      if (filters.stops === "1" && c.stops !== 1) return false;
      if (filters.stops === "2+" && c.stops < 2) return false;

      if (c.priceTotal < minP || c.priceTotal > maxP) return false;

      if (filters.airlines.length > 0) {
        const has = filters.airlines.some((a) => c.airlineCodes.includes(a));
        if (!has) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      if (filters.sort === "price_desc") return b.priceTotal - a.priceTotal;
      return a.priceTotal - b.priceTotal;
    });

    return filtered;
  }, [cards, filters]);

  const cheapestPrice = React.useMemo(() => {
    if (!filteredCards.length) return null;
    return Math.min(...filteredCards.map((c) => c.priceTotal));
  }, [filteredCards]);

  if (!enabled) return null;

  if (q.isLoading) {
    return (
      <Box sx={{ mt: 2 }}>
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          spacing={2}
          alignItems="stretch"
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} />
                <Typography color="text.secondary">
                  Searching flights…
                </Typography>
              </Stack>
              <Skeleton variant="text" width={140} height={20} />
            </Stack>

            <Grid container spacing={2}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <Grid key={idx} size={{ xs: 12, md: 6, lg: 4 }}>
                  <FlightCardSkeleton />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ width: { xs: "100%", md: 360 }, flexShrink: 0 }}>
            <SidebarSkeleton />
          </Box>
        </Stack>
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
                <FlightCard
                  isBestDeal={c.priceTotal === cheapestPrice}
                  offer={c}
                />
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

          <Box sx={{ mt: 2 }}>
            <PriceGraph offers={filteredCards} currency={currency} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
