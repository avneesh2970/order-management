import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import { useAuth } from "../../context/useAuth";
import API from "../../services/api";
import {
  Package, X, Menu, LogOut, User, Settings, ShoppingBag,
  ChevronRight, Box, Edit3, Clock,
  CheckCircle2, Truck, Store, MapPin, Trash2, Plus, RefreshCw, Minus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editItems, setEditItems] = useState([]);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    API.get("/orders/user")
      .then(res => {
        setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  const startEditing = async (order) => {
    const itemsToEdit = order.items.map(item => ({
      product: item.product?._id || item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || item.product?.image
    }));
    setEditItems(itemsToEdit);
    setIsEditMode(true);

    try {
      const vendorId = order.vendor?._id || order.vendor;
      const res = await API.get(`/products?vendor=${vendorId}`);
      setVendorProducts(res.data);
    } catch (err) {
      console.error("Could not fetch vendor items", err);
    }
  };

  const updateQuantity = (productId, delta) => {
    setEditItems(prev => prev.map(item =>
      item.product === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (productId) => {
    setEditItems(prev => prev.filter(item => item.product !== productId));
  };

  const addNewItem = (product) => {
    const exists = editItems.find(item => item.product === product._id);
    if (exists) {
      updateQuantity(product._id, 1);
    } else {
      setEditItems([...editItems, {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }]);
    }
  };

  const saveOrderUpdate = async () => {
    if (editItems.length === 0) return alert("Order cannot be empty");
    setUpdating(true);
    try {
      const totalAmount = editItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const res = await API.put(`/orders/${selectedOrder._id}`, {
        items: editItems,
        totalAmount
      });
      const updatedOrder = res.data;
      setOrders(prevOrders => prevOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o));
      setSelectedOrder(updatedOrder);
      setIsEditMode(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    const configs = {
      pending: { color: 'text-orange-600 bg-orange-50', icon: <Clock size={14} /> },
      processing: { color: 'text-blue-600 bg-blue-50', icon: <RefreshCw size={14} className="animate-spin" /> },
      shipped: { color: 'text-purple-600 bg-purple-50', icon: <Package size={14} /> },
      delivered: { color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle2 size={14} /> }
    };
    return configs[s] || { color: 'text-slate-600 bg-slate-50', icon: <Box size={14} /> };
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
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black">{user?.name?.charAt(0) || "U"}</div>
              <div>
                <p className="text-sm font-black text-slate-900 tracking-tight">B2B Connect</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Customer Portal</p>
              </div>
            </div>
            <button className="lg:hidden p-2 hover:bg-slate-50 rounded-xl" onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
          </div>
          <nav className="space-y-2 flex-1">
            <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all"><User size={20} /> My Profile</button>
            <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm bg-slate-900 text-white shadow-xl shadow-slate-200"><ShoppingBag size={20} /> My Orders</button>
            <button onClick={() => navigate('/profile', { state: { tab: 'settings' } })} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all"><Settings size={20} /> Account Settings</button>
          </nav>
          <button onClick={logout} className="mt-auto w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors"><LogOut size={20} /> Sign Out</button>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-5xl mx-auto">
            <header className="mb-10 flex items-center gap-4">
              {/* FIXED HAMBURGER POSITIONING */}
              <button className="lg:hidden p-3 bg-white shadow-sm rounded-2xl border border-slate-200 hover:bg-slate-50" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Orders</h1>
                <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Track and manage procurement</p>
              </div>
            </header>

            <div className="grid gap-4">
              {loading ? (
                <div className="h-64 flex items-center justify-center bg-white rounded-[2rem] border border-slate-100">
                    <RefreshCw className="animate-spin text-slate-300" size={32} />
                </div>
              ) : (
                orders.map(o => (
                  <div key={o._id} onClick={() => { setSelectedOrder(o); setIsEditMode(false); }} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                      <Box size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${getStatusConfig(o.status).color}`}>
                          {getStatusConfig(o.status).icon} {o.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">#ORD-{o._id?.slice(-6)}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-800">₹{o.totalAmount?.toLocaleString()}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Store size={14} /> 
                          {o.vendor?.companyName || "Partner Vendor"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <Clock size={14} /> {new Date(o.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="hidden md:block text-slate-300" />
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* --- MODAL --- */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full md:max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
              <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Order Details</h2>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest truncate max-w-[200px]">Ref: {selectedOrder._id}</p>
                </div>
                <button onClick={() => { setSelectedOrder(null); setIsEditMode(false); }} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"><X size={22} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mb-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${getStatusConfig(selectedOrder.status).color}`}>{selectedOrder.status}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full flex overflow-hidden">
                    <div
                      className="h-full bg-slate-900 transition-all duration-500"
                      style={{
                        width: selectedOrder.status === 'delivered' ? '100%' : selectedOrder.status === 'pending' ? '25%' : '60%'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <h3 className="text-lg font-black text-slate-800">Items</h3>
                    {selectedOrder.status === 'pending' && !isEditMode && (
                      <button onClick={() => startEditing(selectedOrder)} className="text-xs font-black text-slate-900 flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"><Edit3 size={14} /> Edit</button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {(isEditMode ? editItems : selectedOrder.items).map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <img src={item.image || item.product?.image} className="w-14 h-14 bg-slate-50 rounded-2xl object-cover shrink-0" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                          <p className="text-xs font-medium text-slate-400">₹{item.price}</p>
                        </div>
                        {isEditMode ? (
                          <div className="flex items-center gap-2 md:gap-3">
                            <button onClick={() => updateQuantity(item.product, -1)} className="p-1.5 bg-slate-100 rounded-lg"><Minus size={14} /></button>
                            <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product, 1)} className="p-1.5 bg-slate-100 rounded-lg"><Plus size={14} /></button>
                            <button onClick={() => removeItem(item.product)} className="p-1.5 text-red-500 bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        ) : (
                          <p className="font-black text-slate-900 text-sm shrink-0">Qty: {item.quantity}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {isEditMode && vendorProducts.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-dashed border-slate-200">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Add More From Vendor</h4>
                      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {vendorProducts.map(p => (
                          <button key={p._id} onClick={() => addNewItem(p)} className="shrink-0 w-32 bg-white border border-slate-100 p-3 rounded-2xl hover:border-slate-900 transition-all text-left group">
                            <img src={p.image} className="w-full h-20 object-cover rounded-xl mb-2" alt="" />
                            <p className="text-[10px] font-bold text-slate-800 truncate">{p.name}</p>
                            <div className="mt-2 w-full py-1 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                              <Plus size={12} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-3 text-slate-500"><MapPin size={18} /> <p className="text-sm font-medium">{selectedOrder.shippingAddress || "Main Business Address"}</p></div>
                  <div className="flex items-center gap-3 text-slate-500"><Store size={18} /> <p className="text-sm font-medium">{selectedOrder.vendor?.companyName || "Partner Vendor"}</p></div>
                </div>
              </div>

              <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                  <p className="text-2xl md:text-3xl font-black text-slate-900">₹{(isEditMode ? editItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) : selectedOrder.totalAmount).toLocaleString()}</p>
                </div>
                {isEditMode ? (
                  <div className="flex gap-3">
                    <button onClick={() => setIsEditMode(false)} className="flex-1 py-4 md:py-5 bg-white border border-slate-200 text-slate-600 rounded-[2rem] font-black text-xs uppercase tracking-widest">Cancel</button>
                    <button onClick={saveOrderUpdate} disabled={updating} className="flex-1 py-4 md:py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl">
                      {updating ? "Saving..." : "Save Order"}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setSelectedOrder(null)} className="w-full py-4 md:py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl">Close View</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}