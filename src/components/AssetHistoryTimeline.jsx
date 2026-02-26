import { Box, Typography } from "@mui/material";

export default function AssetHistoryTimeline({ history }) {
  return (
    <Box sx={{ position: "relative", ml: 2 }}>
      {/* Vertical Line */}
      <Box
        sx={{
          position: "absolute",
          left: 12,
          top: 0,
          bottom: 0,
          width: 2,
          bgcolor: "#cbd5e1",
        }}
      />

      {history.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 4,
            position: "relative",
          }}
        >
          {/* DOT */}
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: "#2563eb",
              position: "relative",
              zIndex: 1,
              mt: 0.5,
            }}
          />

          {/* CONTENT */}
          <Box sx={{ ml: 3 }}>
            <Typography fontWeight="bold">{item.user}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.from} → {item.to}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
