import Layout from "../../components/common/Layout";
import { useEffect, useState } from "react";
import API from "../../services/api";
import StatCard from "../../components/cards/StatCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, RefreshCcw, TrendingUp, Users, Store, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);


    useEffect(() => {
    fetchDashboardData();
  }, []);

const fetchDashboardData = async () => {
  try {
    setLoading(true);
    
    // We call the newly mapped route
    const [usersRes, vendorsRes, chartRes] = await Promise.all([
      API.get("/users"),
      API.get("/vendors/all-vendors"),
      API.get("/orders/stats")
    ]);

    const actualUsers = usersRes.data.filter(u => 
      u.role?.toLowerCase() === 'user'
    );

    setUserCount(actualUsers.length);
    setVendorCount(vendorsRes.data.length);
    setChartData(chartRes.data);

  } catch (err) {
    console.error("Dashboard Error:", err);
  } finally {
    setLoading(false);
  }
};
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
              <LayoutDashboard className="text-emerald-600" size={28} /> Dashboard
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Real-time overview of your B2B ecosystem.</p>
          </div>
          
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            REFRESH DATA
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Database...</p>
          </div>
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              <StatCard 
                title="Total Users" 
                value={userCount} 
                change="+10%" 
                icon={Users}
                isUp={true}
                link="/admin-users" 
              />
              <StatCard 
                title="Total Vendors" 
                value={vendorCount} 
                change="+5%" 
                icon={Store}
                color="purple"
                isUp={true} 
                link="/admin-vendors"
              />
            </div>

            {/* Chart Section */}
            <div className="bg-white p-5 md:p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-500" /> Growth Overview
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order volume over time</p>
                </div>
              </div>

              <div className="h-[250px] md:h-[350px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#10b981" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-50 rounded-[2rem]">
                    <div className="bg-slate-50 p-4 rounded-full mb-3 text-slate-300">
                      <TrendingUp size={32} />
                    </div>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-tighter">Waiting for transaction data...</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}