import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../../context/useCart";
import { Link } from "react-router-dom";

export default function SideCart({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="p-6 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Quick Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                <ShoppingBag size={40} />
              </div>
              <p className="text-slate-400 font-bold">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex gap-4 items-center bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 group">
                <div className="w-16 h-16 bg-white rounded-xl shrink-0 flex items-center justify-center shadow-sm">
                   <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate text-sm">{item.name}</h4>
                  <p className="text-emerald-600 font-black text-sm">₹{item.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200">
                    <button onClick={() => updateQuantity(item._id, Math.max(0, (item.quantity || 1) - 1))} className="p-1 text-slate-400 hover:text-red-500">
                       {item.quantity <= 1 ? <Trash2 size={12}/> : <Minus size={12}/>}
                    </button>
                    <span className="px-2 font-black text-xs min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)} className="p-1 text-emerald-600">
                       <Plus size={12}/>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t bg-slate-50 rounded-t-[2rem]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-500 font-black text-xs uppercase tracking-widest">Total Amount</span>
            <span className="text-2xl font-black text-slate-900">₹{total.toLocaleString()}</span>
          </div>
          <Link 
            to="/cart" 
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            PROCEED TO CHECKOUT <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}