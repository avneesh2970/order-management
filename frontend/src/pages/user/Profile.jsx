import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import { useAuth } from "../../context/useAuth";
import API from "../../services/api";
import { 
  User, Mail, Shield, LogOut, Settings, 
  X, ShoppingBag, Menu, Save, RefreshCw, Camera
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Profile() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [user, location.state]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/users/profile", formData);
      login({ ...res.data, token: user.token }); 
      alert("Profile updated successfully!");
      setActiveTab("profile");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] bg-[#f8f9fb] overflow-hidden relative">
        
        {/* --- MOBILE OVERLAY --- */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* --- RESPONSIVE SIDEBAR --- */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
          <div className="mb-10 px-2 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 tracking-tight">B2B Connect</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Customer Portal</p>
              </div>
            </div>
            <button className="lg:hidden p-2 hover:bg-slate-50 rounded-xl" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
          </div>

          <nav className="space-y-2 flex-1">
             <button 
                onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
             >
                <User size={20} /> My Profile
             </button>
             <button 
                onClick={() => navigate('/orders')} 
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all"
             >
                <ShoppingBag size={20} /> My Orders
             </button>
             <button 
                onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
             >
                <Settings size={20} /> Account Settings
             </button>
          </nav>

          <button onClick={logout} className="mt-auto w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={20}/> Sign Out
          </button>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-3xl mx-auto">
            {/* UPDATED MOBILE HEADER ALIGNMENT */}
            <header className="lg:hidden flex items-center gap-4 mb-8">
                <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm transition-colors"><Menu size={20}/></button>
                <h1 className="font-black text-xs uppercase tracking-widest text-slate-400">{activeTab}</h1>
            </header>
            
            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight">Personal Profile</h1>
                <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="h-32 md:h-40 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                  </div>
                  
                  <div className="relative px-6 md:px-8 pb-10">
                    <div className="absolute -top-12 md:-top-16 left-6 md:left-8">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] md:rounded-[2.5rem] border-4 md:border-8 border-white flex items-center justify-center shadow-xl overflow-hidden group relative">
                        {user?.profilePic ? (
                          <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User size={48} className="text-slate-900" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                            <Camera size={24}/>
                        </div>
                      </div>
                    </div>

                    <div className="pt-16 md:pt-20">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900">{user?.name}</h2>
                            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
                                <Shield size={12}/> Verified Account
                            </span>
                        </div>
                        <button onClick={() => setActiveTab('settings')} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">Edit Details</button>
                      </div>

                      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-md">
                          <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm"><Mail size={22}/></div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Email</p>
                            <p className="font-bold text-slate-700 truncate">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-md">
                          <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm"><ShoppingBag size={22}/></div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Type</p>
                            <p className="font-bold text-slate-700 capitalize">{user?.role || "Customer"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                    <p className="text-sm md:text-base text-slate-500 font-medium">Update your security and contact preferences</p>
                </header>

                <form onSubmit={handleUpdate} className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 p-6 md:p-12 shadow-sm space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 md:py-5 font-bold outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-900 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 md:py-5 font-bold outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-900 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full md:w-auto px-12 py-4 md:py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-600 active:scale-95 disabled:opacity-50 transition-all"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                        Apply Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}