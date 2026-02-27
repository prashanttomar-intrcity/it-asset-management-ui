import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import StorageIcon from "@mui/icons-material/Storage";
import RouterIcon from "@mui/icons-material/Router";
import VideocamIcon from "@mui/icons-material/Videocam";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AssetHistoryTimeline from "../../components/AssetHistoryTimeline";
import { getAsset, getAssetHistory } from "../../api/assets.api";

const typeIcon = (category) => {
  switch (category) {
    case "Laptop":
      return <LaptopMacIcon />;
    case "Server":
      return <StorageIcon />;
    case "Router":
      return <RouterIcon />;
    case "CCTV":
      return <VideocamIcon />;
    default:
      return <Inventory2OutlinedIcon />;
  }
};

export default function AssetDetails() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    const res = await getAsset(id);
    const historyRes = await getAssetHistory(id);
    setAsset(res.data);
    setHistory(historyRes.data);
  };

  if (!asset) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#eef1f6" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <Box sx={{ p: 3, maxWidth: 1400, mx: "auto", width: "100%" }}>
          {/* Header */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#e0e7ff", color: "#3730a3" }}>
                {typeIcon(asset.category)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {asset.brand} {asset.model_id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Asset ID: {asset.id}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Chip
                size="small"
                variant="outlined"
                label={asset.assigned_to ? "Assigned" : "Available"}
                color={asset.assigned_to ? "success" : "warning"}
              />
            </Box>
          </Paper>

          {/* Details Card */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              sx={{
                height: 4,
                bgcolor: asset.assigned_to ? "#22c55e" : "#f59e0b",
                borderRadius: 999,
                mb: 2,
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Serial Number
                </Typography>
                <Typography fontWeight={600}>
                  {asset.serial_number || "—"}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography fontWeight={600}>
                  {asset.location || "—"}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Configuration
                </Typography>
                <Typography fontWeight={600}>
                  {asset.configuration || "—"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* History */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Assignment History
            </Typography>

            <AssetHistoryTimeline history={history} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}