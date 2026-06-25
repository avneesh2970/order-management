import { useEffect, useState } from "react";
import API from "../../services/api";
import VendorCard from "../../components/cards/VendorCard";
import Layout from "../../components/common/Layout";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ArrowRight, XCircle, Briefcase } from "lucide-react";

export default function Home() {
  const [vendors, setVendors] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    API.get("/vendors/all-vendors")
      .then((res) => setVendors(res.data))
      .catch((err) => {
        console.error("Error fetching vendors:", err);
        setVendors([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredVendors = vendors.filter((v) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    // Improved category matching logic
    const categoryMatch = Array.isArray(v?.category) 
      ? v.category.some(cat => cat.toLowerCase().includes(term))
      : v?.category?.toLowerCase().includes(term);

    return (
      v?.companyName?.toLowerCase().includes(term) ||
      categoryMatch ||
      v?.city?.toLowerCase().includes(term) ||
      v?.state?.toLowerCase().includes(term)
    );
  });

  const categories = ["All", "Logistics", "Food & Beverage", "Technology", "Retail", "Manufacturing", "Others"];

  return (
    <Layout>
      {/* ================= HERO SECTION ================= */}
      <section className="relative mb-12 overflow-hidden rounded-[2.5rem] bg-slate-900 px-6 py-12 md:px-12 md:py-20 shadow-2xl">
        <div className="relative z-10 mx-auto max-w-3xl text-center lg:text-left">
          <h1 className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl">
            Global Supply <br className="hidden md:block" />
            <span className="text-emerald-400">Simplified.</span>
          </h1>
          <p className="mb-10 text-lg text-slate-400 md:text-xl">
            Connect with verified manufacturers and logistics partners in one unified marketplace.
          </p>

          <div className="mx-auto flex w-full max-w-xl flex-col gap-3 rounded-3xl bg-white/10 p-2 backdrop-blur-md sm:flex-row lg:mx-0">
            <div className="flex flex-1 items-center gap-3 px-4 py-2">
              <Search className="text-emerald-400" size={22} />
              <input
                type="text"
                placeholder="Search company, city or category..."
                className="w-full bg-transparent text-white placeholder-slate-400 outline-none focus:ring-0"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setSearchTerm(searchInput)}
              />
              {searchInput && (
                <XCircle 
                  className="cursor-pointer text-slate-500 hover:text-white" 
                  size={18} 
                  onClick={() => {setSearchInput(""); setSearchTerm("");}}
                />
              )}
            </div>
            <button
              onClick={() => setSearchTerm(searchInput)}
              className="rounded-2xl bg-emerald-500 px-8 py-3 font-bold text-slate-900 transition-all hover:bg-emerald-400 active:scale-95"
            >
              Search
            </button>
          </div>
        </div>

        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ================= CATEGORIES SIDEBAR ================= */}
        <aside className="lg:w-72">
          <div className="sticky top-24">
            <h3 className="mb-6 hidden items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 lg:flex">
              <Filter size={14} />
              Industries
            </h3>
            
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0">
              {categories.map((cat) => {
                const isActive = searchTerm === cat || (cat === "All" && searchTerm === "");
                return (
                  <button
                    key={cat}
                    onClick={() => setSearchTerm(cat === "All" ? "" : cat)}
                    className={`flex shrink-0 items-center justify-between whitespace-nowrap rounded-2xl px-5 py-4 transition-all duration-300 lg:w-full border ${
                      isActive
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100 scale-[1.02]"
                        : "bg-white text-slate-600 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? "bg-emerald-500" : "bg-slate-50 text-slate-400"}`}>
                         <Briefcase size={14} />
                      </div>
                      <span className="text-sm font-bold tracking-tight">{cat}</span>
                    </div>
                    <ArrowRight size={16} className={`hidden lg:block transition-all ${isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ================= MAIN GRID ================= */}
        <main className="flex-1">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">Verified Partners</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {filteredVendors.length} Suppliers Available
              </p>
            </div>
            {searchTerm && (
               <button 
                onClick={() => {setSearchTerm(""); setSearchInput("");}}
                className="flex w-fit items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                Clear Filter: {searchTerm}
              </button>
            )}
          </div>

          {loading ? (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="h-80 w-full animate-pulse rounded-[2rem] bg-slate-100" />
               ))}
             </div>
          ) : filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredVendors.map((v) => (
                <div key={v._id} className="transition-all duration-500 hover:-translate-y-2">
                  <VendorCard
                    vendor={{
                      ...v,
                      /* 
                         CLEANING THE DATA HERE:
                         1. Check if category is an array. If so, use it.
                         2. If it's a string, split it by comma to make an array.
                         3. This removes [" "] symbols from the display.
                      */
                      category: Array.isArray(v.category) 
                        ? v.category 
                        : (v.category ? v.category.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()) : ["General"]),
                      
                      /* FIXING IMAGE PATHS */
                      image: v.logo?.startsWith("http") 
                        ? v.logo 
                        : (v.logo ? `http://localhost:5000/${v.logo}` : "https://via.placeholder.com/400x300"),
                      
                      address: `${v.city}, ${v.state}`,
                    }}
                    onClick={() => navigate(`/vendor/${v._id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-white py-24 text-center">
              <div className="mb-4 rounded-full bg-slate-50 p-6 text-slate-300">
                <Search size={40} />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">No Matches Found</h3>
              <p className="mt-2 text-slate-400 text-sm">Try broadening your search or choosing a different industry.</p>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}