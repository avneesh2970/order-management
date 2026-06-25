import { X, Printer, FileText, SplitSquareVertical } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../services/api";

export default function InvoiceModal({ order, onClose }) {
    const [items, setItems] = useState([]);
    const [paidAmount, setPaidAmount] = useState(0);
    const [taxRate, setTaxRate] = useState(5); 
    const [viewMode, setViewMode] = useState("full");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (order) {
            setItems(order.items || []);
            setPaidAmount(order.paidAmount || 0);
        }
    }, [order]);

    if (!order) return null;

    // Financial Calculations
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount;
    const balanceDue = grandTotal - paidAmount;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let status = paidAmount >= grandTotal ? "Paid" : paidAmount > 0 ? "Partially Paid" : "Pending";
            await API.put(`/orders/${order._id}`, {
                paidAmount: Number(paidAmount),
                paymentStatus: status,
                totalAmount: grandTotal,
            });
            alert("Ledger updated successfully.");
            window.location.reload();
        } catch (err) {
            alert("Error syncing with database.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl flex flex-col my-auto">
                
                {/* Control Panel */}
                <div className="px-6 py-3 bg-slate-100 flex flex-wrap justify-between items-center print:hidden border-b gap-4">
                    <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                        <button 
                            onClick={() => setViewMode("full")} 
                            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black transition-all ${viewMode === 'full' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <FileText size={14} /> FULL INVOICE
                        </button>
                        <button 
                            onClick={() => setViewMode("balance")} 
                            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black transition-all ${viewMode === 'balance' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <SplitSquareVertical size={14} /> BALANCE ONLY
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded hover:bg-slate-50 text-xs font-bold transition-all"><Printer size={14}/> PRINT</button>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={20}/></button>
                    </div>
                </div>

                {/* Printable Area */}
                <div className="p-10 md:p-16 bg-white text-slate-800" id="printable-invoice">
                    
                    {/* 1. Vendor Header - Populated from Vendor Model */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="max-w-[50%]">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2 uppercase">
                                {order.vendor?.companyName || "Vendor Business"}
                            </h1>
                            <div className="text-sm text-slate-500 leading-relaxed">
                                <p className="font-medium text-slate-700">{order.vendor?.email}</p>
                                <p>{order.vendor?.phone}</p>
                            </div>
                        </div>
                        <h2 className="text-6xl font-light text-[#1e40af] tracking-tight italic">INVOICE</h2>
                    </div>

                    {/* 2. Meta Data Box */}
                    <div className="grid grid-cols-2 border border-slate-200 mb-8">
                        <div className="border-r border-slate-200">
                            <div className="grid grid-cols-2 p-3 text-sm border-b border-slate-100">
                                <span className="text-slate-400 font-medium">Order ID</span>
                                <span className="font-bold text-slate-900 uppercase">{order._id.slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="grid grid-cols-2 p-3 text-sm">
                                <span className="text-slate-400 font-medium">Date</span>
                                <span className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center bg-slate-50/50">
                             <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {order.paymentStatus}
                             </span>
                        </div>
                    </div>

                    {/* 3. Bill To & Ship To Section */}
                    <div className="grid grid-cols-2 border border-slate-200 mb-10">
                        <div className="border-r border-slate-200">
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-sm font-bold">Bill To</div>
                            <div className="p-4 text-sm leading-relaxed">
                                <p className="text-lg font-bold text-slate-900 mb-1 uppercase">{order.customerName}</p>
                                <p className="text-blue-600 text-xs mb-3 font-medium">{order.customerEmail}</p>
                                <p className="text-slate-400 text-xs font-mono">{order.customerPhone}</p>
                            </div>
                        </div>
                        <div>
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-sm font-bold">Ship To</div>
                            <div className="p-4 text-sm leading-relaxed text-slate-600 italic">
                                <p className="font-medium text-slate-700 not-italic uppercase mb-1">{order.customerName}</p>
                                <p className="whitespace-pre-line">{order.shippingAddress}</p>
                                <p className="not-italic font-bold text-slate-900 mt-1">PIN: {order.pincode}</p>
                            </div>
                        </div>
                    </div>

                    {/* 4. Invoice Table */}
                    <table className="w-full border-collapse border border-slate-200">
                        <thead>
                            <tr className="bg-[#1e40af] text-white text-sm">
                                <th className="px-4 py-3 text-left w-12 border-r border-blue-700">#</th>
                                <th className="px-4 py-3 text-left border-r border-blue-700 uppercase tracking-wider">Product</th>
                                <th className="px-4 py-3 text-right w-24 border-r border-blue-700">Qty</th>
                                <th className="px-4 py-3 text-right w-32 border-r border-blue-700 font-bold">Rate</th>
                                <th className="px-4 py-3 text-right w-32 font-bold">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {viewMode === "full" ? (
                                items.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-200">
                                        <td className="px-4 py-5 text-center border-r border-slate-200">{index + 1}</td>
                                        <td className="px-4 py-5 border-r border-slate-200">
                                            <p className="font-bold text-slate-900">{item.name}</p>
                                        </td>
                                        <td className="px-4 py-5 text-right border-r border-slate-200">{item.quantity}</td>
                                        <td className="px-4 py-5 text-right border-r border-slate-200">₹{item.price.toFixed(2)}</td>
                                        <td className="px-4 py-5 text-right font-medium">₹{(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="border-b border-slate-200">
                                    <td className="px-4 py-12 text-center border-r border-slate-200">1</td>
                                    <td className="px-4 py-12 border-r border-slate-200">
                                        <p className="font-bold text-[#1e40af] text-lg uppercase tracking-tight">Consolidated Balance Invoice</p>
                                        <p className="text-slate-400 text-xs mt-1 italic">Reference Order: {order._id}</p>
                                    </td>
                                    <td className="px-4 py-12 text-right border-r border-slate-200">1</td>
                                    <td className="px-4 py-12 text-right border-r border-slate-200">₹{balanceDue.toFixed(2)}</td>
                                    <td className="px-4 py-12 text-right font-bold text-orange-600">₹{balanceDue.toLocaleString()}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* 5. Summary */}
                    <div className="flex justify-between mt-10">
                        <div className="max-w-[50%]">
                            <h4 className="text-xs font-black text-slate-900 mb-2 uppercase tracking-tighter underline">Payment Status</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed uppercase">
                                This order is currently marked as <span className="font-bold">{order.paymentStatus}</span>. 
                                Please clear the remaining balance of <span className="font-bold">₹{balanceDue.toLocaleString()}</span> at the earliest.
                            </p>
                        </div>
                        <div className="w-80 border-2 border-[#1e40af]/10">
                            <div className="flex justify-between px-4 py-3 text-sm font-bold border-b border-slate-100 bg-slate-50/10">
                                <span className="text-slate-500">Sub Total</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between px-4 py-3 text-sm font-bold border-b border-slate-100">
                                <span className="text-slate-500">Tax ({taxRate}%)</span>
                                <span className="text-[#1e40af]">₹{taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between px-4 py-3 text-sm font-bold border-b border-slate-100 bg-slate-50/30">
                                <span className="text-slate-900 uppercase tracking-widest text-[10px]">Grand Total</span>
                                <span className="text-lg">₹{grandTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between px-4 py-4 text-sm font-bold bg-[#1e40af]/5">
                                <span className="text-slate-900 uppercase tracking-widest text-[10px]">Amount Due</span>
                                <span className="text-xl text-[#1e40af]">₹{balanceDue.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Database Synchronization Panel */}
                <div className="p-8 bg-slate-50 border-t flex flex-col md:flex-row justify-between items-end md:items-center gap-6 print:hidden">
                    <div className="flex gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid (₹)</label>
                            <input 
                                type="number" 
                                value={paidAmount} 
                                onChange={(e) => setPaidAmount(Number(e.target.value))}
                                className="w-48 p-3 bg-white border border-slate-200 rounded text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-10 py-4 bg-slate-900 text-white rounded text-xs font-black uppercase tracking-widest hover:bg-[#1e40af] transition-all disabled:opacity-50 shadow-lg"
                    >
                        {isSaving ? "SAVING..." : "UPDATE PAYMENT STATUS"}
                    </button>
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-invoice, #printable-invoice * { visibility: visible; }
                    #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; margin: 0 !important; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
}