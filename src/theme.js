import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#374151" }, // dark grey
    secondary: { main: "#6b7280" }, // grey
    background: {
      default: "#f5f6f8", // light beige/grey
      paper: "#ffffff",
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `"Inter","Roboto",sans-serif`,
  },
});

export default theme;
