import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
} from "@mui/lab";
import { Paper, Typography, Chip, Box } from "@mui/material";

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Present";

export default function AssetTimeline({ history = [] }) {
  if (!history.length) {
    return <Typography color="text.secondary">No assignment history.</Typography>;
  }

  return (
    <Timeline position="right">
      {history.map((h, idx) => {
        const isActive = !h.assigned_to_date;

        return (
          <TimelineItem key={h.id}>
            <TimelineSeparator>
              <TimelineDot color={isActive ? "success" : "primary"} />
              {idx !== history.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="bold">
                    Assigned to: {h.assigned_to || "—"}
                  </Typography>

                  <Chip
                    size="small"
                    label={isActive ? "Active" : "Completed"}
                    color={isActive ? "success" : "default"}
                    variant={isActive ? "filled" : "outlined"}
                  />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {fmt(h.assigned_from_date)} → {fmt(h.assigned_to_date)}
                </Typography>

                {h.location && (
                  <Typography variant="caption" display="block">
                    Location: {h.location}
                  </Typography>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}