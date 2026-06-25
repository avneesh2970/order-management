import { useState, useEffect } from "react";
import { 
  Store, User, Mail, Phone, MapPin, Lock, 
  Upload, X, Building, Home, Link as LinkIcon, 
  AlertCircle, Globe, CheckCircle2, Tag, Plus
} from "lucide-react";
import API from "../../services/api";

const InputField = ({ label, name, icon: Icon, type = "text", placeholder, isTextArea = false, value, onChange, error }) => (
  <div className="flex flex-col w-full">
    <label className="text-[10px] font-black text-slate-400 mb-1.5 uppercase ml-1 tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400"><Icon size={18} /></div>
      {isTextArea ? (
        <textarea 
          name={name} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          rows="2"
          className={`w-full bg-slate-50 border ${error ? 'border-red-300 ring-1 ring-red-50' : 'border-slate-100'} rounded-2xl py-3 pl-10 pr-4 text-sm font-semibold focus:border-emerald-500 outline-none transition-all resize-none shadow-sm`} 
        />
      ) : (
        <input 
          type={type} 
          name={name} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          className={`w-full bg-slate-50 border ${error ? 'border-red-300 ring-1 ring-red-50' : 'border-slate-100'} rounded-2xl py-3 pl-10 pr-4 text-sm font-semibold focus:border-emerald-500 outline-none transition-all shadow-sm`} 
        />
      )}
    </div>
    {error && <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase"><AlertCircle size={10} /> {error}</span>}
  </div>
);

export default function BusinessRegisterForm({ onCancel }) {
  const initialState = {
    companyName: "", ownerName: "", email: "", phone: "", 
    categories: [], // Changed to match AddVendor
    image: "", imageFile: null, streetAddress: "", city: "", state: "", pincode: "", password: ""
  };

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [imageMode, setImageMode] = useState("link"); 
  const [customCategory, setCustomCategory] = useState("");
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    return () => { if (preview && imageMode === "upload") URL.revokeObjectURL(preview); };
  }, [preview, imageMode]);

  const categoryOptions = ["Logistics", "Food & Beverage", "Technology", "Retail", "Manufacturing", "Healthcare", "Services"];
  
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const handleValidatedChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "pincode") {
      if (value !== "" && !/^\d+$/.test(value)) return;
      if (name === "phone" && value.length > 10) return;
      if (name === "pincode" && value.length > 6) return;
    }
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const toggleCategory = (cat) => {
    let updatedCategories = [...form.categories];
    if (updatedCategories.includes(cat)) {
      updatedCategories = updatedCategories.filter(item => item !== cat);
    } else {
      updatedCategories.push(cat);
    }
    setForm({ ...form, categories: updatedCategories });
    if (errors.categories) setErrors({ ...errors, categories: null });
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !form.categories.includes(customCategory.trim())) {
      setForm({ ...form, categories: [...form.categories, customCategory.trim()] });
      setCustomCategory("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imageFile: file, image: "" });
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    let err = {};
    if (!form.companyName.trim()) err.companyName = "Required";
    if (!form.ownerName.trim()) err.ownerName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Invalid email";
    if (form.phone.length !== 10) err.phone = "10 digits required";
    if (form.categories.length === 0) err.categories = "Select at least one";
    if (!form.streetAddress.trim()) err.streetAddress = "Required";
    if (!form.city.trim()) err.city = "Required";
    if (!form.state) err.state = "Required";
    if (form.pincode.length !== 6) err.pincode = "Invalid";
    if (form.password.length < 6) err.password = "Min 6 chars";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

 const submit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);

  try {
    const formData = new FormData();
    
    // 1. Append Text Fields
    formData.append("companyName", form.companyName);
    formData.append("ownerName", form.ownerName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("password", form.password);
    formData.append("streetAddress", form.streetAddress);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("pincode", form.pincode);

      formData.append("category", form.categories.join(", ")); 

    if (imageMode === "upload" && form.imageFile) {
      formData.append("image", form.imageFile);
    } else if (form.image && form.image.trim() !== "") {
      formData.append("image", form.image);
    }

    const response = await API.post("/auth/register-vendor", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert(response.data.msg || "Application Submitted Successfully!");
    
    // Reset Form
    setForm(initialState);
    setPreview(null);
    if (onCancel) onCancel();
    
  } catch (err) {
    const errorMsg = err.response?.data?.msg || "Registration failed. Please check all fields.";
    alert(errorMsg);
    console.error("Submission Error:", err.response?.data);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full mx-auto animate-in fade-in zoom-in duration-300">
      <form onSubmit={submit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Company Name" name="companyName" icon={Store} placeholder="Goyal Industries" value={form.companyName} onChange={handleValidatedChange} error={errors.companyName} />
          <InputField label="Owner Name" name="ownerName" icon={User} placeholder="Full Name" value={form.ownerName} onChange={handleValidatedChange} error={errors.ownerName} />
          <InputField label="Email Address" name="email" type="email" icon={Mail} placeholder="vendor@biz.com" value={form.email} onChange={handleValidatedChange} error={errors.email} />
          <InputField label="Phone" name="phone" icon={Phone} placeholder="10-digit mobile" value={form.phone} onChange={handleValidatedChange} error={errors.phone} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Category Selection Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Categories (Multiple)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {categoryOptions.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    form.categories.includes(cat) 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={16} className="absolute left-3 top-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Add Custom..." 
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-9 pr-4 text-xs font-bold outline-none focus:border-emerald-500"
                />
              </div>
              <button type="button" onClick={addCustomCategory} className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all">
                <Plus size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {form.categories.map(cat => (
                <span key={cat} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-black uppercase">
                  {cat}
                  <X size={12} className="cursor-pointer hover:text-rose-500" onClick={() => toggleCategory(cat)} />
                </span>
              ))}
            </div>
            {errors.categories && <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase"><AlertCircle size={10} /> {errors.categories}</span>}
          </div>

          {/* Logo Section */}
          <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Business Logo</span>
              <div className="flex bg-white p-1 rounded-xl shadow-inner border border-slate-100">
                {["upload", "link"].map(mode => (
                  <button key={mode} type="button" onClick={() => setImageMode(mode)} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${imageMode === mode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>{mode}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {imageMode === "upload" ? (
                <label className="flex-1 h-20 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-white transition-all">
                  <Upload size={18} className="text-slate-300 mb-1" />
                  <span className="text-[9px] font-black text-slate-400 uppercase">Upload</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="flex-1 relative">
                  <LinkIcon size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input type="text" placeholder="URL..." value={form.image} onChange={(e) => { setForm({ ...form, image: e.target.value, imageFile: null }); setPreview(e.target.value); }} className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:border-emerald-500" />
                </div>
              )}
              {preview && (
                <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-lg shrink-0">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setPreview(null); setForm({ ...form, image: "", imageFile: null }) }} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full"><X size={10} /></button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <InputField label="Street Address" name="streetAddress" icon={MapPin} isTextArea placeholder="Shop/Office number and street..." value={form.streetAddress} onChange={handleValidatedChange} error={errors.streetAddress} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="City" name="city" icon={Building} placeholder="e.g. Dehradun" value={form.city} onChange={handleValidatedChange} error={errors.city} />
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 mb-1.5 uppercase ml-1 tracking-widest">State</label>
              <div className="relative">
                <Globe size={18} className="absolute left-3 top-3 text-slate-400" />
                <select name="state" value={form.state} onChange={handleValidatedChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-semibold focus:border-emerald-500 outline-none appearance-none transition-all shadow-sm">
                  <option value="">Select State</option>
                  {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {errors.state && <span className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.state}</span>}
            </div>
            <InputField label="Pincode" name="pincode" icon={Home} placeholder="6-digit PIN" value={form.pincode} onChange={handleValidatedChange} error={errors.pincode} />
          </div>
          <InputField label="Secure Password" name="password" type="password" icon={Lock} placeholder="Minimum 6 characters" value={form.password} onChange={handleValidatedChange} error={errors.password} />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={20} />}
            {loading ? "Submitting Application..." : "Submit Application"}
          </div>
        </button>
      </form>
    </div>
  );
}