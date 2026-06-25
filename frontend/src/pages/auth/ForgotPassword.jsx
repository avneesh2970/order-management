import { useState } from "react";
import { Mail, KeyRound, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/send-otp", { email: email.toLowerCase() });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.msg || "Email not found in our records.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/reset-password", { 
        email: email.toLowerCase(), 
        otp, 
        newPassword 
      });
      navigate("/login?reset=success");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="text-3xl font-black text-slate-900 tracking-tight">
          B2B<span className="text-emerald-600">CONNECT</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl shadow-slate-200/60 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing...</p>
            </div>
          )}

          <h2 className="text-2xl font-black text-slate-800 mb-2">
            {step === 1 ? "Reset Access" : "Verify OTP"}
          </h2>
          <p className="text-sm text-slate-500 mb-8 font-medium">
            {step === 1 
              ? "Enter your email to receive a secure 6-digit code." 
              : `Code sent to ${email}`}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl animate-in fade-in zoom-in">
              {error}
            </div>
          )}

          <form onSubmit={step === 1 ? handleSendOTP : handleReset} className="space-y-5">
            {step === 1 ? (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600">
                  <Mail size={18} />
                </div>
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="6-Digit Code"
                    maxLength="6"
                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600">
                    <KeyRound size={18} />
                  </div>
                  <input
                    required
                    type="password"
                    placeholder="New Secure Password"
                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
            >
              {step === 1 ? "Send Reset Code" : "Update Password"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}