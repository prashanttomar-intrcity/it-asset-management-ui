import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
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
      setUsers(res.data);
    } catch (err) {
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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Assign Asset – {asset?.id}</DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!users.length && <CircularProgress />}

        {!!users.length && (
          <>
            <Select
              fullWidth
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              sx={{ mt: 2 }}
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.emp_id}>
                  {u.name} ({u.emp_id})
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={!selectedUser || loading}
              onClick={handleAssign}
            >
              {loading ? "Assigning..." : "Assign Asset"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}