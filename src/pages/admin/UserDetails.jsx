import {
  Box,
  Card,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Avatar,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getUsers } from "../../api/users.api";
import { getAssets, getAssetHistory } from "../../api/assets.api";

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Present";

export default function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const usersRes = await getUsers();
      const found = usersRes.data.find((u) => u.emp_id === userId);

      if (!found) {
        setError("User not found");
        return;
      }
      setUser(found);

      const assetsRes = await getAssets({});
      const assets = assetsRes.data?.data || [];
      const assigned = assets.find((a) => a.assigned_to === userId);
      setCurrentAsset(assigned || null);

      const userHistory = [];
      for (const a of assets) {
        const hRes = await getAssetHistory(a.id);
        hRes.data.forEach((h) => {
          if (h.assigned_to === userId) {
            userHistory.push({
              ...h,
              asset_id: a.id,
              asset_label: `${a.brand} ${a.model_id}`,
            });
          }
        });
      }

      userHistory.sort(
        (x, y) =>
          new Date(y.assigned_from_date) - new Date(x.assigned_from_date),
      );

      setHistory(userHistory);
    } catch {
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#eef1f6" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        {/* Page Container */}
        <Box sx={{ p: 3 }}>
          {/* Page Header */}
          {!loading && !error && user && (
            <Box
              sx={{
                mb: 3,
                p: 3,
                borderRadius: 3,
                bgcolor: "#ffffff",
                boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h5" fontWeight={700}>
                User Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Detailed view of employee and asset assignments
              </Typography>
            </Box>
          )}

          {/* Loading */}
          {loading && (
            <Box
              sx={{
                height: "50vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {/* Error */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Content */}
          {!loading && !error && user && (
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} lg={4}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: "0 8px 18px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#e0e7ff", color: "#3730a3" }}>
                      <PersonOutlineIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Employee ID: {user.emp_id}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography fontWeight={600} mb={2}>
                    {user.email}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LaptopMacIcon fontSize="small" />
                    {currentAsset ? (
                      <Chip
                        label={`${currentAsset.brand} ${currentAsset.model_id}`}
                        color="success"
                        variant="outlined"
                      />
                    ) : (
                      <Chip label="No Asset Assigned" color="warning" />
                    )}
                  </Box>
                </Card>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} lg={8}>
                <Card
                  sx={{
                    p: 3,
                    minHeight: 300,
                    borderRadius: 3,
                    boxShadow: "0 8px 18px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <HistoryIcon fontSize="small" />
                    <Typography variant="h6" fontWeight={700}>
                      Assignment History
                    </Typography>
                  </Box>

                  {history.length === 0 ? (
                    <Typography color="text.secondary">
                      No assignment history available
                    </Typography>
                  ) : (
                    history.map((h) => (
                      <Box
                        key={`${h.asset_id}-${h.id}`}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        {h.assigned_to_date ? (
                          <CheckCircleOutlineIcon
                            fontSize="small"
                            color="success"
                          />
                        ) : (
                          <HourglassEmptyIcon
                            fontSize="small"
                            color="warning"
                          />
                        )}

                        <Box>
                          <Typography fontWeight={600}>
                            {h.asset_label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {fmt(h.assigned_from_date)} →{" "}
                            {fmt(h.assigned_to_date)}
                          </Typography>
                          <Chip
                            size="small"
                            sx={{ mt: 0.5 }}
                            label={h.assigned_to_date ? "Completed" : "Active"}
                            color={h.assigned_to_date ? "default" : "success"}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    ))
                  )}
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}