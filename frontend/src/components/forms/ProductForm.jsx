import { useState } from "react";
import { 
  Package, 
  IndianRupee, 
  Layers, 
  Image as ImageIcon, 
  ClipboardList, 
  PlusCircle, 
  Upload, 
  X, 
  Link as LinkIcon 
} from "lucide-react";

export default function ProductForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "General",
    image: "",
    stock: "",
  });

  const categories = ["Electronics", "Textiles", "Industrial", "Food & Beverage", "General"];

  // Handle conversion of local file to Base64 string
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large! Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
          <PlusCircle size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Inventory Management</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase">Product Title</label>
          <div className="relative">
            <Package className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="e.g. Cotton Bulk Yarn"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase">Price (INR)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase">Stock Level</label>
            <div className="relative">
              <ClipboardList className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Quantity"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase">Industry Category</label>
          <div className="relative">
            <Layers className="absolute left-3 top-3 text-gray-400" size={18} />
            <select
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none transition-all"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase">Product Description</label>
          <textarea
            required
            rows="2"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            placeholder="Describe technical specifications..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* --- Image Upload Section --- */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase">Product Image</label>
          
          <div className="space-y-3">
            {/* Drag and Drop Zone */}
            <div className="relative group border-2 border-dashed border-gray-200 rounded-2xl p-4 transition-all hover:border-emerald-400 bg-gray-50/50 flex flex-col items-center justify-center min-h-[120px]">
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleImageUpload}
              />
              
              {form.image ? (
                <div className="relative">
                  <img 
                    src={form.image} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-xl shadow-sm border-2 border-white" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setForm({...form, image: ""})}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-md z-20 hover:bg-rose-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <div className="bg-white p-2 rounded-lg shadow-sm inline-block mb-2">
                    <Upload size={20} className="text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Drop file here or click to upload</p>
                </div>
              )}
            </div>

            {/* Manual Link Input */}
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="Or paste image URL link..."
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2 mt-2"
        >
          <PlusCircle size={20} />
          Publish Product
        </button>
      </form>
    </div>
  );
}