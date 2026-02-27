// src/pages/auth/UserLogin.jsx
import { Box, Card, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function UserLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const user = await login({ email, password });

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(`/user/dashboard/${user.emp_id}`);
      }
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">
          User Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button fullWidth variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Card>
    </Box>
  );
}