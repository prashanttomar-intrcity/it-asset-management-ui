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
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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

        <Box sx={{ p: 4, maxWidth: 1400, mx: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={700}>
              Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View employees and manage assigned assets
            </Typography>
          </Box>

          {/* Loading */}
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

          {/* Error */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Empty */}
          {!loading && !error && users.length === 0 && (
            <Alert severity="info">No users found.</Alert>
          )}

          {/* Table */}
          {!loading && !error && users.length > 0 && (
            <Paper
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
              }}
            >
              <Table sx={{ "& td, & th": { py: 2 } }}>
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <BadgeOutlinedIcon fontSize="small" />
                        <Typography fontWeight={600}>Employee ID</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonOutlineIcon fontSize="small" />
                        <Typography fontWeight={600}>Name</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <EmailOutlinedIcon fontSize="small" />
                        <Typography fontWeight={600}>Email</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LaptopMacIcon fontSize="small" />
                        <Typography fontWeight={600}>Assigned Asset</Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <InfoOutlinedIcon fontSize="small" />
                        <Typography fontWeight={600}>Actions</Typography>
                      </Box>
                    </TableCell>
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
                        sx={{
                          cursor: "pointer",
                          transition: "0.2s ease",
                          "&:hover": {
                            bgcolor: "#f9fafb",
                          },
                        }}
                        onClick={() => navigate(`/admin/users/${user.emp_id}`)}
                      >
                        <TableCell>
                          <Chip
                            size="small"
                            label={user.emp_id}
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PeopleAltOutlinedIcon
                              fontSize="small"
                              sx={{ color: "text.secondary" }}
                            />
                            <Typography fontWeight={600}>{user.name}</Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {user.email}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {asset ? (
                            <Tooltip
                              title={`${asset.brand} ${asset.model_id} • ${asset.serial_number}`}
                            >
                              <Chip
                                label={`Assigned (${asset.asset_tag})`}
                                color="success"
                                size="small"
                                variant="outlined"
                              />
                            </Tooltip>
                          ) : (
                            <Chip label="Not Assigned" color="warning" size="small" />
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Tooltip
                              title={
                                canDelete
                                  ? "Delete user"
                                  : "Unassign asset first"
                              }
                            >
                              <span>
                                <IconButton
                                  color="error"
                                  size="small"
                                  disabled={!canDelete}
                                  onClick={() => setDeleteTarget(user)}
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
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