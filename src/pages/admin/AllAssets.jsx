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
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AssignAssetModal from "../../components/AssignAssetModal";
import { getAssets, deleteAsset } from "../../api/assets.api";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import StorageIcon from "@mui/icons-material/Storage";
import RouterIcon from "@mui/icons-material/Router";
import VideocamIcon from "@mui/icons-material/Videocam";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AllInboxIcon from "@mui/icons-material/AllInbox";

export default function AllAssets() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");
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
      const params = filter === "ALL" ? {} : { category: filter };
      const res = await getAssets(params);
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#eef1f6" }}>
      <Sidebar />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <Box sx={{ p: 3, maxWidth: 1400, mx: "auto", width: "100%" }}>
          {/* Header */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Asset Inventory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage, assign and track all company assets
              </Typography>
            </Box>

            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(e, v) => v && setFilter(v)}
              sx={{
                bgcolor: "#fff",
                borderRadius: 999,
                p: 0.5,
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                "& .MuiToggleButton-root": {
                  border: "none",
                  borderRadius: 999,
                  px: 2,
                  gap: 1,
                },
              }}
            >
              <ToggleButton value="ALL">
                <AllInboxIcon fontSize="small" /> All
              </ToggleButton>
              <ToggleButton value="Laptop">
                <LaptopMacIcon fontSize="small" /> Laptop
              </ToggleButton>
              <ToggleButton value="Server">
                <StorageIcon fontSize="small" /> Server
              </ToggleButton>
              <ToggleButton value="Router">
                <RouterIcon fontSize="small" /> Router
              </ToggleButton>
              <ToggleButton value="CCTV">
                <VideocamIcon fontSize="small" /> CCTV
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* States */}
          {loading && (
            <Box
              sx={{
                height: "40vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && assets.length === 0 && (
            <Alert severity="info">No assets found.</Alert>
          )}

          {/* Cards */}
          <Grid container spacing={2.5}>
            {assets.map((asset) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={asset.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3, // 👈 softer, not too round
                    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                    transition: "0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {/* Accent bar */}
                  <Box
                    sx={{
                      height: 4,
                      bgcolor: asset.assigned_to ? "#22c55e" : "#f59e0b",
                    }}
                  />

                  <CardContent sx={{ pb: 1.5 }}>
                    <Typography fontWeight={700} noWrap>
                      {asset.brand} {asset.model_id}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" noWrap>
                      Serial: {asset.serial_number}
                    </Typography>

                    <Chip
                      size="small"
                      variant="outlined"
                      label={asset.assigned_to ? "Assigned" : "Not Assigned"}
                      color={asset.assigned_to ? "success" : "warning"}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>

                  <Divider />

                  <Box
                    sx={{
                      p: 1.5,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<InfoOutlinedIcon />}
                      onClick={() => navigate(`/admin/assets/${asset.id}`)}
                    >
                      Details
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AssignmentIndIcon />}
                      sx={{ ml: "auto" }}
                      onClick={() => {
                        setSelectedAsset(asset);
                        setOpenAssign(true);
                      }}
                    >
                      {asset.assigned_to ? "Manage" : "Assign"}
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      variant="text"
                      startIcon={<DeleteOutlineIcon />}
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
          ?<br />
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