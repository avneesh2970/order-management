import RegisterForm from "../../components/forms/RegisterForm";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (form) => {
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match!");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      // It's helpful to show a brief success state before navigating
      navigate("/login?registered=true");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Email might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      {/* Branding & Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight transition-opacity hover:opacity-80">
          B2B<span className="text-green-600">CONNECT</span>
        </Link>
        <h2 className="mt-6 text-2xl md:text-3xl font-black tracking-tight text-slate-800">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Join the marketplace and start connecting with vendors.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl shadow-slate-200/60 rounded-[2rem] sm:px-10 border border-slate-100 relative overflow-hidden">
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
              <div className="h-8 w-8 border-4 border-slate-100 border-t-green-600 rounded-full animate-spin mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Creating Account...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Registration Form */}
          <div className="transition-all">
            <RegisterForm onSubmit={handleRegister} />
          </div>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-tighter">
                <span className="bg-white px-4 text-slate-400 font-bold">Already a member?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                to="/login" 
                className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border-2 border-slate-50 text-sm font-black text-slate-600 hover:bg-slate-50 hover:text-green-600 transition-all active:scale-[0.98]"
              >
                Sign in to your dashboard <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Responsive Benefits Section */}
        <div className="mt-10 grid grid-cols-1 xs:grid-cols-3 gap-4 sm:gap-2 px-2">
          {[
            { label: "Secure SSL", icon: CheckCircle2 },
            { label: "Verified Vendors", icon: CheckCircle2 },
            { label: "24/7 Support", icon: CheckCircle2 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-center gap-1.5 text-slate-400">
              <item.icon size={14} className="text-green-500 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}