import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "../pages/auth/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import AssetList from "../pages/admin/AssetList";
import AssetDetails from "../pages/admin/AssetDetails";
import Users from "../pages/admin/Users";
import CreateUser from "../pages/admin/CreateUser";
import CreateAsset from "../pages/admin/CreateAsset";
import UserDetails from "../pages/admin/UserDetails";
import AllAssets from "../pages/admin/AllAssets";
import UserLogin from "../pages/auth/UserLogin";
import UserDashboard from "../pages/user/UserDashboard";
import RequireAuth from "../components/RequireAuth";
import ConfirmAssignment from "../pages/user/ConfirmAssignment";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* <Route path="/admin/dashboard" element={<Dashboard />} /> */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/assets"
          element={
            <RequireAuth>
              <AllAssets />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RequireAuth>
              <Users />
            </RequireAuth>
          }
        />

        <Route path="/admin/assets/laptops" element={<AssetList />} />
        <Route path="/admin/assets/new" element={<CreateAsset />} />
        <Route path="/admin/assets/:id" element={<AssetDetails />} />
        <Route path="/admin/assets/create" element={<CreateAsset />} />
        <Route path="/admin/assets/:id/edit" element={<CreateAsset />} />

        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/new" element={<CreateUser />} />
        <Route path="/admin/users/:userId" element={<UserDetails />} />
        <Route path="/admin/assets" element={<AllAssets />} />
<Route path="/confirm-assignment" element={<ConfirmAssignment />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/dashboard/:userId" element={<UserDashboard />} />

        <Route path="*" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
