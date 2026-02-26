import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AssetHistoryTimeline from "../../components/AssetHistoryTimeline";
import { getAsset, getAssetHistory } from "../../api/assets.api";

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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Navbar />
        <Box sx={{ p: 4 }}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" fontWeight="bold">
                  {asset.brand} {asset.model_id}
                </Typography>

                <Chip
                  label={asset.asset_status}
                  color={asset.assigned_to ? "success" : "warning"}
                  sx={{ mt: 1 }}
                />

                <Divider sx={{ my: 3 }} />

                <Typography><b>Serial:</b> {asset.serial_number}</Typography>
                <Typography><b>Location:</b> {asset.location}</Typography>
                <Typography><b>Configuration:</b> {asset.configuration}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" mb={3} fontWeight="bold">
              Assignment History
            </Typography>
            <AssetHistoryTimeline history={history} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}