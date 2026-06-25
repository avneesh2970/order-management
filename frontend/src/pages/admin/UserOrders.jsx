import Layout from "../../components/common/Layout";
import { useEffect, useState } from "react";
import API from "../../services/api";
import {
    ShoppingBag, User, Store, MapPin,
    Filter, Trash2, Eye, X, Package,
    Phone, Mail, Calendar, CreditCard, Image as ImageIcon
} from "lucide-react";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        API.get("/orders/admin/all")
            .then(res => {
                setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setLoading(false);
            })
            .catch(err => console.error("Admin Fetch Error:", err));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await API.delete(`/orders/${id}`);
                setOrders(orders.filter(o => o._id !== id));
            } catch (err) {
                console.error("Delete Error Status:", err.response?.status);
                alert(err.response?.data?.message || "Delete failed");
            }
        }
    };

    const filteredOrders = filterStatus === "all"
        ? orders
        : orders.filter(o => o.status.toLowerCase() === filterStatus.toLowerCase());

    if (loading) return (
        <Layout>
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
                        <p className="text-slate-500 font-medium">Viewing real-time status updates from all vendors</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <Filter size={18} className="text-slate-400 ml-2" />
                        <select
                            className="border-none focus:ring-0 text-sm font-bold text-slate-600 bg-transparent pr-8"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Filter: All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="in-transit">In Transit</option>
                            <option value="out-for-delivery">Out For Delivery</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6 flex-1 w-full">
                                    <div className="hidden sm:block bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <ShoppingBag className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-black text-slate-900 uppercase">#{order._id.slice(-8)}</span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-8 flex-[2] w-full border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-8">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Customer</p>
                                        <p className="text-sm font-bold text-slate-800">{order.customerName}</p>
                                        <p className="text-[11px] text-slate-500">{order.customerPhone}</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Seller / Vendor</p>
                                        <p className="text-sm font-bold text-slate-800">
                                            {order.vendor?.companyName || "Vendor Name Missing"}
                                        </p>
                                        {order.vendor?.email && (
                                            <p className="text-[11px] text-slate-500">{order.vendor.email}</p>
                                        )}
                                        {order.vendor?.phone && (
                                            <p className="text-[11px] text-slate-500">{order.vendor.phone}</p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Amount</p>
                                        <p className="text-lg font-black text-slate-900">₹{order.totalAmount?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="flex-1 md:flex-none p-3 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all flex justify-center items-center gap-2 text-xs font-bold"
                                    >
                                        <Eye size={18} /> Details
                                    </button>
                                    <button
                                        onClick={() => handleDelete(order._id)}
                                        className="flex-1 md:flex-none p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex justify-center items-center"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EXPANDED DETAILS MODAL */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="p-6 flex justify-between items-center border-b bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-slate-900 flex items-center gap-2">
                                    ORDER DETAILS <span className="text-blue-600">#{selectedOrder._id.slice(-8)}</span>
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full system audit trail</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">

                            {/* Grid: Customer & Vendor */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase flex items-center gap-2 border-b pb-2">
                                        <User size={14} className="text-blue-500" /> Customer Information
                                    </h4>
                                    <div className="px-2">
                                        <p className="text-sm font-black text-slate-800">{selectedOrder.customerName}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <Phone size={12} /> {selectedOrder.customerPhone}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 italic">
                                            <Calendar size={12} /> Ordered: {new Date(selectedOrder.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase flex items-center gap-2 border-b pb-2">
                                        <Store size={14} className="text-emerald-500" /> Vendor Information
                                    </h4>
                                    <div className="px-2">
                                        <p className="text-sm font-black text-slate-800">{selectedOrder.vendor?.companyName || "N/A"}</p>
                                        <p className="text-xs font-bold text-slate-600 mt-1">{selectedOrder.vendor?.businessName}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <Mail size={12} /> {selectedOrder.vendor?.email || "No Email Provided"}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <Mail size={12} /> {selectedOrder.vendor?.phone || "No Email Provided"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase flex items-center gap-2 mb-4">
                                    <MapPin size={14} className="text-red-500" /> Logistics & Shipping
                                </h4>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                        {selectedOrder.shippingAddress}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs font-black">
                                            PIN: {selectedOrder.pincode}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase">
                                            Status: <StatusBadge status={selectedOrder.status} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Itemized Breakdown */}
                            {/* Itemized Breakdown */}
                            <div>
                                <h4 className="text-[11px] font-black text-slate-400 uppercase flex items-center gap-2 mb-4 border-b pb-2">
                                    <Package size={14} className="text-orange-500" /> Order Items ({selectedOrder.items.length})
                                </h4>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white p-4 border border-slate-100 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                {/* Updated Image Section */}
                                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
                                                    {item.product?.image ? (
                                                        <img
                                                            src={item.product.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://via.placeholder.com/150?text=No+Image";
                                                            }}
                                                        />
                                                    ) : (
                                                        <ImageIcon size={18} className="text-slate-300" />
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="text-sm font-black text-slate-800">{item.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                        Qty: {item.quantity} × ₹{item.price}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-black text-slate-900">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer / Total */}
                        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <CreditCard className="text-emerald-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Transaction Total</p>
                                    <p className="text-xs text-slate-500 italic font-medium">Inclusive of all vendor taxes</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black tracking-tight text-emerald-400">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

function StatusBadge({ status }) {
    const config = {
        pending: "bg-orange-100 text-orange-600",
        processing: "bg-blue-100 text-blue-600",
        "in-transit": "bg-indigo-50 text-indigo-600 border-indigo-100",
        "out-for-delivery": "bg-purple-50 text-purple-600 border-purple-100",
        delivered: "bg-emerald-100 text-emerald-600",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config[status.toLowerCase()] || "bg-slate-100"}`}>
            {status}
        </span>
    );
}