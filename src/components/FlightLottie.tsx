import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Stack, Box } from "@mui/material";

export default function FlightLottie() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        display: { xs: "none", md: "flex" },
      }}
    >
      <Box
        sx={{
          width: { md: "75%", xl: "65%" },
        }}
      >
        <DotLottieReact
          src="/lottie/world-map.lottie"
          loop
          autoplay
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
    </Stack>
  );
}
