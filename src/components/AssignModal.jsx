import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";

const users = [
  { id: "EMP001", name: "Rahul Sharma", assigned: true },
  { id: "EMP002", name: "Neha Singh", assigned: false },
];

export default function AssignModal({ open, onClose, asset }) {
  const [selectedUser, setSelectedUser] = useState("");

  const availableUsers = users.filter((u) => !u.assigned);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Assign Laptop – {asset?.id}</DialogTitle>

      <DialogContent>
        {availableUsers.length === 0 ? (
          <Typography color="error">
            No available users (all users already have laptops)
          </Typography>
        ) : (
          <>
            <Select
              fullWidth
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              sx={{ mt: 2 }}
            >
              {availableUsers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name} ({u.id})
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={!selectedUser}
              onClick={onClose}
            >
              Assign Laptop
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
