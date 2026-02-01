"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

export type FlightCardVM = {
  id: string;
  airlineCodes: string[];
  priceTotal: number;
  currency: string;
  stops: number;
  departAt: string; // ISO
  arriveAt: string; // ISO
  duration: string; // ISO duration e.g. "PT6H35M"

  fromIata: string;
  toIata: string;
  stopIatas: string[];
};

function formatStops(stops: number) {
  if (stops === 0) return "Nonstop";
  if (stops === 1) return "1 stop";
  return `${stops} stops`;
}

function formatTime(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// "PT6H35M" -> "6h 35m"
function formatDuration(iso: string) {
  if (!iso) return "—";
  const h = /(\d+)H/.exec(iso)?.[1];
  const m = /(\d+)M/.exec(iso)?.[1];
  const hh = h ? `${h}h` : "";
  const mm = m ? `${m}m` : "";
  return [hh, mm].filter(Boolean).join(" ");
}

function buildStopsTooltip(offer: FlightCardVM) {
  // Example:
  // nonstop => "EWR → LAX"
  // 1 stop  => "LAX → DFW → EWR"
  const parts = [
    offer.fromIata || "—",
    ...(offer.stopIatas ?? []),
    offer.toIata || "—",
  ].filter(Boolean);

  return parts.join(" --> ");
}

export default function FlightCard({ offer }: { offer: FlightCardVM }) {
  const airlineLabel =
    offer.airlineCodes.length > 0 ? offer.airlineCodes.join(" · ") : "—";

  const stopsLabel = formatStops(offer.stops);
  const stopsTooltip = buildStopsTooltip(offer);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: "100%",
        transition: "transform 0.5s ease, box-shadow 120ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Typography fontWeight={800}>{airlineLabel}</Typography>
            <Typography fontWeight={900} fontSize={18}>
              {offer.currency} {offer.priceTotal.toFixed(0)}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={800} fontSize={18}>
                {formatTime(offer.departAt)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(offer.departAt)}
              </Typography>
            </Box>

            <Typography color="text.secondary" sx={{ px: 1 }}>
              <ArrowRightAltIcon />
            </Typography>

            <Box sx={{ textAlign: "right" }}>
              <Typography fontWeight={800} fontSize={18}>
                {formatTime(offer.arriveAt)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(offer.arriveAt)}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Tooltip
              sx={{
                cursor: "pointer",
              }}
              title={stopsTooltip}
              arrow
              enterTouchDelay={0}
            >
              <Chip size="small" label={stopsLabel} />
            </Tooltip>

            <Chip
              size="small"
              variant="outlined"
              label={formatDuration(offer.duration)}
            />
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Hover the stops chip to see layover airports.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
