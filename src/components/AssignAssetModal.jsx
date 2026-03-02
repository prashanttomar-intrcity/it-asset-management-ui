import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getUsers } from "../api/users.api";
import { assignAsset, getAssetHistory, unassignAsset } from "../api/assets.api";

export default function AssignAssetModal({ open, onClose, asset, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);

  useEffect(() => {
    if (open && asset?.id) {
      fetchUsers();
      fetchActiveAssignment();
    }
  }, [open, asset]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await getUsers();
      setUsers(res.data || []);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchActiveAssignment = async () => {
    try {
      const res = await getAssetHistory(asset.id);
      const active = res.data.find((a) => !a.assigned_to_date);
      setActiveAssignmentId(active?.id || null);
    } catch {
      setError("Failed to load current assignment");
    }
  };

  const handleAssign = async (empId) => {
    setActionLoading(true);
    setError("");
    try {
      await assignAsset(asset.id, {
        assigned_to: empId,
        location: asset.location,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Assign failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnassign = async () => {
    if (!activeAssignmentId) return;
    setActionLoading(true);
    setError("");
    try {
      await unassignAsset(asset.id, activeAssignmentId);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Unassign failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Assign / Unassign Asset
        <Chip
          size="small"
          label={asset?.assigned_to ? "Assigned" : "Not Assigned"}
          color={asset?.assigned_to ? "success" : "warning"}
          sx={{ ml: 1 }}
        />
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loadingUsers ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List dense>
            {users.map((user) => {
              const isCurrentUser = asset?.assigned_to === user.emp_id;

              return (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    isCurrentUser ? (
                      <Button
                        align="right"
                        color="error"
                        disabled={actionLoading}
                        onClick={handleUnassign}
                      >
                        Unassign
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        disabled={actionLoading}
                        onClick={() => handleAssign(user.emp_id)}
                      >
                        Assign
                      </Button>
                    )
                  }
                >
                  <ListItemText
                    primary={user.name}
                    secondary={`${user.emp_id} • ${user.email}`}
                  />

                  {/* {isCurrentUser && (
                    <Chip
                      align="left"
                      label="Current Owner"
                      color="success"
                      size="small"
                    />
                  )} */}
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={actionLoading}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
