import Layout from "../../components/common/Layout";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { Edit, Tag, Box, Save, X, Image as ImageIcon, Trash2, AlertTriangle, Upload } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const vendorId = JSON.parse(atob(token.split('.')[1])).id;
      const res = await API.get(`/products/${vendorId}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileEdit = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({ ...editingProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      setDeletingId(null);
    } catch {
      alert("Error deleting product");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${editingProduct._id}`, editingProduct);
      setEditingProduct(null);
      fetchProducts();
    } catch  {
      alert("Failed to update product");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Inventory</h1>
            <p className="text-slate-500 text-sm font-medium">Manage your digital storefront</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="h-10 w-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Stock...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white border border-slate-100 rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-full md:w-24 h-48 md:h-24 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-50 overflow-hidden shrink-0">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} />
                  )}
                </div>

                <div className="flex-1 text-center md:text-left w-full min-w-0">
                  <h3 className="font-black text-slate-800 text-lg md:text-xl truncate">{p.name}</h3>
                  <div className="flex justify-center md:justify-start gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <Tag size={12} className="text-emerald-500" /> {p.category || "General"}
                    </span>
                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${p.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      <Box size={12} /> {p.stock > 0 ? `In Stock: ${p.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className="md:text-right px-0 md:px-6 py-2 md:py-0 border-y md:border-y-0 border-slate-50 w-full md:w-auto">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Price</p>
                  <p className="text-2xl font-black text-slate-900 leading-none">₹{p.price.toLocaleString()}</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto justify-center">
                  <button onClick={() => setEditingProduct(p)} className="flex-1 md:flex-none bg-slate-50 text-slate-600 p-4 md:p-3 rounded-2xl hover:bg-slate-900 hover:text-white transition-all active:scale-95">
                    <Edit size={20} className="mx-auto" />
                  </button>
                  <button onClick={() => setDeletingId(p._id)} className="flex-1 md:flex-none bg-rose-50 text-rose-500 p-4 md:p-3 rounded-2xl hover:bg-rose-600 hover:text-white transition-all active:scale-95">
                    <Trash2 size={20} className="mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DELETE MODAL (Unchanged as requested) */}
        {deletingId && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 text-center shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Remove Product?</h2>
              <p className="text-slate-500 mt-3 mb-8 text-sm font-medium leading-relaxed">This item will be permanently removed.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setDeletingId(null)} className="flex-1 py-4 font-black text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest">Cancel</button>
                <button onClick={() => handleDelete(deletingId)} className="flex-1 py-4 font-black text-white bg-rose-600 rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 uppercase text-[10px] tracking-widest">Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL with Upload Support */}
        {editingProduct && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
              <div className="p-6 md:p-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Details</h2>
                  <button onClick={() => setEditingProduct(null)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:text-slate-900 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none font-bold" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none font-bold" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none font-bold" value={editingProduct.stock} onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})} />
                    </div>
                  </div>

                  {/* Edit Image Logic */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Update Product Image</label>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      {editingProduct.image && <img src={editingProduct.image} className="w-12 h-12 rounded-lg object-cover" />}
                      <div className="flex-1 relative">
                        <button type="button" className="w-full bg-white border border-slate-200 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2">
                          <Upload size={14} /> Upload New
                        </button>
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileEdit} />
                      </div>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Or paste link..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none font-bold text-xs mt-2" 
                      value={editingProduct.image.startsWith("data:") ? "" : editingProduct.image} 
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} 
                    />
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em]">
                    <Save size={18} /> Update Inventory
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}