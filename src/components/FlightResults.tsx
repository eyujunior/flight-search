"use client";

import { Alert, Box, CircularProgress, Typography, Grid } from "@mui/material";
import type { FlightSearchParams } from "@/hooks/useFlightOffers";
import { useFlightOffers } from "@/hooks/useFlightOffers";
import { toOfferCards } from "@/hooks/transformOffers";
import FlightCard from "@/components/FlightCard";

export default function FlightResults({
  params,
  enabled,
}: {
  params: FlightSearchParams | null;
  enabled: boolean;
}) {
  const q = useFlightOffers(params, enabled);

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

  const cards = toOfferCards(q.data);

  if (!cards.length) {
    return (
      <Alert severity="info">
        No flight offers found for this route/date. Try different dates.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography color="text.secondary" sx={{ mb: 1.5 }}>
        {cards.length} offers found
      </Typography>

      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
            <FlightCard offer={c} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
