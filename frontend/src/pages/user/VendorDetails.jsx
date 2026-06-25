import Layout from "../../components/common/Layout";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../context/useAuth";
import SideCart from "../../components/common/SideCart";
import { ShoppingBag, MapPin, ShieldCheck, ArrowLeft, Store, Lock, LogIn, Info, Plus, Minus } from "lucide-react";

export default function VendorDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vRes = await API.get(`/vendors/all-vendors`);
        const found = vRes.data.find(v => v._id === id);
        
        if (found) {
          const city = found.city || found.City || "";
          const state = found.state || found.State || "";
          
          const formattedVendor = {
            ...found,
            fullAddress: city && state ? `${city}, ${state}` : city || state || "Location not specified",
            displayLogo: found.logo?.startsWith("http") 
              ? found.logo 
              : `http://localhost:5000/${found.logo}`
          };
          setVendor(formattedVendor);
        }

        const pRes = await API.get(`/products/${id}`);
        setProducts(pRes.data);
      } catch (err) {
        console.error("Error loading vendor page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getCartItem = (productId) => cart.find(item => item._id === productId);

  const handleAddToCart = (product) => {
    addToCart(product);
    setIsDrawerOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-emerald-600 mb-4"></div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loading Catalog...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SideCart isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      {!vendor ? (
        <div className="text-center py-20 px-4">
          <h2 className="text-2xl font-black text-slate-800">Vendor Profile Not Found</h2>
          <Link to="/" className="text-emerald-600 mt-6 inline-flex items-center gap-2 font-black uppercase text-xs tracking-widest bg-emerald-50 px-6 py-3 rounded-xl">
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
          
          {/* ================= VENDOR HEADER ================= */}
{/* ================= VENDOR HEADER ================= */}
<div className="relative bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8 md:mb-12 overflow-hidden group">
  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-inner">
      <img 
        src={vendor.displayLogo} 
        alt={vendor.companyName}
        className="w-full h-full object-contain p-2"
        onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Logo"}
      />
    </div>

    <div className="flex-1">
      <div className="flex items-center gap-2 text-emerald-600 mb-3">
        <div className="p-1 bg-emerald-100 rounded-md">
            <ShieldCheck size={12} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest">Verified Supplier</span>
      </div>
      
      <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
        {vendor.companyName}
      </h1>
      
      <div className="flex flex-wrap items-center gap-3 mt-4">
        {/* --- IMPROVED CATEGORY TAGS --- */}
        <div className="flex flex-wrap gap-2">
          {(Array.isArray(vendor.category) 
            ? vendor.category 
            : (vendor.category ? vendor.category.replace(/[\[\]"]/g, '').split(',') : ["General"])
          ).map((cat, index) => (
            <span 
              key={index}
              className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-200"
            >
              {cat.trim()}
            </span>
          ))}
        </div>

        {/* --- VERTICAL DIVIDER (Hidden on mobile) --- */}
        <div className="hidden md:block w-px h-4 bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs uppercase tracking-tight">
          <MapPin size={16} className="text-emerald-500" />
          <span>{vendor.fullAddress || vendor.address }</span>
        </div>
      </div>
    </div>
  </div>
  <Store className="absolute -bottom-6 -right-6 w-32 h-32 md:w-48 md:h-48 text-slate-100 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
</div>

          {/* ================= CATALOG SECTION ================= */}
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-2xl">
                <ShoppingBag size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Products Catalog</h2>
            </div>
          </div>

          {!user ? (
            <div className="relative bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] p-8 md:p-20 text-center">
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-600 mb-6">
                  <Lock size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Sign in to View Prices</h3>
                <p className="text-slate-500 mt-4 mb-8 text-sm max-w-sm"> Wholesale pricing and product descriptions are only available to logged-in users. </p>
                <Link to="/login" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all flex items-center gap-3 active:scale-95">
                    <LogIn size={20} /> LOGIN NOW
                </Link>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-16 rounded-[3rem] text-center border border-dashed border-slate-200">
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active listings for this vendor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {products.map(p => {
                const cartItem = getCartItem(p._id);
                
                return (
                  <div key={p._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-5 md:p-7 shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-56 h-56 rounded-[2rem] bg-slate-50 overflow-hidden shrink-0 border border-slate-50">
                        <img 
                          src={p.image} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          alt={p.name} 
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl md:text-2xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                              {p.name}
                          </h3>
                          <span className="text-2xl font-black text-emerald-600 bg-emerald-50 px-4 py-1 rounded-xl">
                              ₹{p.price}
                          </span>
                        </div>
                        
                        <div className="mt-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100/50 flex-1">
                          <div className="flex items-center gap-2 mb-2 text-slate-400">
                              <Info size={14} />
                              <span className="text-[10px] font-black uppercase tracking-tighter">Product Details</span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {p.description || "The vendor has not provided a detailed description for this item yet."}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center justify-end">
                          {cartItem ? (
                            <div className="flex items-center bg-slate-900 rounded-2xl p-1 shadow-lg shadow-slate-200">
                              <button 
                                onClick={() => cartItem.quantity > 1 ? updateQuantity(p._id, cartItem.quantity - 1) : removeFromCart(p._id)}
                                className="p-3 text-white hover:text-emerald-400 transition-colors"
                              >
                                <Minus size={18} strokeWidth={3} />
                              </button>
                              
                              <span className="px-6 text-white font-black text-lg min-w-[3rem] text-center">
                                {cartItem.quantity}
                              </span>

                              <button 
                                onClick={() => updateQuantity(p._id, cartItem.quantity + 1)}
                                className="p-3 text-white hover:text-emerald-400 transition-colors"
                              >
                                <Plus size={18} strokeWidth={3} />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleAddToCart(p)}
                              className="w-full md:w-auto bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95"
                            >
                              <ShoppingBag size={18} /> ADD TO CART
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}