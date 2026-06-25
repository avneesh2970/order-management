import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  LayoutDashboard, Package, PlusCircle, Users, Store, LogOut, ShoppingBag, X
} from "lucide-react";

export default function Sidebar({ role, isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
      ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
      : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        w-72 h-screen bg-[#0f172a] text-white p-6 
        flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute right-4 top-6 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div className="mb-10 px-4">
          <NavLink to="/" className="text-xl font-black text-white tracking-tight">
            B2B<span className="text-green-500">CONNECT</span>
          </NavLink>
        </div>

        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">
          {role} Control Center
        </p>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-2 flex-1" onClick={() => setIsOpen(false)}>
          {role === "vendor" && (
            <>
              <NavLink to="/vendor-dashboard" className={linkStyle}><LayoutDashboard size={18} /> Dashboard</NavLink>
              <NavLink to="/vendor-orders" className={linkStyle}><ShoppingBag size={18} /> Orders</NavLink>
              <NavLink to="/vendor-payments" className={linkStyle}><PlusCircle size={18} /> Vendor Payments</NavLink>
              <NavLink to="/vendor-products" className={linkStyle}><Package size={18} /> Products</NavLink>
              <NavLink to="/add-product" className={linkStyle}><PlusCircle size={18} /> Add Product</NavLink>

            </>
          )}

          {role === "admin" && (
            <>
              <NavLink to="/admin-dashboard" className={linkStyle}><LayoutDashboard size={18} /> Overview</NavLink>
              <NavLink to="/admin-users" className={linkStyle}><Users size={18} /> Users</NavLink>
              <NavLink to="/admin-orders" className={linkStyle}><ShoppingBag size={18} /> User Orders</NavLink>
              <NavLink to="/admin-vendors" className={linkStyle}><Store size={18} /> Vendors</NavLink>
              <NavLink to="/add-vendor" className={linkStyle}><PlusCircle size={18} /> Add Vendor</NavLink>
            </>
          )}
        </nav>

        {/* Logout Section */}
        <div className="mt-auto pt-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}