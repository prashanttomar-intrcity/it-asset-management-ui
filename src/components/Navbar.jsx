import { Box, Typography, Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export default function Navbar() {
  return (
    <Box
      sx={{
        height: 64,
        bgcolor: "#0b1220", // match sidebar dark tone
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
      }}
    >
      {/* Brand */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* <Inventory2OutlinedIcon sx={{ color: "#38bdf8" }} /> */}
        {/* <Box>
          <Typography fontWeight={800} lineHeight={1}>
            IT Asset Management
          </Typography>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            Admin Console
          </Typography>
        </Box> */}
      </Box>

      {/* Actions */}
      <Button
        startIcon={<LogoutOutlinedIcon />}
        variant="outlined"
        sx={{
          color: "#e5e7eb",
          borderColor: "rgba(255,255,255,0.2)",
          textTransform: "none",
          borderRadius: 999,
          px: 2,
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.08)",
            borderColor: "rgba(255,255,255,0.35)",
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}