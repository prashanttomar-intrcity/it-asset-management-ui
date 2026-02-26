import { Box, Paper, Typography, Chip } from "@mui/material";

export default function AssignmentTimeline({ history = [] }) {
  if (!history.length) {
    return <Typography color="text.secondary">No assignment history found.</Typography>;
  }

  return (
    <Box>
      {history.map((h) => (
        <Paper key={h.id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Typography fontWeight="bold">
            Assigned To: {h.assigned_to || "—"}
          </Typography>

          <Typography variant="body2" sx={{ mt: 0.5 }}>
            From: {h.assigned_from_date || "N/A"} → To:{" "}
            {h.assigned_to_date || "Present"}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              label={h.assigned_to_date ? "Completed" : "Active"}
              color={h.assigned_to_date ? "default" : "success"}
            />
          </Box>
        </Paper>
      ))}
    </Box>
  );
}