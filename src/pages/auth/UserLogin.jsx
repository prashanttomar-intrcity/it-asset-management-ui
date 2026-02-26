import { Box, Card, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UserLogin() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  const handleLogin = () => {
    // mock login
    navigate(`/user/dashboard/${userId}`);
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
      <Card sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">
          User Login
        </Typography>

        <TextField
          fullWidth
          label="Employee ID"
          placeholder="EMP001"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleLogin}
          disabled={!userId}
        >
          Login
        </Button>
      </Card>
    </Box>
  );
}
