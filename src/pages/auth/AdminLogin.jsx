import { Box, Card, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await login({ email, password });

      // 🔀 Redirect based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f5f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ p: 4, width: 380 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Email"
          placeholder="ritesh@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleLogin}
          disabled={!email || !password || loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Card>
    </Box>
  );
}