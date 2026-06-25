import Layout from "../../components/common/Layout";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import API from "../../services/api";
import {
  Trash2, ShoppingBag, ArrowRight, User, Mail, Phone, Package,
  Hash, Truck, Lock, ChevronLeft, Plus, Minus, CheckCircle2,
  MapPin, Landmark, ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || ""
      }));
    }
  }, [user]);

  const validate = () => {
    let newErrors = {};
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "10 digits required";
    if (formData.address.trim().length < 8) newErrors.address = "Detailed address required";
    if (!formData.city.trim()) newErrors.city = "Required";
    if (!formData.state.trim()) newErrors.state = "Required";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "pincode") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      const limit = name === "phone" ? 10 : 6;
      if (onlyNums.length <= limit) setFormData(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const placeOrder = async () => {
    if (!user || cart.length === 0 || !validate()) return;
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state}`,
        pincode: formData.pincode,
        vendor: cart[0]?.vendor?._id || cart[0]?.vendor,
        items: cart.map(c => ({
          product: c._id,
          name: c.name,
          quantity: c.quantity || 1,
          price: c.price
        })),
        totalAmount: total,
        status: "pending"
      };
      await API.post("/orders", orderPayload);
      clearCart();
      setIsOrdered(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrdered) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-200 blur-2xl rounded-full opacity-50 animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-emerald-500 text-white rounded-full mb-8 shadow-xl">
              <CheckCircle2 size={48} />
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Order Confirmed!</h1>
          <p className="text-slate-500 font-medium text-lg mb-12 max-w-md mx-auto leading-relaxed">
            Your request has been successfully transmitted. The vendor will review it shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 transition-all">
              GO TO DASHBOARD
            </Link>
            <Link to="/" className="bg-white border-2 border-slate-100 text-slate-600 px-10 py-5 rounded-2xl font-black hover:bg-slate-50 transition-all">
              CONTINUE BROWSING
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-4 hover:text-emerald-600 transition-colors">
              <ChevronLeft size={16} /> Back to store
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
              Review & Pay <ShoppingBag className="text-emerald-500" size={32} />
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3 text-slate-400 font-bold text-sm">
            <ShieldCheck size={18} className="text-emerald-500" /> Secure Checkout
          </div>
        </div>

        {!user ? (
          <div className="text-center py-32 bg-slate-50 rounded-[4rem] border border-slate-100">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-8">
              <Lock size={32} className="text-slate-300" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">Authentication Required</h2>
            <p className="text-slate-400 mb-10 font-medium">Please sign in to complete your transaction.</p>
            <Link to="/login" className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black hover:scale-105 transition-transform inline-block">LOG IN NOW</Link>
          </div>
        ) : cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-12">

              {/* SECTION 1: ITEMS SUMMARY (Moved to Top) */}
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 px-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs italic">1</span>
                  Inventory Summary
                </h2>
                <div className="space-y-4 px-2">
                  {cart.map(item => (
                    <div key={item._id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-100/50 transition-all group">
                      <div className="flex items-center gap-5 w-full sm:w-auto">
                        <div className="w-20 h-20 bg-slate-50 rounded-[1.7rem] flex items-center justify-center text-emerald-600 border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500 overflow-hidden">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : <Package size={28} />}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 text-base mb-1 truncate">{item.name}</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-emerald-600 font-black text-lg">₹{item.price?.toLocaleString()}</span>
                            <span className="text-slate-300 text-sm">/ unit</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between bg-slate-50/50 p-2 rounded-2xl">
                        <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                          <button onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-500"><Minus size={14} /></button>
                          <span className="px-5 font-black text-sm text-slate-800">{item.quantity || 1}</span>
                          <button onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)} className="p-2 hover:bg-slate-50 rounded-lg text-emerald-600"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item._id)} className="p-3 text-slate-300 hover:text-white hover:bg-red-500 rounded-xl transition-all"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: Profile Cards */}
              <div className="bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-2">
                <div className="w-full md:w-1/2 bg-emerald-50/50 p-6 rounded-[2rem] flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600"><User size={20} /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-emerald-700/40 uppercase tracking-[0.1em]">Purchaser</p>
                    <p className="font-bold text-slate-800 truncate">{user.name}</p>
                  </div>
                </div>
                <div className="w-full md:w-1/2 bg-slate-50/50 p-6 rounded-[2rem] flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400"><Mail size={20} /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Billing Email</p>
                    <p className="font-bold text-slate-800 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: DELIVERY FORM */}
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs italic">2</span>
                  Delivery Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="relative group">
                    <label className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-black uppercase text-slate-400 tracking-widest z-10">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full pl-12 pr-4 py-5 bg-slate-50 border-2 ${errors.phone ? 'border-red-200 bg-red-50/20' : 'border-transparent focus:border-emerald-500 focus:bg-white'} rounded-[1.5rem] font-bold text-sm transition-all outline-none`} placeholder="9876543210" />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-black uppercase text-slate-400 tracking-widest z-10">Zip / Pincode</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input name="pincode" value={formData.pincode} onChange={handleInputChange} className={`w-full pl-12 pr-4 py-5 bg-slate-50 border-2 ${errors.pincode ? 'border-red-200 bg-red-50/20' : 'border-transparent focus:border-emerald-500 focus:bg-white'} rounded-[1.5rem] font-bold text-sm transition-all outline-none`} placeholder="000000" />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-black uppercase text-slate-400 tracking-widest z-10">City</label>
                    <div className="relative">
                      <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input name="city" value={formData.city} onChange={handleInputChange} className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[1.5rem] font-bold text-sm transition-all outline-none" />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-black uppercase text-slate-400 tracking-widest z-10">State / Province</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input name="state" value={formData.state} onChange={handleInputChange} className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[1.5rem] font-bold text-sm transition-all outline-none" />
                    </div>
                  </div>

                  <div className="md:col-span-2 relative group">
                    <label className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-black uppercase text-slate-400 tracking-widest z-10">Full Address</label>
                    <div className="relative">
                      <Truck className="absolute left-5 top-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <textarea name="address" rows="3" value={formData.address} onChange={handleInputChange} className={`w-full pl-12 pr-6 py-5 bg-slate-50 border-2 ${errors.address ? 'border-red-200 bg-red-50/20' : 'border-transparent focus:border-emerald-500 focus:bg-white'} rounded-[2rem] font-bold text-sm transition-all outline-none resize-none`} placeholder="Shop No, Area, Landmark..." />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar - Sticky Total */}
            <div className="lg:col-span-5">
              <div className="sticky top-10">
                <div className="bg-slate-900 p-10 rounded-[4rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                  <h2 className="text-xl font-black text-white mb-10 tracking-tight border-b border-white/10 pb-6 flex justify-between items-center">
                    Final Total
                    <span className="text-xs bg-white/10 px-3 py-1 rounded-full font-bold text-emerald-400 uppercase tracking-widest">INR</span>
                  </h2>

                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between text-slate-400 font-bold">
                      <span>Subtotal</span>
                      <span className="text-white">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-bold">
                      <span>Handling Fee</span>
                      <span className="text-emerald-400">FREE</span>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total to Pay</p>
                        <p className="text-5xl font-black text-white">₹{total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={isSubmitting}
                    className="group relative w-full bg-emerald-500 text-white font-black py-6 rounded-3xl transition-all overflow-hidden active:scale-95 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center justify-center gap-3 text-lg">
                      {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
                      {!isSubmitting && <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />}
                    </span>
                  </button>

                  <p className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Encrypted Transaction
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
            <div className="mb-8 text-slate-200 flex justify-center"><ShoppingBag size={80} strokeWidth={1} /></div>
            <h2 className="text-2xl font-black text-slate-300 mb-6">Your cart is feeling light</h2>
            <Link to="/" className="inline-flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-100">
              EXPLORE MARKETPLACE <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}