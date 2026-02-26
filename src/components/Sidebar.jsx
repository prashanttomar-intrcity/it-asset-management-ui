import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";

const linkStyle = {
  textDecoration: "none",
  color: "inherit",
};

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "#56775c",
        color: "white",
        minHeight: "100vh",
        pt: 2,
      }}
    >
      <List>
        {[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "All Assets", path: "/admin/assets" },
          { label: "Create Asset", path: "/admin/assets/new" },
          { label: "Users", path: "/admin/users" },
          { label: "Create User", path: "/admin/users/new" },
        ].map((item) => (
          <NavLink key={item.path} to={item.path} style={linkStyle}>
            <ListItemButton
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                "&.active": {
                  bgcolor: "#1f2937",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </Box>
  );
}
