import { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginForm({ onSubmit, onForgotPassword }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
      {/* Email Field */}
      <div>
        <label className="block text-[11px] md:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
            <Mail size={18} />
          </div>
          <input
            required
            type="email"
            placeholder="name@company.com"
            className="block w-full pl-11 pr-4 py-3 md:py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-sm md:text-base"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <div className="flex justify-between items-center mb-1.5 ml-1">
          <label className="block text-[11px] md:text-sm font-bold text-gray-500 uppercase tracking-wider">
            Password
          </label>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
            <Lock size={18} />
          </div>
          <input
            required
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="block w-full pl-11 pr-12 py-3 md:py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-sm md:text-base 
  [&::-ms-reveal]:hidden [&::-ms-clear]:hidden" 
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end px-1">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-[11px] md:text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="group relative w-full flex justify-center items-center py-3.5 md:py-3 px-4 border border-transparent text-sm md:text-base font-black rounded-2xl text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-200 shadow-lg shadow-slate-200"
      >
        <span>Sign Into Portal</span>
        <ArrowRight size={18} className="ml-2 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </button>
    </form>
  );
}