"use client";

import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Header from "@/components/layout/Header";
import AppLayout from "@/layout/AppLayout";
import SearchForm, { SearchFormValues } from "@/components/SearchForm";

export default function HomePage() {
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
              // next step: trigger search results
              console.log("Searching", {
                origin: form.origin?.code,
                destination: form.destination?.code,
                departureDate: form.departureDate,
                adults: form.adults,
              });
            }}
          />
        </Stack>
      </AppLayout>
    </Box>
  );
}
