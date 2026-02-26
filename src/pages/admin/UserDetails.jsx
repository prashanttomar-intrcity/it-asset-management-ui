import {
  Box,
  Card,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
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
  const { userId } = useParams(); // emp_id from URL
  const [user, setUser] = useState(null);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // 1️⃣ Get user by emp_id
      const usersRes = await getUsers();
      const found = usersRes.data.find((u) => u.emp_id === userId);

      if (!found) {
        setError("User not found");
        return;
      }
      setUser(found);

      // 2️⃣ Find currently assigned asset (snapshot)
      const assetsRes = await getAssets({});
      const assets = assetsRes.data?.data || [];
      const assigned = assets.find((a) => a.assigned_to === userId);
      setCurrentAsset(assigned || null);

      // 3️⃣ Build assignment history from asset assignments
      // fetch history for all assets assigned to this user (current + past)
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

      // sort by from date desc
      userHistory.sort(
        (x, y) =>
          new Date(y.assigned_from_date) - new Date(x.assigned_from_date),
      );

      setHistory(userHistory);
    } catch (err) {
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f5f7" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && user && (
            <Grid container spacing={3}>
              {/* User Info */}
              <Grid item xs={12} md={5}>
                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    User Details
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography>
                    <b>Employee ID:</b> {user.emp_id}
                  </Typography>
                  <Typography>
                    <b>Name:</b> {user.name}
                  </Typography>
                  <Typography>
                    <b>Email:</b> {user.email}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    {currentAsset ? (
                      <Chip
                        label={`Assigned: ${currentAsset.brand} ${currentAsset.model_id}`}
                        color="success"
                      />
                    ) : (
                      <Chip label="No Asset Assigned" color="warning" />
                    )}
                  </Box>
                </Card>
              </Grid>

              {/* History */}
              <Grid item xs={12} md={7}>
                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Assignment History
                  </Typography>

                  {history.length === 0 ? (
                    <Typography color="text.secondary">
                      No assignment history available
                    </Typography>
                  ) : (
                    history.map((h) => (
                      <Box
                        key={`${h.asset_id}-${h.id}`}
                        sx={{
                          borderLeft: "3px solid #2563eb",
                          pl: 2,
                          mb: 2,
                        }}
                      >
                        <Typography fontWeight="bold">
                          {h.asset_label}
                        </Typography>
                        <Typography variant="body2">
                          {fmt(h.assigned_from_date)} →{" "}
                          {fmt(h.assigned_to_date)}
                        </Typography>
                        <Chip
                          size="small"
                          sx={{ mt: 0.5 }}
                          label={h.assigned_to_date ? "Completed" : "Active"}
                          color={h.assigned_to_date ? "default" : "success"}
                        />
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