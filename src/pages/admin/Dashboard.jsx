import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  IconButton,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Inventory,
  AssignmentTurnedIn,
  EventAvailable,
  PeopleAlt,
  Refresh,
  Category as CategoryIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getDashboard } from "../../api/dashboard.api";
import { getAssets } from "../../api/assets.api";
import { getUsers } from "../../api/users.api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [listTitle, setListTitle] = useState("");
  const [listType, setListType] = useState(""); // "users" | "assets"

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getDashboard();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCardClick = async (type) => {
    try {
      setListDialogOpen(true);
      setListLoading(true);
      setListData([]);
      setListTitle("");
      setListType(type);
      setSearchTerm(""); // reset search
      setPage(0);

      if (type === "users") {
        const res = await getUsers();
        setListTitle(`All Users (${res.data?.length || 0})`);
        setListData(res.data || []);
      } else {
        const res = await getAssets({});
        const allAssets = res.data?.data || [];

        if (type === "totalAssets") {
          setListTitle(`All Assets (${allAssets.length})`);
          setListData(allAssets);
        } else if (type === "assignedAssets") {
          const assigned = allAssets.filter((a) => a.assigned_to !== null);
          setListTitle(`Assigned Assets (${assigned.length})`);
          setListData(assigned);
        } else if (type === "availableAssets") {
          const available = allAssets.filter((a) => a.assigned_to === null);
          setListTitle(`Available Assets (${available.length})`);
          setListData(available);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  const filteredData = listData.filter((item) => {
    const values = Object.values(item).join(" ").toLowerCase();
    return values.includes(searchTerm.toLowerCase());
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleCloseDialog = () => {
    setListDialogOpen(false);
    setSearchTerm("");
    setPage(0);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <Box sx={{ flex: 1 }}>
          <Navbar />
          <Box sx={{ height: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={50} />
          </Box>
        </Box>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flex: 1 }}>
          <Navbar />
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        </Box>
      </Box>
    );

  const totalAssets = data.assets.total;
  const assignedAssets = data.assets.assigned;
  const availableAssets = data.assets.available;
  const totalUsers = data.users.total;

  const availablePercent =
    totalAssets > 0 ? Math.round((availableAssets / totalAssets) * 100) : 0;

  const assignedPercent =
    totalAssets > 0 ? Math.round((assignedAssets / totalAssets) * 100) : 0;

  const withAssetsPercent =
    totalUsers > 0
      ? Math.round((data.users.with_assets / totalUsers) * 100)
      : 0;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
          {/* HEADER */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: "-0.02em" }}>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time overview • {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </Typography>
            </Box>

            <IconButton
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              sx={{ bgcolor: "white", boxShadow: 1 }}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Box>

          {/* STAT CARDS */}
          <Grid container spacing={3} mb={5}>
            {[
              { label: "Total Assets", value: totalAssets, icon: <Inventory />, color: "primary", type: "totalAssets" },
              { label: "Assigned Assets", value: assignedAssets, icon: <AssignmentTurnedIn />, color: "success", type: "assignedAssets" },
              { label: "Available Assets", value: availableAssets, icon: <EventAvailable />, color: "warning", type: "availableAssets" },
              { label: "Total Users", value: totalUsers, icon: <PeopleAlt />, color: "info", type: "users" },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.label}>
                <Card
                  onClick={() => handleCardClick(item.type)}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    "&:hover": {
                      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  <StatCard {...item} />
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* ASSETS BY CATEGORY */}
          <Card sx={{ p: 3, borderRadius: 3, mb: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Assets by Category
              </Typography>
              <Chip
                icon={<CategoryIcon fontSize="small" />}
                label="Live"
                size="small"
                color="success"
                sx={{ fontWeight: 500 }}
              />
            </Box>

            <Grid container spacing={2.5}>
              {Object.entries(data.assets.by_category).map(([category, count], idx) => (
                <Grid item xs={6} sm={4} md={2.4} key={category}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: "#ffffff",
                      textAlign: "center",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                      transition: "all 0.2s",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 30px rgba(0,0,0,0.1)" },
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ mb: 0.5 }}>
                      {count}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ textTransform: "capitalize", color: "#475569" }}
                    >
                      {category}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>

          {/* DISTRIBUTION CARDS */}
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  User Asset Distribution
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">With Assets</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {data.users.with_assets} ({withAssetsPercent}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={withAssetsPercent}
                    sx={{ height: 10, borderRadius: 5, bgcolor: "#e2e8f0" }}
                    color="primary"
                  />
                </Box>

                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Without Assets</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {data.users.without_assets} ({100 - withAssetsPercent}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100 - withAssetsPercent}
                    sx={{ height: 10, borderRadius: 5, bgcolor: "#e2e8f0" }}
                    color="warning"
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Asset Availability
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Available</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {availableAssets} ({availablePercent}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={availablePercent}
                    sx={{ height: 10, borderRadius: 5, bgcolor: "#e2e8f0" }}
                    color="success"
                  />
                </Box>

                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Assigned</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {assignedAssets} ({assignedPercent}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={assignedPercent}
                    sx={{ height: 10, borderRadius: 5, bgcolor: "#e2e8f0" }}
                    color="warning"
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* RECENT ACTIVITY */}
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Recent Assignment Activity
            </Typography>

            {data.recent_assignments.length === 0 ? (
              <Typography color="text.secondary" align="center" py={8}>
                No recent assignments yet
              </Typography>
            ) : (
              data.recent_assignments.map((item, index) => (
                <Box key={item.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 3,
                      gap: 3,
                      transition: "background 0.2s",
                      "&:hover": { bgcolor: "#f8fafc" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 2.5,
                        bgcolor: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Inventory sx={{ color: "#64748b", fontSize: 28 }} />
                    </Box>

                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.asset.brand} {item.asset.model}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Serial • {item.asset.serial_number || "—"}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "right", minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.assigned_from}
                      </Typography>
                      <Chip
                        label={
                          item.assigned_to_date
                            ? `Returned • ${item.assigned_to_date}`
                            : "Currently Assigned"
                        }
                        color={item.assigned_to_date ? "error" : "success"}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </Box>
                  {index < data.recent_assignments.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </Card>
        </Box>
      </Box>

      {/* ENHANCED LIST DIALOG */}
      <Dialog
        open={listDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xl"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 25px 70px rgba(0,0,0,0.15)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 4,
            py: 3,
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#f8fafc",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {listType === "users" ? (
              <PeopleAlt sx={{ color: "#3b82f6", fontSize: 32 }} />
            ) : (
              <Inventory sx={{ color: "#8b5cf6", fontSize: 32 }} />
            )}
            <Typography variant="h5" fontWeight={700}>
              {listTitle}
            </Typography>
          </Box>

          <IconButton onClick={handleCloseDialog} size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* SEARCH BAR */}
          <Box sx={{ p: 4, pb: 3, borderBottom: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
            <TextField
              size="medium"
              fullWidth
              placeholder="Search by name, email, brand, serial..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748b" }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: "white" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#cbd5e1" },
                  "&:hover fieldset": { borderColor: "#94a3b8" },
                },
              }}
            />
          </Box>

          {listLoading ? (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={50} />
            </Box>
          ) : filteredData.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 10,
                color: "#64748b",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                {listType === "users" ? <PeopleAlt sx={{ fontSize: 40 }} /> : <Inventory sx={{ fontSize: 40 }} />}
              </Box>
              <Typography variant="h6" fontWeight={600}>
                No records found
              </Typography>
              <Typography variant="body2">Try adjusting your search term</Typography>
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflow: "auto", px: 4, py: 2 }}>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Table size="medium" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      {listData[0]?.emp_id ? (
                        <>
                          <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Department</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Brand</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Model</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Serial Number</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Status</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedData.map((item) => {
                      const isUser = !!item.emp_id;
                      return (
                        <TableRow
                          key={item.id || item.emp_id}
                          hover
                          sx={{
                            cursor: "pointer",
                            "&:hover": { bgcolor: "#f8fafc" },
                            transition: "background 0.15s",
                          }}
                          onClick={() => {
                            if (isUser) {
                              navigate(`/admin/users/${item.emp_id}`);
                            } else {
                              navigate(`/admin/assets/${item.id}`);
                            }
                            handleCloseDialog();
                          }}
                        >
                          {isUser ? (
                            <>
                              <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                              <TableCell>{item.email}</TableCell>
                              <TableCell>
                                {item.department ? (
                                  <Chip label={item.department} size="small" color="primary" variant="outlined" />
                                ) : (
                                  "—"
                                )}
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell sx={{ fontWeight: 500 }}>{item.brand}</TableCell>
                              <TableCell>{item.model_id || item.model}</TableCell>
                              <TableCell>{item.serial_number || "—"}</TableCell>
                              <TableCell>
                                <Chip
                                  label={item.assigned_to ? `Assigned to ${item.assigned_to}` : "Available"}
                                  size="small"
                                  color={item.assigned_to ? "success" : "warning"}
                                  variant="filled"
                                />
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 4, py: 2.5, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 15, 25]}
            sx={{
              "& .MuiTablePagination-select": { borderRadius: 2 },
            }}
          />
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ ml: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Enhanced Stat Card
const StatCard = ({ label, value, icon, color }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </Typography>
      <Typography variant="h3" fontWeight={800} sx={{ mt: 0.5, lineHeight: 1 }}>
        {value.toLocaleString()}
      </Typography>
    </Box>

    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: 3,
        bgcolor: `${color}.100`,
        color: `${color}.600`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      {React.cloneElement(icon, { fontSize: "large" })}
    </Box>
  </Box>
);