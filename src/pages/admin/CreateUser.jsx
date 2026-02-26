import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function CreateUser() {
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

            <TextField fullWidth label="Employee ID" sx={{ mb: 2 }} />

            <TextField fullWidth label="Full Name" sx={{ mb: 2 }} />

            <TextField fullWidth label="Email" type="email" sx={{ mb: 3 }} />

            <TextField fullWidth label="Password" sx={{ mb: 2 }} />

            <Button variant="contained" fullWidth>
              Create User
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
