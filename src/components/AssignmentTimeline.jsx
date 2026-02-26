import { Box, Paper, Typography } from "@mui/material";

export default function AssignmentTimeline({ history }) {
  return (
    <Box>
      {history.map((h, i) => (
        <Paper key={i} sx={{ p: 2, mb: 2 }}>
          <Typography fontWeight="bold">Asset: {h.asset}</Typography>
          <Typography variant="body2">
            From: {h.from} → To: {h.to}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
