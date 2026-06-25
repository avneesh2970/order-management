export default function Loader({ fullPage = false }) {
  return (
    <div className={`
      flex flex-col justify-center items-center gap-4 px-4
      ${fullPage ? "min-h-[80vh]" : "h-64"} 
      transition-all duration-300
    `}>
      {/* Responsive Spinner: slightly smaller on mobile */}
      <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
      
      {/* Responsive Text: scales down and centers properly on narrow screens */}
      <p className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] animate-pulse text-center leading-relaxed">
        Synchronizing Data...
      </p>
    </div>
  );
}