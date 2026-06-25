import { useState } from "react";
import { User, Mail, Phone, Lock, UserPlus, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm({ ...form, phone: value });
    if (value.length === 10) {
      setErrors((prev) => ({ ...prev, phone: null }));
    }
  };

  const validate = async () => {
    let newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid business email.";
    }

    if (form.phone.length !== 10) {
      newErrors.phone = "Phone must be 10 digits.";
    }
    if (form.password.length < 8) {
      newErrors.password = "Min 8 characters required.";
    } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(form.password)) {
      newErrors.password = "Use at least one letter and one number.";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validate();
    
    if (isValid) {
      try {
        await onSubmit(form);
        // Direct login redirect
        navigate("/login", { state: { email: form.email, password: form.password } }); 
      } catch (err) {
        setErrors({ submit: "Registration failed. Please try again." });
      }
    }
  };

  const inputClass = (field) => `
    block w-full pl-11 pr-4 py-3 md:py-2.5 
    bg-gray-50 border rounded-2xl text-sm md:text-base transition-all duration-200
    focus:outline-none focus:ring-4 focus:bg-white
    ${errors[field] 
      ? "border-red-300 focus:ring-red-500/10 focus:border-red-500" 
      : "border-gray-100 focus:ring-emerald-500/10 focus:border-emerald-500"}
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
      {/* Full Name */}
      <div>
        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
            <User size={18} />
          </div>
          <input
            type="text"
            placeholder="John Doe"
            value={form.name} // Added value binding
            className={inputClass("name")}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 flex items-center gap-1 uppercase tracking-tighter"><AlertCircle size={12}/> {errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Business Email</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
            <Mail size={18} />
          </div>
          <input
            type="email"
            placeholder="john@company.com"
            value={form.email} // Added value binding
            className={inputClass("email")}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 flex items-center gap-1 uppercase tracking-tighter"><AlertCircle size={12}/> {errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Phone Number</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
            <Phone size={18} />
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="9876543210"
            value={form.phone}
            className={inputClass("phone")}
            onChange={handlePhoneChange}
          />
        </div>
        {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 flex items-center gap-1 uppercase tracking-tighter"><AlertCircle size={12}/> {errors.phone}</p>}
      </div>

      {/* Password Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Password Field */}
  <div>
    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
        <Lock size={18} />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={form.password}
        className={`${inputClass("password")} [&::-ms-reveal]:hidden [&::-ms-clear]:hidden`}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
    {errors.password && <p className="text-red-500 text-[9px] font-bold mt-1 leading-tight uppercase tracking-tighter">{errors.password}</p>}
  </div>

  {/* Confirm Password Field */}
  <div>
    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Confirm</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
        <Lock size={18} />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={form.confirmPassword}
        className={`${inputClass("confirmPassword")} [&::-ms-reveal]:hidden [&::-ms-clear]:hidden`}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      />
    </div>
    {errors.confirmPassword && <p className="text-red-500 text-[9px] font-bold mt-1 leading-tight uppercase tracking-tighter">{errors.confirmPassword}</p>}
  </div>
</div>

      <button
        type="submit"
        className="w-full flex justify-center items-center gap-2 py-4 md:py-3.5 mt-2 border border-transparent text-sm md:text-base font-black rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-xl shadow-emerald-500/10 transition-all duration-200"
      >
        <UserPlus size={20} />
        <span>Create An Account</span>
      </button>
    </form>
  );
}