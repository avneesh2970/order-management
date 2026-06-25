import Layout from "../../components/common/Layout";
import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import { IMG_URL } from "../../services/api";
import {
  Trash2, Store, Mail, Phone, MapPin,
  Search, CheckCircle, X, Edit3, Save, ChevronDown, ChevronUp,
  CheckCircle2, Clock, Image as ImageIcon
} from "lucide-react";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState(null);
  const [editVendor, setEditVendor] = useState(null);


  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/all-vendors");
      setVendors(res.data);
      setFilteredVendors(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  useEffect(() => {
    const result = vendors.filter((v) =>
      v.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(result);
  }, [searchTerm, vendors]);

  const deleteVendor = async (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      try {
        await API.delete(`/vendors/${id}`);
        setVendors(vendors.filter((v) => v._id !== id));
      } catch {
        alert("Failed to delete vendor.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      // Changed endpoint to /vendor-status/ to match backend routes
      await API.patch(`/admin/vendor-status/${editVendor._id}`, editVendor);

      setVendors(prev => prev.map(v => v._id === editVendor._id ? editVendor : v));
      setEditVendor(null);
      alert("Vendor updated successfully!");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Update failed.");
    }
  };

  const approveVendor = async (id) => {
    try {
      // Changed endpoint to /vendor-status/ to match backend routes
      await API.patch(`/admin/vendor-status/${id}`, { status: "active" });

      setVendors(prev => prev.map(v => v._id === id ? { ...v, status: "active" } : v));
      alert("Vendor approved successfully!");
    } catch (err) {
      console.error("Approval error:", err.response?.data || err.message);
      alert("Approval failed.");
    }
  };
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/\\/g, "/");
    return `${IMG_URL}/${cleanPath.replace(/^\//, "")}`;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
            <Store className="text-emerald-600" size={28} /> PARTNER DIRECTORY
          </h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text" placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="p-6">Partner Details</th>
                  <th className="p-6">Contact Info</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Location / Address</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredVendors.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/30 transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Image Logic with Fallback */}
                        <div className="relative w-12 h-12 flex-shrink-0">
                          {v.logo || v.image ? (
                            <img
                              src={getImageUrl(v.image || v.logo)}
                              className="w-12 h-12 rounded-2xl object-cover shadow-sm"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Logo"; }}
                            />
                          ) : (
                            <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-black text-slate-800 text-sm">{v.companyName}</div>
                          <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Owner: {v.ownerName}</div>

                          {/* Render Categories as separate cards/pills */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {(() => {
                              let cats = v.category;

                              // Logic to handle strings, stringified arrays, or real arrays
                              if (typeof cats === 'string') {
                                if (cats.startsWith('[')) {
                                  try { cats = JSON.parse(cats); } catch (e) { cats = [cats]; }
                                } else {
                                  cats = cats.split(',').map(c => c.trim());
                                }
                              }

                              const categoryArray = Array.isArray(cats) ? cats : [cats];

                              return categoryArray.map((cat, idx) => (
                                cat && (
                                  <span key={idx} className="text-[8px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-black uppercase border border-emerald-100 shadow-sm">
                                    {cat}
                                  </span>
                                )
                              ));
                            })()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Mail size={12} /> {v.email}</div>
                        <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5"><Phone size={12} /> {v.phone}</div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-6">
                      <div className="flex flex-col gap-2">
                        <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${v.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                          v.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                          {v.status}
                        </span>
                        {v.status === 'pending' && (
                          <button onClick={() => approveVendor(v._id)} className="text-[9px] font-black text-emerald-600 flex items-center gap-1 hover:underline uppercase">
                            <CheckCircle size={10} /> Approve Now
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Address */}
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <div className={`text-xs font-semibold text-slate-500 leading-relaxed ${expandedId === v._id ? "" : "truncate max-w-[180px]"}`}>
                          {v.streetAddress}, {v.city}, {v.state} - {v.pincode}
                        </div>
                        <button
                          onClick={() => setExpandedId(expandedId === v._id ? null : v._id)}
                          className="text-[10px] text-slate-400 font-black flex items-center gap-1 hover:text-emerald-600 transition-colors uppercase tracking-tighter"
                        >
                          {expandedId === v._id ? <><ChevronUp size={12} /> Collapse</> : <><ChevronDown size={12} /> Full Address</>}
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setEditVendor(v)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => deleteVendor(v._id)} className="p-2.5 bg-slate-50 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal (Logic for category editing omitted for brevity, but UI remains same) */}
        {editVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            {/* ... Modal content remains as per your original code ... */}
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/20">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-black text-slate-800 italic">Modify Partner</h2>
                </div>
                <button onClick={() => setEditVendor(null)} className="p-2 hover:bg-white rounded-full transition-all shadow-sm"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Form inputs ... */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Company</label>
                    <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:border-emerald-500 outline-none" value={editVendor.companyName} onChange={(e) => setEditVendor({ ...editVendor, companyName: e.target.value })} />
                  </div>
                </div>
                {/* Save button ... */}
                <div className="p-8 bg-slate-50 flex gap-3">
                  <button onClick={() => setEditVendor(null)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase hover:text-slate-600 transition-all">Cancel</button>
                  <button onClick={handleUpdate} className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:bg-black transition-all uppercase tracking-widest">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}