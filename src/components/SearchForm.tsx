"use client";

import * as React from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLocations, type LocationOption } from "@/hooks/useLocations";

export type SearchFormValues = {
  origin: LocationOption | null;
  destination: LocationOption | null;
  departureDate: string;
  returnDate: string;
  adults: number;
};

function optionLabel(o: LocationOption) {
  const primary = o.city?.trim() ? o.city : o.name;
  return `${primary} (${o.code})`;
}

function renderOptionRow(
  props: React.HTMLAttributes<HTMLLIElement>,
  o: LocationOption,
) {
  const primary = o.city?.trim() ? o.city : o.name;
  return (
    <Box component="li" {...props} key={o.id}>
      <Box sx={{ flex: 1 }}>
        <Typography fontWeight={700}>
          {primary} ({o.code})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {o.name} • {o.subType} • {o.countryCode}
        </Typography>
      </Box>
    </Box>
  );
}

export default function SearchForm({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: {
  value: SearchFormValues;
  onChange: (next: SearchFormValues) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}) {
  const update = (patch: Partial<SearchFormValues>) =>
    onChange({ ...value, ...patch });

  const swap = () =>
    onChange({
      ...value,
      origin: value.destination,
      destination: value.origin,
    });

  const [originInput, setOriginInput] = React.useState("");
  const [destinationInput, setDestinationInput] = React.useState("");

  const originQ = useDebouncedValue(originInput, 250);
  const destinationQ = useDebouncedValue(destinationInput, 250);

  const originQuery = useLocations(originQ);
  const destinationQuery = useLocations(destinationQ);

  React.useEffect(() => {
    if (!value.departureDate && value.returnDate) {
      update({ returnDate: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.departureDate]);

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, marginBottom: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 5.5, md: 5, lg: 3.5, xl: 2.5 }}>
          <Autocomplete
            options={originQuery.data ?? []}
            loading={originQuery.isFetching}
            value={value.origin}
            inputValue={originInput}
            onInputChange={(_, v) => setOriginInput(v)}
            onChange={(_, v) => update({ origin: v })}
            getOptionLabel={optionLabel}
            renderOption={renderOptionRow}
            filterOptions={(x) => x}
            noOptionsText={
              originQuery.isError
                ? "Failed to load airports"
                : originInput.trim().length < 2
                  ? "Type at least 2 characters"
                  : "No matches"
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="From"
                placeholder="Type city or airport"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {originQuery.isFetching ? (
                        <CircularProgress size={18} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid
          size={{ xs: 12, sm: 1, md: 2, lg: 1.5, xl: "auto" }}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "center" },
          }}
        >
          <IconButton
            onClick={swap}
            aria-label="Swap origin and destination"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "50%",
              width: 44,
              height: 44,
            }}
          >
            <SwapHorizIcon />
          </IconButton>
        </Grid>

        <Grid size={{ xs: 12, sm: 5.5, md: 5, lg: 3.5, xl: 2.5 }}>
          <Autocomplete
            options={destinationQuery.data ?? []}
            loading={destinationQuery.isFetching}
            value={value.destination}
            inputValue={destinationInput}
            onInputChange={(_, v) => setDestinationInput(v)}
            onChange={(_, v) => update({ destination: v })}
            getOptionLabel={optionLabel}
            renderOption={renderOptionRow}
            filterOptions={(x) => x}
            noOptionsText={
              destinationQuery.isError
                ? "Failed to load airports"
                : destinationInput.trim().length < 2
                  ? "Type at least 2 characters"
                  : "No matches"
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                placeholder="Type city or airport"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {destinationQuery.isFetching ? (
                        <CircularProgress size={18} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3.5, xl: 2 }}>
          <TextField
            label="Departure"
            type="date"
            value={value.departureDate}
            onChange={(e) => update({ departureDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 2 }}>
          <TextField
            label="Return"
            type="date"
            value={value.returnDate}
            onChange={(e) => update({ returnDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: value.departureDate || undefined,
            }}
            disabled={!value.departureDate}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 1 }}>
          <TextField
            label="Adults"
            type="number"
            value={value.adults}
            onChange={(e) => update({ adults: Number(e.target.value) })}
            inputProps={{ min: 1, max: 9 }}
            fullWidth
          />
        </Grid>

        <Grid
          sx={{
            marginX: { xs: 0, md: "auto" },
          }}
          size={{ xs: 12, sm: 6, md: 12, lg: 4, xl: 1.5 }}
        >
          <Button
            variant="contained"
            disableElevation
            onClick={onSubmit}
            disabled={!!isSubmitting}
            fullWidth
            sx={{
              height: 56,
              minWidth: { md: 140 },
              borderRadius: 1,
            }}
          >
            {isSubmitting ? "Searching…" : "Search"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
