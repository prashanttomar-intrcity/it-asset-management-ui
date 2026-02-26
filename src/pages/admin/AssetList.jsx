import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AssignModal from "../../components/AssignModal";
import { getAssets } from "../../api/assets.api";

export default function AssetList() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const fetchLaptops = async () => {
    try {
      setLoading(true);
      const res = await getAssets({ category: "Laptop" });
      setAssets(res.data.data);
    } catch (err) {
      setError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const handleAssignOpen = (asset) => {
    setSelectedAsset(asset);
    setAssignOpen(true);
  };

  const handleAssignClose = () => {
    setAssignOpen(false);
    setSelectedAsset(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Laptop Assets
          </Typography>

          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={4}>
            {assets.map((asset) => (
              <Grid item xs={12} md={4} key={asset.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {asset.brand} {asset.model_id}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Serial: {asset.serial_number}
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={asset.asset_status || "Not Assigned"}
                        color={asset.assigned_to ? "success" : "warning"}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/admin/assets/${asset.id}`)}
                      >
                        Details
                      </Button>

                      {!asset.assigned_to && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleAssignOpen(asset)}
                        >
                          Assign To
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* ASSIGN MODAL */}
      {selectedAsset && (
        <AssignModal
          open={assignOpen}
          onClose={handleAssignClose}
          asset={selectedAsset}
          onSuccess={fetchLaptops}
        />
      )}
    </Box>
  );
}