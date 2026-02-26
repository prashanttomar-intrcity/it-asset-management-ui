import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getUsers } from "../api/users.api";
import { assignAsset, getAssetHistory, unassignAsset } from "../api/assets.api";

export default function ReassignModal({ open, onClose, asset, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null);

  useEffect(() => {
    if (open && asset?.id) {
      fetchUsers();
      fetchCurrentAssignment();
    }
  }, [open, asset]);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch {
      setError("Failed to load users");
    }
  };

  const fetchCurrentAssignment = async () => {
    try {
      const res = await getAssetHistory(asset.id);
      const active = res.data.find((a) => !a.assigned_to_date);
      setCurrentAssignmentId(active?.id || null);
    } catch {
      setError("Failed to load current assignment");
    }
  };

  const handleReassign = async () => {
    if (!selectedUser || !currentAssignmentId) return;

    setLoading(true);
    setError("");
    try {
      // 1️⃣ Close current assignment
      await unassignAsset(asset.id, currentAssignmentId);

      // 2️⃣ Create new assignment
      await assignAsset(asset.id, {
        assigned_to: selectedUser,
        location: asset.location,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Reassignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Reassign Asset – {asset?.id}</DialogTitle>

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
              onClick={handleReassign}
            >
              {loading ? "Reassigning..." : "Reassign"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}