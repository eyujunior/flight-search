"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";

export type FlightFiltersState = {
  stops: "any" | "0" | "1" | "2+";
  priceRange: [number, number];
  airlines: string[]; // airline codes
};

export default function FlightFilters({
  currency,
  airlinesOptions,
  priceBounds,
  value,
  onChange,
}: {
  currency: string;
  airlinesOptions: string[];
  priceBounds: [number, number]; // [min,max] from results
  value: FlightFiltersState;
  onChange: (next: FlightFiltersState) => void;
}) {
  const [minP, maxP] = priceBounds;

  const update = (patch: Partial<FlightFiltersState>) =>
    onChange({ ...value, ...patch });

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: 3, marginY: { xs: 4.5 } }}
    >
      <Stack spacing={2}>
        <Typography fontWeight={800}>Filters</Typography>

        {/* Stops */}
        <Box>
          <Typography variant="caption" color="text.secondary">
            Stops
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={value.stops}
            onChange={(_, v) => {
              if (!v) return;
              update({ stops: v });
            }}
            sx={{ mt: 0.5, ml: 2, flexWrap: "wrap" }}
          >
            <ToggleButton value="any">Any</ToggleButton>
            <ToggleButton value="0">Nonstop</ToggleButton>
            <ToggleButton value="1">1 stop</ToggleButton>
            <ToggleButton value="2+">2+ stops</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Airlines
          </Typography>

          <Autocomplete
            multiple
            options={airlinesOptions}
            value={value.airlines}
            onChange={(_, v) => update({ airlines: v })}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((opt, index) => (
                <Chip
                  size="small"
                  label={opt}
                  {...getTagProps({ index })}
                  key={opt}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Select airlines" />
            )}
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Typography variant="caption" color="text.secondary">
              Price
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currency} {Math.round(value.priceRange[0])} – {currency}{" "}
              {Math.round(value.priceRange[1])}
            </Typography>
          </Stack>

          <Slider
            value={value.priceRange}
            onChange={(_, v) => update({ priceRange: v as [number, number] })}
            min={minP}
            max={maxP}
            step={1}
            disableSwap
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Stack>
    </Paper>
  );
}
