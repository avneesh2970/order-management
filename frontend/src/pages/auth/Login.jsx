import { useState, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  ShieldCheck, AlertCircle, ArrowRight, Building2, 
  User, Clock, ChevronLeft, ShieldAlert, LogOut 
} from "lucide-react";
import LoginForm from "../../components/forms/LoginForm";
import BusinessRegisterForm from "../../components/forms/BusinessRegisterForm";
import API from "../../services/api";
import { useAuth } from "../../context/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("user"); 
  const [isBusinessRegistering, setIsBusinessRegistering] = useState(false);
  
  // ✅ State to handle the "Waiting Room" view
  const [pendingApproval, setPendingApproval] = useState(null);

  const showSuccess = useMemo(() => {
    return new URLSearchParams(location.search).get("registered") === "true";
  }, [location.search]);

  const handleLogin = async (form) => {
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      const role = res.data.role;
      
      // Role Cross-Check Logic
      if (accountType === "user" && (role === "vendor" || role === "admin")) {
        throw { response: { data: { msg: "Please use the Business tab for staff login." } } };
      }
      if (accountType === "vendor" && role === "user") {
        throw { response: { data: { msg: "Please use the Personal tab for user login." } } };
      }

      login(res.data);
      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "vendor") navigate("/vendor-dashboard");
      else navigate("/");
      
    } catch (err) {
      // ✅ Specific handling for Vendor Approval (403)
      if (err.response?.status === 403 && accountType === "vendor") {
        setPendingApproval(err.response.data.msg || "Account pending admin approval.");
      } else {
        setError(err.response?.data?.msg || "Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- 1. WAITING ROOM UI (Rendered only for Vendors with 403) ---
  if (pendingApproval) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/60 border border-slate-100 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} className="animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">
            Application Pending
          </h2>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            {pendingApproval}
          </p>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left">
            <ShieldAlert className="text-amber-600 shrink-0" size={18} />
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
              Your business details are under review. You will gain access once verified by our admin.
            </p>
          </div>

          <button 
            onClick={() => setPendingApproval(null)}
            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            <LogOut size={16} /> Back to Login
          </button>
        </div>
      </div>
    );
  }

  // --- 2. STANDARD LOGIN/REGISTER UI ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md text-center mb-8">
        <Link to="/" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          B2B<span className="text-emerald-600">CONNECT</span>
        </Link>
      </div>

      <div className={`w-full transition-all duration-500 ease-in-out ${isBusinessRegistering ? 'max-w-4xl' : 'max-w-md'}`}>
        <div className="bg-white shadow-2xl shadow-slate-200/60 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 overflow-hidden">
          
          {isBusinessRegistering && (
            <div className="bg-emerald-600 p-4 px-6 sm:px-10 flex items-center justify-between text-white">
              <button 
                onClick={() => setIsBusinessRegistering(false)}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-emerald-100 transition-colors"
              >
                <ChevronLeft size={16} /> Back to Login
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Vendor Application</span>
            </div>
          )}

          <div className="p-6 sm:p-10">
            {!isBusinessRegistering && (
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                <button 
                  onClick={() => { setAccountType("user"); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    accountType === 'user' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <User size={14} /> Personal
                </button>
                <button 
                  onClick={() => { setAccountType("vendor"); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    accountType === 'vendor' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Building2 size={14} /> Business
                </button>
              </div>
            )}

            {error && (
              <div className={`mb-6 p-4 border text-[11px] font-bold rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 bg-rose-50 border-rose-100 text-rose-700`}>
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="transition-all">
              {accountType === "vendor" && isBusinessRegistering ? (
                <div className="max-h-[70vh] md:max-h-none overflow-y-auto custom-scrollbar px-1">
                   <BusinessRegisterForm onCancel={() => setIsBusinessRegistering(false)} />
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                      {accountType === "vendor" ? "Business Login" : "Personal Login"}
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">Please enter your credentials to continue</p>
                  </div>
                  
                  <LoginForm 
                    onSubmit={handleLogin} 
                    onForgotPassword={() => navigate("/forgot-password")}
                  />

                  <div className="mt-8 pt-8 border-t border-slate-50">
                    {accountType === "user" ? (
                      <Link 
                        to="/register" 
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-50 text-[10px] font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest"
                      >
                        Create Personal Account <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <button 
                        onClick={() => setIsBusinessRegistering(true)}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-50 text-[10px] font-black text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-widest"
                      >
                        Register New Business <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-slate-400 text-[10px] font-medium uppercase tracking-[0.2em]">
          Secure 256-bit SSL Encrypted Portal
        </p>
      </div>
    </div>
  );
}