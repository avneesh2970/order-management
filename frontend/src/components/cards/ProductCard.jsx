import { ShoppingCart, Store } from "lucide-react";

export default function ProductCard({ product, addToCart }) {
  // Check if vendor data exists (populated from backend)
  const vendorName = product.vendor?.companyName || "Unknown Vendor";
  const vendorLogo = product.vendor?.logo;

  return (
    <div className="group bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all flex flex-col h-full">
      <div className="relative overflow-hidden rounded-xl h-36 md:h-48 bg-gray-50 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {product.stock < 10 && (
          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-red-600 text-[9px] md:text-[10px] font-black px-2 py-1 rounded-lg shadow-sm border border-red-50 uppercase tracking-tighter">
            Low Stock
          </span>
        )}
      </div>
      
      <div className="flex-grow">
        {/* Vendor Header */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {vendorLogo ? (
            <img src={vendorLogo} alt="vendor" className="w-4 h-4 rounded-full object-cover border border-gray-100" />
          ) : (
            <Store size={12} className="text-gray-400" />
          )}
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight truncate">
            {vendorName}
          </span>
        </div>

        <h2 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
          {product.name}
        </h2>
        
        <div className="flex flex-col mt-1">
          <p className="text-emerald-600 font-black text-base md:text-xl">
            ₹{product.price?.toLocaleString('en-IN')}
          </p>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-0.5">
            {product.category}
          </p>
        </div>
      </div>

      <button
        onClick={() => addToCart(product)}
        className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-2.5 md:py-3 mt-4 rounded-xl transition-all text-xs md:text-sm shadow-md shadow-emerald-500/10"
      >
        <ShoppingCart size={16} className="shrink-0" />
        <span className="truncate">Add to Cart</span>
      </button>
    </div>
  );
}