import { Link } from "react-router-dom";

export default function StatCard({ title, value, icon: Icon, color = "emerald", link = "#" }) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  const selectedColor = colorMap[color] || colorMap.emerald;

  return (
    <Link 
      to={link} 
      className="group bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-slate-200 transition-all duration-300 active:scale-[0.98] cursor-pointer block"
    >
      {/* Icon Container */}
      <div className={`p-3 md:p-4 rounded-2xl shrink-0 border transition-transform group-hover:scale-110 duration-300 ${selectedColor}`}>
        {Icon ? (
          <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
            <Icon size={24} />
          </div>
        ) : (
          <div className="w-5 h-5 md:w-6 md:h-6 bg-current opacity-20 rounded-full" />
        )}
      </div>
      
      {/* Text Content */}
      <div className="min-w-0 flex-1">
        <h3 className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.15em] mb-0.5 truncate leading-none">
          {title}
        </h3>
        <p className="text-xl md:text-2xl font-black text-slate-800 truncate leading-tight">
          {value}
        </p>
      </div>
    </Link>
  );
}