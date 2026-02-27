import {
  Box,
  Card,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Tooltip,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import BusinessIcon from "@mui/icons-material/Business";
import NumbersIcon from "@mui/icons-material/Numbers";
import LogoutIcon from "@mui/icons-material/Logout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getAssets } from "../../api/assets.api";
import { AuthContext } from "../../context/AuthContext";

export default function UserDashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyAsset = async () => {
    try {
      setLoading(true);
      const res = await getAssets({ assigned_to: userId });
      const data = res.data?.data || [];
      setAsset(data[0] || null);
    } catch {
      setError("Failed to load your assigned asset");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAsset();
  }, [userId]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f5f7" }}>
      {/* 🔝 Navbar */}
      <AppBar position="sticky" elevation={1} color="inherit">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Back */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography fontWeight="bold">My Asset</Typography>
          </Box>

          {/* Profile + Logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Profile">
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {userId?.[0]?.toUpperCase()}
              </Avatar>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 📦 Content */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Card
          sx={{
            p: 4,
            width: 420,
            borderRadius: 4,
            boxShadow: 4,
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={1}>
            👋 Welcome
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Employee ID: <b>{userId}</b>
          </Typography>

          <Divider sx={{ my: 2 }} />

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && asset && (
            <Stack spacing={1.5}>
              <Typography fontWeight="bold">Your Assigned Asset</Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <LaptopMacIcon color="primary" />
                <Typography fontWeight="600">
                  {asset.brand} {asset.model_id}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <NumbersIcon fontSize="small" />
                <Typography variant="body2">
                  Serial: {asset.serial_number}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <BusinessIcon fontSize="small" />
                <Typography variant="body2">
                  Location: {asset.location || "N/A"}
                </Typography>
              </Stack>

              <Chip
                label={asset.asset_status || "Assigned"}
                color={
                  asset.asset_status === "Working"
                    ? "success"
                    : asset.asset_status === "Under Repair"
                    ? "warning"
                    : "error"
                }
                sx={{ mt: 1, width: "fit-content" }}
              />
            </Stack>
          )}

          {!loading && !error && !asset && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography fontWeight="bold" mb={1}>
                🎉 No Asset Assigned
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You currently don’t have any device assigned.  
                Please contact your admin.
              </Typography>
              <Chip label="No Asset Assigned" color="warning" sx={{ mt: 2 }} />
            </Box>
          )}

          {/* Optional CTA */}
          <Box sx={{ mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}