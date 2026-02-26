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
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getUsers, deleteUser } from "../../api/users.api";
import { getAssets } from "../../api/assets.api";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [assignedMap, setAssignedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsersWithAssignment = async () => {
    try {
      setLoading(true);
      setError("");

      const usersRes = await getUsers();
      const usersData = usersRes.data || [];
      setUsers(usersData);

      const assetsRes = await getAssets({});
      const assets = assetsRes.data?.data || [];

      const map = {};
      assets.forEach((a) => {
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      fetchUsersWithAssignment();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f5f7" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Users
          </Typography>

          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && (
            <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: "#f0f1f3" }}>
                  <TableRow>
                    <TableCell><b>Employee ID</b></TableCell>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Email</b></TableCell>
                    <TableCell><b>Assigned Laptop</b></TableCell>
                    <TableCell align="right"><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.map((user) => {
                    const asset = assignedMap[user.emp_id];
                    const canDelete = !asset;

                    return (
                      <TableRow
                        key={user.id}
                        hover
                        sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f9fafb" } }}
                        onClick={() => navigate(`/admin/users/${user.emp_id}`)}
                      >
                        <TableCell>{user.emp_id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {asset ? (
                            <Tooltip title={`${asset.brand} ${asset.model_id} • ${asset.serial_number}`}>
                              <Chip
                                label={`Assigned (${asset.asset_tag})`}
                                color="success"
                                size="small"
                              />
                            </Tooltip>
                          ) : (
                            <Chip label="Not Assigned" color="warning" size="small" />
                          )}
                        </TableCell>

                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          <Tooltip title={canDelete ? "Delete user" : "Unassign asset first"}>
                            <span>
                              <IconButton
                                color="error"
                                disabled={!canDelete}
                                onClick={() => setDeleteTarget(user)}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <b>{deleteTarget?.name}</b> ({deleteTarget?.emp_id})?
          <br />
          This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteLoading}
            onClick={handleDelete}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}