export default function NavBar1() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16 relative">

        <div className="flex flex-1 items-center justify-start">
          <p className="text-2xl font-bold tracking-tighter text-orange-600 dm-sans-regular">
            Pizzeria
          </p>
        </div>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 z-10">
          <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors dm-sans-regular">
            Features
          </a>
          <a href="#solutions" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors dm-sans-regular">
            Solutions
          </a>
          <a href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors dm-sans-regular">
            Pricing
          </a>
          <a href="#login" className="text-sm font-bold text-zinc-600 hover:text-black transition-colors dm-sans-regular">
            Login
          </a>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center gap-3 px-4 py-2 bg-green-50/50 border border-green-100 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-700 dm-sans-regular uppercase tracking-wider">
              27 Active Franchises
            </span>
          </div>
        </div>

      </div>
    </nav>
  );
}
