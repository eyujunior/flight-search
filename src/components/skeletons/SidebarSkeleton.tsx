import { Box, Skeleton, Stack, Paper } from "@mui/material";

export default function SidebarSkeleton() {
  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width={90} height={24} />
          <Skeleton variant="rounded" height={36} />
          <Skeleton variant="text" width={120} height={18} />
          <Skeleton variant="rounded" height={28} />
          <Skeleton variant="text" width={120} height={18} />
          <Skeleton variant="rounded" height={44} />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
        <Stack spacing={1}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={220} height={18} />
          <Skeleton variant="rounded" height={220} />
        </Stack>
      </Paper>
    </Stack>
  );
}
