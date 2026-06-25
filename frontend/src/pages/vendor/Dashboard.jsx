import Layout from "../../components/common/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for logout redirection
import API from "../../services/api";
import StatCard from "../../components/cards/StatCard";
import { 
  LayoutDashboard, TrendingUp, Clock, 
  CheckCircle, ShieldAlert, LogOut 
} from "lucide-react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/orders/vendor")
      .then((res) => {
        setOrders(res.data);
        setIsPending(false);
      })
      .catch((err) => {
        // ✅ Check if backend blocked access due to pending status (403)
        if (err.response?.status === 403) {
          setIsPending(true);
          setPendingMessage(err.response.data.msg);
        } else {
          console.error("Dashboard fetch error:", err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const goToOrders = () => {
    navigate(`/vendor-orders`);
  };

  // --- WAITING ROOM UI ---
  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} className="animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">
            Application Pending
          </h2>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            {pendingMessage || "Our team is currently reviewing your business details. You will gain full access once your account is verified."}
          </p>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left">
            <ShieldAlert className="text-amber-600 shrink-0" size={18} />
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
              Security Note: You cannot add products or manage orders until the Admin grants approval.
            </p>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            <LogOut size={16} /> Sign Out & Check Later
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD UI ---
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Vendor Overview
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest">
              Real-time Business Analytics
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="transition-transform active:scale-95">
                <StatCard 
                title="Gross Revenue" 
                value={`₹${totalRevenue.toLocaleString()}`} 
                icon={TrendingUp} 
                color="emerald"
                />
            </div>

            {/* 2. Total Orders Card - Links to all orders */}
            <div 
                onClick={() => goToOrders("vendor-orders")}
                className="cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
            >
                <StatCard 
                title="Total Orders" 
                value={orders.length} 
                icon={LayoutDashboard} 
                color="blue"
                />
            </div>

            {/* 3. Pending Card - Links to filtered pending orders */}
            <div 
                onClick={() => goToOrders("vendor-orders")}
                className="cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
            >
                <StatCard
                title="Pending Action"
                value={orders.filter((o) => o.status?.toLowerCase() === "pending").length}
                icon={Clock} 
                color="orange"
                />
            </div>

            {/* 4. Successful Card - Links to delivered orders */}
            <div 
                onClick={() => goToOrders("vendor-orders")}
                className="cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
            >
                <StatCard
                title="Successful"
                value={orders.filter((o) => ["delivered", "completed"].includes(o.status?.toLowerCase())).length}
                icon={CheckCircle} 
                color="purple"
                />
            </div>
          </div>
        )}
        <div className="mt-10 p-10 border-2 border-dashed border-slate-200 rounded-[3rem] text-center">
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                Detailed Analytics & Order History Coming Soon
             </p>
        </div>
      </div>
    </Layout>
  );
}