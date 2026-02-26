import { Box, Card, Typography, Divider, Chip } from "@mui/material";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

/* 🔹 SINGLE SOURCE OF TRUTH */
const users = [
  {
    id: "EMP001",
    name: "Rahul Sharma",
    email: "rahul@company.com",
    assignedAsset: "AST-001",
    history: [
      { action: "Assigned", asset: "AST-001", date: "Jan 2024" },
      { action: "Unassigned", asset: "AST-003", date: "Oct 2023" },
    ],
  },
  {
    id: "EMP002",
    name: "Neha Singh",
    email: "neha@company.com",
    assignedAsset: null,
    history: [],
  },
  {
    id: "EMP003",
    name: "Parth Tomar",
    email: "parth@company.com",
    assignedAsset: "AST-002",
    history: [{ action: "Assigned", asset: "AST-002", date: "Dec 2023" }],
  },
  {
    id: "EMP004",
    name: "Ansh Raghav",
    email: "ansh@company.com",
    assignedAsset: "AST-003",
    history: [{ action: "Assigned", asset: "AST-003", date: "Feb 2024" }],
  },
  {
    id: "EMP005",
    name: "Utkarsh Singhania",
    email: "utkarsh@company.com",
    assignedAsset: null,
    history: [],
  },
];

export default function UserDetails() {
  const { userId } = useParams();

  console.log("URL PARAM userId:", userId); // 🔥 DEBUG

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h5">User not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f5f7" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          <Card sx={{ p: 4, borderRadius: 4, boxShadow: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              User Details
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography>
              <b>Employee ID:</b> {user.id}
            </Typography>
            <Typography>
              <b>Name:</b> {user.name}
            </Typography>
            <Typography>
              <b>Email:</b> {user.email}
            </Typography>

            <Box sx={{ mt: 2 }}>
              {user.assignedAsset ? (
                <Chip
                  label={`Assigned Asset: ${user.assignedAsset}`}
                  color="success"
                />
              ) : (
                <Chip label="No Asset Assigned" color="warning" />
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" mb={2}>
              Assignment History
            </Typography>

            {user.history.length === 0 ? (
              <Typography color="text.secondary">
                No assignment history available
              </Typography>
            ) : (
              user.history.map((h, index) => (
                <Box
                  key={index}
                  sx={{
                    borderLeft: "3px solid #1976d2",
                    pl: 2,
                    mb: 2,
                  }}
                >
                  <Typography fontWeight="bold">{h.action}</Typography>
                  <Typography variant="body2">Asset: {h.asset}</Typography>
                  <Typography variant="caption">{h.date}</Typography>
                </Box>
              ))
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
