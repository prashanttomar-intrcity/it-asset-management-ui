import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return <AppRoutes />;
}

export default App;