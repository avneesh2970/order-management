import Layout from "../../components/common/Layout";
import { useState, useEffect } from "react";
import { Receipt, SortAsc, Wallet, User } from "lucide-react";
import API from "../../services/api";
import InvoiceModal from "./InvoiceModal";

export default function VendorPayments() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [sortOption, setSortOption] = useState("newest");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await API.get("/orders/vendor");
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching ledger:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const totalBalance = orders.reduce((sum, order) => sum + (order.totalAmount - (order.paidAmount || 0)), 0);

    const sortedOrders = [...orders].sort((a, b) => {
        switch (sortOption) {
            case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
            case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
            case "amount-high": return b.totalAmount - a.totalAmount;
            default: return 0;
        }
    });

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
                <header className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight italic uppercase">Financial Ledger</h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Business Credit Management</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="bg-orange-50 px-5 py-3 rounded-2xl border border-orange-100 flex-1 md:flex-none">
                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Total Outstanding</p>
                            <p className="text-xl font-black text-orange-600 leading-none mt-1">₹{totalBalance.toLocaleString()}</p>
                        </div>
                        
                        <div className="relative flex-1 md:flex-none min-w-[160px]">
                            <select 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider text-slate-700 w-full cursor-pointer shadow-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="amount-high">Highest Amount</option>
                            </select>
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6">Client Details</th>
                                    <th className="px-8 py-6">Order Date</th>
                                    <th className="px-8 py-6">Amount Details</th>
                                    <th className="px-8 py-6">Balance Due</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {sortedOrders.map(order => {
                                    const balance = order.totalAmount - (order.paidAmount || 0);
                                    return (
                                        <tr key={order._id} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><User size={16}/></div>
                                                    <div>
                                                        <p className="font-black text-slate-800 text-sm uppercase">{order.customerName || "Walk-in Client"}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{order.customerEmail || "No Email Provided"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase">
                                                {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-black text-slate-900">Total: ₹{order.totalAmount?.toLocaleString()}</p>
                                                <p className="text-[10px] font-bold text-emerald-500">Paid: ₹{order.paidAmount?.toLocaleString() || 0}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-black ${balance > 0 ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    ₹{balance.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-emerald-600 transition-all"
                                                >
                                                    VIEW INVOICE
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedOrder && (
                <InvoiceModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                />
            )}
        </Layout>
    );
}