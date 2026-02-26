import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import { useState } from "react";

export default function ReassignModal({ open, onClose }) {
  const [user, setUser] = useState("");

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Reassign Laptop</DialogTitle>
      <DialogContent>
        <Select
          fullWidth
          value={user}
          onChange={(e) => setUser(e.target.value)}
        >
          <MenuItem value="EMP002">Neha Singh</MenuItem>
          <MenuItem value="EMP003">Aman Verma</MenuItem>
        </Select>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={!user}
          onClick={onClose}
        >
          Reassign
        </Button>
      </DialogContent>
    </Dialog>
  );
}
