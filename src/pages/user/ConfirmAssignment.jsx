import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { confirmAssignment } from "../../api/assets.api";

export default function ConfirmAssignment() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid confirmation link.");
      setLoading(false);
      return;
    }

    const confirm = async () => {
      try {
        const res = await confirmAssignment(token);
        setMessage(res.data.message || "Assignment confirmed successfully.");
      } catch (err) {
        setError(
          err.response?.data?.error || "Confirmation failed."
        );
      } finally {
        setLoading(false);
      }
    };

    confirm();
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f6f8",
      }}
    >
      <Paper sx={{ p: 5, width: 420, textAlign: "center" }}>
        {loading && <CircularProgress />}

        {!loading && message && (
          <>
            <Typography variant="h5" mb={2}>
              ✅ Success
            </Typography>
            <Alert severity="success">{message}</Alert>
          </>
        )}

        {!loading && error && (
          <>
            <Typography variant="h5" mb={2}>
              ❌ Error
            </Typography>
            <Alert severity="error">{error}</Alert>
          </>
        )}
      </Paper>
    </Box>
  );
}