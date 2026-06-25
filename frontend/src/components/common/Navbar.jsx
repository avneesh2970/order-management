import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";
import { ShoppingCart, User as UserIcon, ChevronDown, Package, LogOut, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/");
  };

  // Logic to determine if the sidebar toggle should be visible
  const showHamburger = user && (user.role === 'admin' || user.role === 'vendor');

  return (
    <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Hamburger - Now strictly conditional based on role */}
        {showHamburger && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        )}

        <Link to="/" className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
          B2B<span className="text-emerald-600">CONNECT</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Hide cart for admins/vendors if they don't shop */}
        {user && user.role === 'user' && (
          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-emerald-600 transition">
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                {cart.length}
              </span>
            )}
          </Link>
        )}

        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-gray-50 p-1 pr-2 md:pr-3 rounded-full hover:bg-gray-100 transition border border-gray-100"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs font-bold uppercase">
                {user.name?.charAt(0)}
              </div>
              <span className="hidden md:block text-sm font-bold text-gray-700">{user.name}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-3 w-48 md:w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-emerald-600">
                  <UserIcon size={16} /> My Profile
                </Link>
                {user.role === 'user' && (
                  <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-emerald-600">
                    <Package size={16} /> My Orders
                  </Link>
                )}
                <hr className="my-2 border-gray-50" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left font-bold transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="bg-slate-900 text-white px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition active:scale-95 shadow-lg shadow-slate-200">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}