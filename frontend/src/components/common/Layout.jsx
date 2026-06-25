import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/useAuth";
import { useState } from "react";
import { Menu } from "lucide-react"; // For the mobile toggle

export default function Layout({ children }) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Logic: Sidebar only for Admin/Vendor.
  const isManagement = user && (user.role === "admin" || user.role === "vendor");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Show standard Navbar for Customers/Guests 
          2. Show a "Mobile Header" for Admin/Vendor so they can toggle the sidebar
      */}
      {!isManagement ? (
        <Navbar />
      ) : (
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <span className="font-black text-slate-900 tracking-tight">
              B2B<span className="text-emerald-600">CONNECT</span>
            </span>
          </div>
          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold uppercase">
            {user?.name?.charAt(0)}
          </div>
        </header>
      )}

      <div className="flex flex-1 relative">
        {/* Sidebar now receives the state and the setter */}
        {isManagement && (
          <Sidebar 
            role={user.role} 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
          />
        )}

        <main className={`
          flex-1 
          p-4 md:p-8 
          transition-all duration-300
          ${!isManagement ? "max-w-7xl mx-auto w-full" : "w-full"}
        `}>
          {children}
        </main>
      </div>
    </div>
  );
}