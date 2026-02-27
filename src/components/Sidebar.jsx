import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

const linkStyle = {
  textDecoration: "none",
  color: "inherit",
};

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <DashboardOutlinedIcon /> },
  { label: "All Assets", path: "/admin/assets", icon: <Inventory2OutlinedIcon /> },
  { label: "Create Asset", path: "/admin/assets/new", icon: <AddBoxOutlinedIcon /> },
  { label: "Users", path: "/admin/users", icon: <PeopleAltOutlinedIcon /> },
  { label: "Create User", path: "/admin/users/new", icon: <PersonAddAltOutlinedIcon /> },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 260,
        bgcolor: "#0f172a", // dark slate
        color: "#e5e7eb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        py: 2,
      }}
    >
      {/* Brand */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography variant="h6" fontWeight={800} letterSpacing={0.5}>
          Asset<span style={{ color: "#38bdf8" }}>Hub</span>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Admin Panel
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <List sx={{ px: 1.5, mt: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={linkStyle}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  my: 0.5,
                  px: 2,
                  borderRadius: 2,
                  color: isActive ? "#0f172a" : "#e5e7eb",
                  bgcolor: isActive ? "#38bdf8" : "transparent",
                  "&:hover": {
                    bgcolor: isActive ? "#38bdf8" : "rgba(255,255,255,0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? "#0f172a" : "#94a3b8",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 14,
                  }}
                />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>
    </Box>
  );
}