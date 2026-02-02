import { Box, Skeleton, Stack, Paper } from "@mui/material";

export default function FlightCardSkeleton() {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: 2,
        height: "100%",
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Skeleton variant="text" width={120} height={28} />
          <Skeleton variant="text" width={70} height={28} />
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Skeleton variant="text" width={60} height={26} />
            <Skeleton variant="text" width={70} height={18} />
          </Box>
          <Skeleton variant="circular" width={18} height={18} />
          <Box sx={{ textAlign: "right" }}>
            <Skeleton variant="text" width={60} height={26} />
            <Skeleton variant="text" width={70} height={18} />
          </Box>
        </Stack>

        <Skeleton variant="rectangular" height={1} />

        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" width={70} height={26} />
          <Skeleton variant="rounded" width={90} height={26} />
        </Stack>

        <Skeleton variant="text" width="60%" height={18} />
      </Stack>
    </Paper>
  );
}
