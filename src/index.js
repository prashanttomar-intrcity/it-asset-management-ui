import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f6f4f1", // beige-gray
      paper: "#ffffff",
    },
    primary: {
      main: "#1f2937", // dark slate
    },
    secondary: {
      main: "#64748b",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  </AuthProvider>
);
