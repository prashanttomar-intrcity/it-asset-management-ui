import { Box, Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
    } catch (err) {
      // ignore error – logout should always work
      console.warn("Logout API error (safe to ignore)");
    } finally {
      // 🔥 REAL LOGOUT
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        height: 64,
        bgcolor: "#0b1220",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        px: 3,
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
      }}
    >
      <Button
        startIcon={<LogoutOutlinedIcon />}
        variant="outlined"
        onClick={handleLogout}
        sx={{
          color: "#e5e7eb",
          borderColor: "rgba(255,255,255,0.2)",
          textTransform: "none",
          borderRadius: 999,
          px: 2,
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.08)",
            borderColor: "rgba(255,255,255,0.35)",
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}
