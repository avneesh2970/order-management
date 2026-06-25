import { Routes, Route } from "react-router-dom";

import Home from "./pages/user/Home";
import VendorDetails from "./pages/user/VendorDetails";
import Cart from "./pages/user/Cart";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";

import VendorDashboard from "./pages/vendor/Dashboard";
import VendorOrders from "./pages/vendor/Orders";
import VendorPayments from "./pages/vendor/VendorPayments";
import Products from "./pages/vendor/Products";
import AddProduct from "./pages/vendor/AddProduct";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/UserOrders";
import Users from "./pages/admin/Users";
import Vendors from "./pages/admin/Vendors";
import AddVendor from "./pages/admin/AddVendor";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ================= USER (PUBLIC) ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/vendor/:id" element={<VendorDetails />} />

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ================= USER (PROTECTED) ================= */}
      <Route path="/cart" element={<ProtectedRoute role="user"><Cart /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute role="user"><Orders /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />

      {/* ================= VENDOR ================= */}
      <Route path="/vendor-dashboard" element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>} />
      <Route path="/vendor-orders" element={<ProtectedRoute role="vendor"><VendorOrders /></ProtectedRoute>} />

      {/* LEDGER ROUTE */}
      <Route path="/vendor-payments" element={<ProtectedRoute role="vendor"><VendorPayments /></ProtectedRoute>} />

      <Route path="/vendor-products" element={<ProtectedRoute role="vendor"><Products /></ProtectedRoute>} />
      <Route path="/add-product" element={<ProtectedRoute role="vendor"><AddProduct /></ProtectedRoute>} />

      {/* ================= ADMIN ================= */}
      <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin-users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
      <Route path="/admin-orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin-vendors" element={<ProtectedRoute role="admin"><Vendors /></ProtectedRoute>} />
      <Route path="/add-vendor" element={<ProtectedRoute role="admin"><AddVendor /></ProtectedRoute>} />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;