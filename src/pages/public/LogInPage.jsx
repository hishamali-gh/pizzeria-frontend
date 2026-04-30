export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white flex">

      <section className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dm-sans-regular uppercase">
              Welcome Back
            </h2>
            <p className="text-zinc-500 text-sm dm-sans-regular mt-2">
              Enter your credentials to access your franchise telemetry.
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                Admin Email
              </label>
              <input 
                type="email" 
                placeholder="admin@example.com" 
                className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-sm dm-sans-regular"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-[10px] font-bold text-orange-600 uppercase tracking-widest hover:underline">
                  Forgot?
                </a>
              </div>
              <input 
                type="password"  
                className="w-full px-5 py-4 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:border-orange-600 transition-all text-sm dm-sans-regular"
              />
            </div>

            <button className="w-full py-5 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 dm-sans-regular uppercase text-xs tracking-[0.2em] mt-4">
              Login
            </button>

            <p className="text-center text-[10px] text-zinc-400 dm-sans-regular uppercase tracking-widest mt-8">
              New to the system? <a href="/signup" className="text-orange-600 font-black hover:underline">Register Franchise</a>
            </p>
          </form>
        </div>
      </section>

      <section className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900">
        <img 
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" 
          alt="Command Center"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

    </main>
  );
}
