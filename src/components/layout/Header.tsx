import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";

export default function Header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        padding: 1,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "0px 1px 10px rgba(0,0,0,0.08)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          px: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.contrastText",
            }}
          >
            <ExploreIcon />
          </Box>

          <Box>
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={700}
              lineHeight={1.1}
            >
              Jetly
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Discover better routes, not just cheaper flights
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
