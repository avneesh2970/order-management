import Layout from "../../components/common/Layout";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { IMG_URL } from "../../services/api";
import {
    Package,
    User,
    MapPin,
    Clock,
    CheckCircle,
    Filter,
    Truck,
    Navigation
} from "lucide-react";

export default function VendorOrders() {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/orders/vendor")
            .then(res => {
                const sortedData = res.data.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
                    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
                    return dateB - dateA;
                });
                setOrders(sortedData);
                setLoading(false);
            })
            .catch(err => console.error("Fetch error:", err));
    }, []);

    const updateStatus = (id, status) => {
        API.put(`/orders/${id}`, { status }).then(() => {
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
        });
    };

    const filteredOrders = filterStatus === "all"
        ? orders
        : orders.filter(o => o.status.toLowerCase() === filterStatus.toLowerCase());

    if (loading) return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-emerald-600 mb-4"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching Orders...</p>
            </div>
        </Layout>
    );

    const getImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http") || path.startsWith("data:")) return path;

        const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");

        return `${IMG_URL}/${cleanPath}`;
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Incoming Orders</h1>
                        <p className="text-slate-500 text-sm md:text-base font-medium">Manage business shipments and logistics</p>
                    </div>

                    <div className="w-full sm:w-auto flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
                        <div className="p-2 bg-slate-50 rounded-xl">
                            <Filter size={16} className="text-slate-400" />
                        </div>
                        <select
                            className="flex-1 sm:flex-none bg-transparent border-none focus:ring-0 text-xs font-black text-slate-700 pr-10 uppercase tracking-widest"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Shipments</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="in-transit">In Transit</option>
                            <option value="out-for-delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white p-12 md:p-20 rounded-[2.5rem] text-center border-2 border-dashed border-slate-100">
                            <Package size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold">No orders found in this category.</p>
                        </div>
                    ) : (
                        filteredOrders.map(o => (
                            <div key={o._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:border-emerald-200 transition-all duration-300">
                                <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-slate-100">
                                            ID: #{o._id.slice(-6)}
                                        </span>
                                        <StatusBadge status={o.status} />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                        <span className="text-[10px] uppercase text-slate-400">Total Value</span>
                                        <span className="text-lg font-black text-emerald-600">₹{o.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {/* Customer Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                                            <User size={14} className="text-emerald-500" /> Customer Details
                                        </h3>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="font-black text-slate-800 text-sm">{o.customerName}</p>
                                            <p className="text-[11px] text-slate-500 font-medium truncate">{o.customerEmail}</p>
                                            {o.customerPhone && (
                                                <a href={`tel:${o.customerPhone}`} className="text-[11px] text-emerald-600 font-bold hover:underline flex items-center gap-1 mt-1">
                                                    {o.customerPhone}
                                                </a>
                                            )}
                                            <div className="flex items-start gap-2 pt-3 mt-3 border-t border-slate-200/50">
                                                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                                <p className="text-xs leading-relaxed text-slate-600 font-medium">{o.shippingAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                                            <Package size={14} className="text-emerald-500" /> Manifest
                                        </h3>
                                        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                            {o.items?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white border border-slate-50 rounded-xl shadow-sm gap-3">
                                                    <div className="flex items-center gap-3 truncate">
                                                        {/* Item Image */}
                                                        {/* In VendorOrders.jsx inside o.items.map */}
                                                        <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                                                            {/* Try multiple common field names: .image, .logo, or .productImage */}
                                                            {(item.product?.image || item.image) ? (
                                                                <img
                                                                    src={getImageUrl(item.product?.image || item.image)}
                                                                    alt={item.name}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "https://via.placeholder.com/40?text=NA";
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center">
                                                                    <Package size={16} className="text-slate-300" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="truncate">
                                                            <p className="font-bold text-slate-700 truncate">
                                                                <span className="inline-block text-emerald-600 mr-1">x{item.quantity}</span>
                                                                {item.name}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 font-medium">Unit: ₹{item.price?.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-700 font-black shrink-0">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-2 bg-slate-50/50 p-4 rounded-[1.5rem] lg:bg-transparent lg:p-0">
                                        <h3 className="lg:hidden text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Logistics Progress</h3>

                                        <button
                                            onClick={() => updateStatus(o._id, "processing")}
                                            className={`flex items-center justify-center gap-3 py-2.5 rounded-xl font-black text-[9px] tracking-widest transition-all ${o.status === 'processing' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <Clock size={14} /> PROCESSING
                                        </button>

                                        <button
                                            onClick={() => updateStatus(o._id, "in-transit")}
                                            className={`flex items-center justify-center gap-3 py-2.5 rounded-xl font-black text-[9px] tracking-widest transition-all ${o.status === 'in-transit' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <Truck size={14} /> IN TRANSIT
                                        </button>

                                        <button
                                            onClick={() => updateStatus(o._id, "out-for-delivery")}
                                            className={`flex items-center justify-center gap-3 py-2.5 rounded-xl font-black text-[9px] tracking-widest transition-all ${o.status === 'out-for-delivery' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <Navigation size={14} /> OUT FOR DELIVERY
                                        </button>

                                        <button
                                            onClick={() => updateStatus(o._id, "delivered")}
                                            className={`flex items-center justify-center gap-3 py-2.5 rounded-xl font-black text-[9px] tracking-widest transition-all ${o.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <CheckCircle size={14} /> DELIVERED
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: "bg-orange-50 text-orange-600 border-orange-100",
        processing: "bg-amber-50 text-amber-600 border-amber-100",
        shipped: "bg-blue-50 text-blue-600 border-blue-100",
        "in-transit": "bg-indigo-50 text-indigo-600 border-indigo-100",
        "out-for-delivery": "bg-purple-50 text-purple-600 border-purple-100",
        delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    const s = status.toLowerCase();

    return (
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border ${styles[s] || "bg-slate-50 text-slate-500"}`}>
            {status}
        </span>
    );
}