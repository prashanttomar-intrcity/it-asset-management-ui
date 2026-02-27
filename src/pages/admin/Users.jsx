// 🔥 SAME IMPORTS
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
  TablePagination,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getUsers, deleteUser } from "../../api/users.api";
import {
  getAssets,
  assignAsset,
  unassignAsset,
  getAssetHistory,
} from "../../api/assets.api";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [assignedMap, setAssignedMap] = useState({});
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 🔥 Default rows changed to 5 (ONLY CHANGE HERE)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog search + pagination (UNCHANGED)
  const [assetSearch, setAssetSearch] = useState("");
  const [assetPage, setAssetPage] = useState(0);
  const [assetRowsPerPage, setAssetRowsPerPage] = useState(5);

  const fetchUsersWithAssignment = async () => {
    try {
      setLoading(true);
      setError("");

      const usersRes = await getUsers();
      const usersData = usersRes.data || [];
      setUsers(usersData);

      const assetsRes = await getAssets({});
      const assetsData = assetsRes.data?.data || [];
      setAssets(assetsData);

      const map = {};
      assetsData.forEach((a) => {
        if (a.assigned_to) map[a.assigned_to] = a;
      });
      setAssignedMap(map);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithAssignment();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.emp_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      fetchUsersWithAssignment();
      setPage(0);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAssign = async (asset) => {
    try {
      await assignAsset(asset.id, {
        assigned_to: selectedUser.emp_id,
        location: asset.location,
      });
      setAssignOpen(false);
      fetchUsersWithAssignment();
    } catch {
      setError("Failed to assign asset");
    }
  };

  const handleUnassign = async (asset) => {
    try {
      const historyRes = await getAssetHistory(asset.id);
      const active = historyRes.data.find((a) => !a.assigned_to_date);
      if (!active) return;

      await unassignAsset(asset.id, active.id);
      setAssignOpen(false);
      fetchUsersWithAssignment();
    } catch {
      setError("Failed to unassign asset");
    }
  };

  const filteredAssets = assets.filter(
    (a) =>
      (!a.assigned_to || a.assigned_to === selectedUser?.emp_id) &&
      (
        a.brand.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.model_id.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.serial_number.toLowerCase().includes(assetSearch.toLowerCase())
      )
  );

  const paginatedAssets = filteredAssets.slice(
    assetPage * assetRowsPerPage,
    assetPage * assetRowsPerPage + assetRowsPerPage
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f5f7" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4, maxWidth: 1400, mx: "auto" }}>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Users
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View employees and manage assigned assets
              </Typography>
            </Box>

            <TextField
              placeholder="Search..."
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Assigned Asset</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedUsers.map((user) => {
                      const asset = assignedMap[user.emp_id];
                      const canDelete = !asset;

                      return (
                        <TableRow
                          key={user.id}
                          hover
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/admin/users/${user.emp_id}`)
                          }
                        >
                          <TableCell>{user.emp_id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>

                          <TableCell>
                            {asset ? (
                              <Chip
                                label={`${asset.brand} ${asset.model_id}`}
                                color="success"
                                size="small"
                                sx={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/admin/assets/${asset.id}`);
                                }}
                              />
                            ) : (
                              <Chip
                                label="Not Assigned"
                                color="warning"
                                size="small"
                              />
                            )}
                          </TableCell>

                          {/* 🔥 Prevent row navigation when clicking buttons */}
                          <TableCell
                            align="right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              size="small"
                              startIcon={<AssignmentIndIcon />}
                              variant="contained"
                              sx={{ mr: 1 }}
                              onClick={() => {
                                setSelectedUser(user);
                                setAssignOpen(true);
                              }}
                            >
                              {asset ? "Manage" : "Assign"}
                            </Button>

                            <IconButton
                              size="small"
                              disabled={!canDelete}
                              onClick={() => setDeleteTarget(user)}
                              sx={{ color: "#ef4444" }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 15, 25]}
              />
            </Paper>
          )}
        </Box>
      </Box>

      {/* DELETE DIALOG (UNCHANGED) */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{deleteTarget?.name}</b>?
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
      {/* 🔥 MANAGE / ASSIGN DIALOG (RESTORED — NOTHING REMOVED) */}
<Dialog
  open={assignOpen}
  onClose={() => setAssignOpen(false)}
  fullWidth
  maxWidth="md"
>
  <DialogTitle>
    Manage Assets — {selectedUser?.name} ({selectedUser?.emp_id})
  </DialogTitle>

  <Divider />

  <DialogContent sx={{ pt: 2 }}>
    <TextField
      fullWidth
      size="small"
      placeholder="Search asset..."
      value={assetSearch}
      onChange={(e) => {
        setAssetSearch(e.target.value);
        setAssetPage(0);
      }}
      sx={{ mb: 2 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />

    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Brand</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Serial</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedAssets.map((asset) => {
            const isCurrent =
              asset.assigned_to === selectedUser?.emp_id;

            return (
              <TableRow key={asset.id}>
                <TableCell>{asset.brand}</TableCell>
                <TableCell>{asset.model_id}</TableCell>
                <TableCell>{asset.serial_number}</TableCell>

                <TableCell>
                  {isCurrent ? (
                    <Chip label="Current" color="success" size="small" />
                  ) : (
                    <Chip label="Available" color="warning" size="small" />
                  )}
                </TableCell>

                <TableCell align="right">
                  {isCurrent ? (
                    <Button
                      color="warning"
                      size="small"
                      onClick={() => handleUnassign(asset)}
                    >
                      Unassign
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAssign(asset)}
                    >
                      Assign
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      component="div"
      count={filteredAssets.length}
      page={assetPage}
      rowsPerPage={assetRowsPerPage}
      onPageChange={(_, newPage) => setAssetPage(newPage)}
      onRowsPerPageChange={(e) => {
        setAssetRowsPerPage(parseInt(e.target.value, 10));
        setAssetPage(0);
      }}
      rowsPerPageOptions={[5, 10, 15]}
    />
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setAssignOpen(false)}>
      Close
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}