import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

/* 🔹 USERS DATA */
const users = [
  {
    id: "EMP001",
    name: "Rahul Sharma",
    email: "rahul@company.com",
    laptop: "AST-001",
  },
  {
    id: "EMP002",
    name: "Neha Singh",
    email: "neha@company.com",
    laptop: null,
  },
  {
    id: "EMP003",
    name: "Parth Tomar",
    email: "parth@company.com",
    laptop: "AST-002",
  },
  {
    id: "EMP004",
    name: "Ansh Raghav",
    email: "ansh@company.com",
    laptop: "AST-003",
  },
  {
    id: "EMP005",
    name: "Utkarsh Singhania",
    email: "utkarsh@company.com",
    laptop: null,
  },
];

export default function Users() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f5f7" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Users
          </Typography>

          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#f0f1f3" }}>
                <TableRow>
                  <TableCell>
                    <b>Employee ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell>
                    <b>Assigned Laptop</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#f9fafb" },
                    }}
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.laptop ? (
                        <Chip
                          label={user.laptop}
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="Not Assigned"
                          color="warning"
                          size="small"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
