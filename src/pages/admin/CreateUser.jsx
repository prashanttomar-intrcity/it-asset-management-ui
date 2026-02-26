import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
} from "@mui/material";
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
      setSuccess("✅ User created successfully!");
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
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          <Paper sx={{ p: 4, maxWidth: 500 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Create User
            </Typography>

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
              name="emp_id"
              value={form.emp_id}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}