import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Avatar,
  InputLabel,
  FormControl,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useEffect, useState } from "react";
import { getUsers } from "../api/users.api";
import { assignAsset } from "../api/assets.api";

export default function AssignModal({ open, onClose, asset, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) fetchUsers();
  }, [open]);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch {
      setError("Failed to load users");
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) return;

    setLoading(true);
    setError("");
    try {
      await assignAsset(asset.id, {
        assigned_to: selectedUser,
        location: asset.location,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#e0e7ff", color: "#3730a3" }}>
            <AssignmentIndIcon />
          </Avatar>
          <Box>
            <Typography fontWeight={700}>Assign Asset</Typography>
            <Typography variant="caption" color="text.secondary">
              {asset?.brand} {asset?.model_id} • #{asset?.id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {!users.length && !error && (
          <Box
            sx={{
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Form */}
        {!!users.length && (
          <>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="assign-user-label">Select User</InputLabel>
              <Select
                labelId="assign-user-label"
                label="Select User"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                startAdornment={
                  <PersonOutlineIcon
                    fontSize="small"
                    style={{ marginRight: 8, opacity: 0.6 }}
                  />
                }
              >
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.emp_id}>
                    {u.name} ({u.emp_id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              Choose the employee to assign this asset.
            </Typography>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<AssignmentIndIcon />}
          onClick={handleAssign}
          disabled={!selectedUser || loading}
        >
          {loading ? "Assigning..." : "Assign Asset"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}