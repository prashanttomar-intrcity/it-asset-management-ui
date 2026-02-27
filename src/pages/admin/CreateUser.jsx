import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { createUser } from "../../api/users.api";

export default function CreateUser() {
  const [form, setForm] = useState({
    emp_id: "",
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.emp_id || !form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await createUser(form);
      setSuccess("User created successfully 🎉");
      setForm({
        emp_id: "",
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    } catch (err) {
      setError(
        err.response?.data?.errors?.join(", ") || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#eef1f6" }}>
      <Sidebar />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 3,
              bgcolor: "#ffffff",
              boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonAddAltOutlinedIcon />
              <Typography variant="h5" fontWeight={700}>
                Create New User
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Add a new employee to the system and assign access role
            </Typography>
          </Box>

          {/* Form */}
          <Paper
            sx={{
              maxWidth: 700,
              mx: "auto",
              p: 4,
              borderRadius: 4,
              boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Employee ID"
              placeholder="e.g. EMP1023"
              name="emp_id"
              value={form.emp_id}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Full Name"
              placeholder="e.g. Ritesh Jha"
              name="name"
              value={form.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              placeholder="e.g. ritesh@company.com"
              name="email"
              value={form.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              name="password"
              value={form.password}
              onChange={handleChange}
              helperText="Minimum 6 characters recommended"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              sx={{ mb: 3 }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating user..." : "Create User"}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}