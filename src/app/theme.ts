"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "var(--font-inter), Inter, sans-serif",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#FFC107",
      contrastText: "#000",
    },
    background: {
      default: "#fafafa",
    },
  },
  shape: {
    borderRadius: 6,
  },
});
