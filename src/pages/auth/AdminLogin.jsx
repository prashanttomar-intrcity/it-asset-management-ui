import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import api from "../../api/axios"; // will use later

function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      // 🔗 API CALL (commented for now)
      /*
      const response = await api.post("/admin/login", data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "admin");
      */

      // ✅ TEMP: simulate successful login
      setTimeout(() => {
        setLoading(false);
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, width: 360 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          gutterBottom
        >
          IT Asset Management System
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={3}>
          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Password */}
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminLogin;
