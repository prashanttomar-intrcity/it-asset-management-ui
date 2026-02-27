import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";
import { Inventory2, CheckCircle, People, Build } from "@mui/icons-material";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

/* =====================
   DASHBOARD DATA
===================== */
const stats = [
  {
    label: "Total Assets",
    value: 124,
    icon: <Inventory2 />,
    color: "#2563eb",
    sub: "+12 this month",
  },
  {
    label: "Assigned Assets",
    value: 68,
    icon: <CheckCircle />,
    color: "#16a34a",
    sub: "+6 this week",
  },
  {
    label: "Users",
    value: 42,
    icon: <People />,
    color: "#7c3aed",
    sub: "+3 new users",
  },
  {
    label: "Under Repair",
    value: 6,
    icon: <Build />,
    color: "#ea580c",
    sub: "2 critical",
  },
];

const activities = [
  "Laptop AST-L-004 assigned to EMP003",
  "Server AST-S-002 marked under repair",
  "User EMP006 onboarded",
  "Laptop AST-L-001 reassigned",
];

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f6f4f1" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          {/* HEADER */}
          <Typography variant="h4" fontWeight="bold">
            Admin Control Center
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Overview of assets, users, assignments & system health
          </Typography>

          {/* =====================
             STATS
          ===================== */}
          <Grid container spacing={3} mb={4}>
            {stats.map((s) => (
              <Grid item xs={12} sm={6} lg={3} key={s.label}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: 2,
                    borderTop: `4px solid ${s.color}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ color: s.color }}>{s.icon}</Box>

                    <Box>
                      <Typography color="text.secondary">{s.label}</Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {s.value}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={s.sub}
                    size="small"
                    sx={{
                      mt: 2,
                      bgcolor: `${s.color}15`,
                      color: s.color,
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* =====================
             HEALTH + ACTIVITY
          ===================== */}
          <Grid container spacing={3}>
            {/* HEALTH */}
            <Grid item xs={12} lg={7}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Asset Health Overview
                </Typography>
                <Typography color="text.secondary" mb={3}>
                  System-wide asset lifecycle tracking
                </Typography>

                <Typography fontWeight={500}>Operational Assets</Typography>
                <LinearProgress
                  value={88}
                  variant="determinate"
                  sx={{ height: 8, borderRadius: 4, mb: 3 }}
                />

                <Typography fontWeight={500}>Assigned Compliance</Typography>
                <LinearProgress
                  value={72}
                  variant="determinate"
                  color="success"
                  sx={{ height: 8, borderRadius: 4, mb: 3 }}
                />

                <Typography fontWeight={500}>Assets Under Repair</Typography>
                <LinearProgress
                  value={12}
                  variant="determinate"
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Card>
            </Grid>

            {/* ACTIVITY */}
            <Grid item xs={12} lg={5}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Recent Activity
                </Typography>

                {activities.map((a, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Typography>{a}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Just now
                    </Typography>
                    {i !== activities.length - 1 && <Divider sx={{ mt: 1 }} />}
                  </Box>
                ))}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
