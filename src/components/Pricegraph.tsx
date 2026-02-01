"use client";

import * as React from "react";
import { Paper, Stack, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { FlightCardVM } from "@/components/FlightCard";

type Point = {
  hour: string; // "06", "07", ...
  avgPrice: number; // average price for that hour bucket
  count: number; // number of offers in bucket
};

function hourFromIso(iso: string) {
  if (!iso) return null;
  const d = new Date(iso);
  const h = d.getHours();
  return String(h).padStart(2, "0");
}

export default function PriceGraph({
  offers,
  currency,
  title = "Price trend",
}: {
  offers: FlightCardVM[];
  currency: string;
  title?: string;
}) {
  const data = React.useMemo<Point[]>(() => {
    const buckets = new Map<string, { sum: number; count: number }>();

    for (const o of offers) {
      const h = hourFromIso(o.departAt);
      if (!h) continue;

      const cur = buckets.get(h) ?? { sum: 0, count: 0 };
      cur.sum += o.priceTotal;
      cur.count += 1;
      buckets.set(h, cur);
    }

    const points: Point[] = Array.from(buckets.entries())
      .map(([hour, v]) => ({
        hour,
        avgPrice: v.count ? v.sum / v.count : 0,
        count: v.count,
      }))
      .sort((a, b) => Number(a.hour) - Number(b.hour));

    return points;
  }, [offers]);

  const empty = offers.length === 0 || data.length === 0;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Stack spacing={1}>
        <Typography fontWeight={800}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">
          Average price by departure hour (updates with filters)
        </Typography>

        {empty ? (
          <Typography color="text.secondary" sx={{ py: 6 }}>
            No data to chart yet.
          </Typography>
        ) : (
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
                <YAxis tickFormatter={(v) => `${Math.round(v)}`} width={40} />
                <Tooltip
                  formatter={(value: any, name?: string) => {
                    if (name === "avgPrice") {
                      return [
                        `${currency} ${Math.round(Number(value))}`,
                        "Avg price",
                      ];
                    }
                    if (name === "count") {
                      return [value, "Offers"];
                    }
                    return [value, name ?? ""];
                  }}
                  labelFormatter={(label) => `Departure ${label}:00`}
                />

                <Line
                  type="monotone"
                  dataKey="avgPrice"
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Stack>
    </Paper>
  );
}
