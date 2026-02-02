"use client";

import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Header from "@/components/layout/Header";
import AppLayout from "@/layout/AppLayout";
import SearchForm, { SearchFormValues } from "@/components/SearchForm";
import FlightResults from "@/components/FlightResults";
import FlightLottie from "@/components/FlightLottie";
import type { FlightSearchParams } from "@/hooks/useFlightOffers";
import { Flight } from "@mui/icons-material";

export default function HomePage() {
  const [submitted, setSubmitted] = useState<FlightSearchParams | null>(null);

  const [form, setForm] = useState<SearchFormValues>({
    origin: null,
    destination: null,
    departureDate: "",
    returnDate: "",
    adults: 1,
  });

  const canSearch = !!form.origin && !!form.destination && !!form.departureDate;

  return (
    <Box>
      <Header />
      <AppLayout>
        <Stack spacing={2.5}>
          <Typography variant="h4" fontWeight={700}>
            Search flights
          </Typography>

          <SearchForm
            value={form}
            onChange={setForm}
            onSubmit={() => {
              if (!canSearch) return;

              setSubmitted({
                origin: form.origin!.code,
                destination: form.destination!.code,
                departureDate: form.departureDate,
                returnDate: form.returnDate ? form.returnDate : undefined,
                adults: form.adults,
              });
            }}
          />

          {!submitted ? (
            <FlightLottie />
          ) : (
            <FlightResults params={submitted} enabled={!!submitted} />
          )}
        </Stack>
      </AppLayout>
    </Box>
  );
}
