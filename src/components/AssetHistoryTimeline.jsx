import { Box, Typography, Chip } from "@mui/material";

// small helper to format YYYY-MM-DD nicely
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Present";

export default function AssetHistoryTimeline({ history = [] }) {
  if (!history.length) {
    return (
      <Typography color="text.secondary">
        No assignment history found for this asset.
      </Typography>
    );
  }

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
          bgcolor: "#e5e7eb",
        }}
      />

      {history.map((item) => {
        const isActive = !item.assigned_to_date;

        return (
          <Box
            key={item.id}
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
                bgcolor: isActive ? "#16a34a" : "#2563eb",
                position: "relative",
                zIndex: 1,
                mt: 0.5,
                boxShadow: isActive ? "0 0 0 4px rgba(22,163,74,0.15)" : "none",
              }}
            />

            {/* CONTENT */}
            <Box sx={{ ml: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontWeight="bold">
                  Assigned to: {item.assigned_to || "—"}
                </Typography>
                <Chip
                  size="small"
                  label={isActive ? "Active" : "Completed"}
                  color={isActive ? "success" : "default"}
                  variant={isActive ? "filled" : "outlined"}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {fmt(item.assigned_from_date)} → {fmt(item.assigned_to_date)}
              </Typography>

              {item.location && (
                <Typography variant="caption" color="text.secondary">
                  Location: {item.location}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}