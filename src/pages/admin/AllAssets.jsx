import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AssignAssetModal from "../../components/AssignAssetModal";
import { getAssets, deleteAsset } from "../../api/assets.api";

export default function AllAssets() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Laptop");
  const [assets, setAssets] = useState([]);
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [filter]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAssets({ category: filter });
      setAssets(res.data.data || []);
    } catch {
      setError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteAsset(deleteTarget.id);
      setDeleteTarget(null);
      fetchAssets();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete asset");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f6f8" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Assets
            </Typography>

            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(e, v) => v && setFilter(v)}
              sx={{ bgcolor: "#fff", borderRadius: 2, boxShadow: 1 }}
            >
              <ToggleButton value="Laptop">💻 Laptop</ToggleButton>
              <ToggleButton value="Server">🖥️ Server</ToggleButton>
              <ToggleButton value="Router">📡 Router</ToggleButton>
              <ToggleButton value="CCTV">📷 CCTV</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* States */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <CircularProgress />
            </Box>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && assets.length === 0 && (
            <Alert severity="info">No assets found for this category.</Alert>
          )}

          {/* Cards */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {assets.map((asset) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={asset.id}>
                <Card
                  sx={{
                    height: 240,
                    borderRadius: 3,
                    boxShadow: 2,
                    transition: "0.25s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography fontWeight="bold" fontSize={16}>
                      {asset.brand} {asset.model_id}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Serial: {asset.serial_number}
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={asset.assigned_to ? "Assigned" : "Not Assigned"}
                        color={asset.assigned_to ? "success" : "warning"}
                        size="small"
                      />
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/admin/assets/${asset.id}`)}
                    >
                      Details
                    </Button>

                    <Button
                      fullWidth
                      size="small"
                      variant="contained"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setOpenAssign(true);
                      }}
                    >
                      {asset.assigned_to ? "Manage" : "Assign"}
                    </Button>

                    <Button
                      fullWidth
                      size="small"
                      color="error"
                      variant="outlined"
                      disabled={!!asset.assigned_to}
                      onClick={() => setDeleteTarget(asset)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Assign Modal */}
      {selectedAsset && (
        <AssignAssetModal
          open={openAssign}
          asset={selectedAsset}
          onClose={() => setOpenAssign(false)}
          onSuccess={fetchAssets}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Asset</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <b>
            {deleteTarget?.brand} {deleteTarget?.model_id}
          </b>
          ?
          <br />
          This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}