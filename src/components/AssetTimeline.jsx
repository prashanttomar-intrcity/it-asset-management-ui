import { Timeline, TimelineItem, TimelineContent } from "@mui/lab";
import { Paper, Typography } from "@mui/material";

export default function AssetTimeline({ history }) {
  return (
    <Timeline>
      {history.map((h, i) => (
        <TimelineItem key={i}>
          <TimelineContent>
            <Paper sx={{ p: 2 }}>
              <Typography>{h.user}</Typography>
              <Typography variant="caption">
                {h.from} → {h.to}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
