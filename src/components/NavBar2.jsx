export default function NavBar2({ variant = 'hmi', tenantName = 'Global Node' }) {
  return (
    <nav className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">

      <div className="max-w-7xl mx-auto px-8 border-gray-100 flex items-center justify-between h-16 relative">

        <div className="flex flex-1 items-center justify-start gap-6">
          <p className="text-2xl font-bold tracking-tighter text-orange-600 dm-sans-regular">
            Pizzeria
          </p>

          <div className="hidden lg:flex flex-col border-l border-zinc-200 pl-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 leading-none">
              {variant === 'hmi' ? 'Command Node' : 'System Status'}
            </span>
            <span className="text-sm font-bold text-zinc-800 tracking-tight dm-sans-regular">
              {variant === 'hmi' ? tenantName : 'Initialization: Complete'}
            </span>
          </div>
        </div>

        {variant === 'marketing' && (
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 z-10">
            {['Features', 'Solutions', 'Pricing', 'Login'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-orange-600 transition-colors dm-sans-regular"
              >
                {item}
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-1 items-center justify-end gap-6">
          {variant === 'hmi' ? (
            <div className="flex items-center gap-6">
              <div className="px-3 py-1 bg-red-50/50 border border-red-100 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-red-600 uppercase">3 Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Live</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-2 bg-green-50/50 border border-green-100 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">
                27 Active Franchises
              </span>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
