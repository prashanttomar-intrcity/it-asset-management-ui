import { Box, Card, Typography, Chip } from "@mui/material";
import { useParams } from "react-router-dom";

/* MOCK ASSIGNMENT DATA */
const userAssets = {
  EMP001: {
    assetId: "AST-L-001",
    name: "Dell Latitude 5420",
    serial: "ABC123",
    status: "Assigned",
  },
  EMP003: {
    assetId: "AST-L-002",
    name: "HP EliteBook 840",
    serial: "XYZ789",
    status: "Assigned",
  },
};

export default function UserDashboard() {
  const { userId } = useParams();
  const asset = userAssets[userId];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f5f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ p: 4, width: 420 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          User Dashboard
        </Typography>

        <Typography mb={2}>
          Employee ID: <b>{userId}</b>
        </Typography>

        {asset ? (
          <>
            <Typography fontWeight="bold">Assigned Asset</Typography>

            <Typography>{asset.name}</Typography>
            <Typography variant="body2">Serial: {asset.serial}</Typography>

            <Chip label={asset.status} color="success" sx={{ mt: 2 }} />
          </>
        ) : (
          <Chip label="No Asset Assigned" color="warning" />
        )}
      </Card>
    </Box>
  );
}
