import { Box, Typography, Button } from "@mui/material";

export default function Navbar() {
  return (
    <Box
      sx={{
        height: 64,
        bgcolor: "#37513c",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Typography fontWeight={700}>IT Asset Management</Typography>

      <Button
        variant="outlined"
        sx={{
          color: "white",
          borderColor: "white",
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}
