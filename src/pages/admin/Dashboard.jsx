import { Box, Typography, Grid, Card } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const stats = [
  { label: "Total Assets", value: 124, color: "#2563eb" },
  { label: "Assigned Assets", value: 68, color: "#16a34a" },
  { label: "Users", value: 42, color: "#7c3aed" },
  { label: "Under Repair", value: 6, color: "#ea580c" },
];

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" mb={4}>
            Admin Control Center
          </Typography>

          <Grid container spacing={3}>
            {stats.map((s) => (
              <Grid item xs={12} md={3} key={s.label}>
                <Card
                  sx={{
                    p: 3,
                    borderLeft: `6px solid ${s.color}`,
                    boxShadow: 3,
                  }}
                >
                  <Typography color="text.secondary">{s.label}</Typography>
                  <Typography variant="h4">{s.value}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ mt: 4, p: 3, boxShadow: 2 }}>
            <Typography variant="h6" mb={1}>
              Asset Health Overview
            </Typography>
            <Typography color="text.secondary">
              • Real-time asset monitoring
              <br />
              • 1 user ↔ 1 asset enforced
              <br />
              • Full assignment history tracked
              <br />• Lifecycle & repair visibility
            </Typography>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
