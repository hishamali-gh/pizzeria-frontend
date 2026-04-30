export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-white flex">

      <section className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900">
        <img 
          src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2070&auto=format&fit=crop" 
          alt="Automated Pizzeria"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      </section>

      <section className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dm-sans-regular uppercase">
              Create Account
            </h2>
            <p className="text-zinc-500 text-sm dm-sans-regular mt-2">
              Sign up to start managing your automated pizza franchise.
            </p>
          </div>

          <form className="space-y-5">

            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                Franchise Name
              </label>
              <input 
                type="text" 
                placeholder="e.g. Crust & Co" 
                className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-sm dm-sans-regular"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                Subdomain / URL
              </label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  placeholder="my-branch" 
                  className="flex-1 px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-l-2xl focus:outline-none focus:border-orange-500 transition-all text-sm dm-sans-regular"
                />
                <span className="px-5 py-4 bg-zinc-100 border border-l-0 border-zinc-100 rounded-r-2xl text-zinc-400 text-xs font-bold">
                  .pizzeria.app
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                  Admin Email
                </label>
                <input 
                  type="email" 
                  placeholder="admin@example.com" 
                  className="w-full px-5 py-4 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:border-orange-600 transition-all text-sm dm-sans-regular"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                  Password
                </label>
                <input 
                  type="password"
                  className="w-full px-5 py-4 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:border-orange-600 transition-all text-sm dm-sans-regular"
                />
              </div>
            </div>

            <button className="w-full py-5 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 dm-sans-regular uppercase text-xs tracking-[0.2em] mt-4">
              Sign Up
            </button>

            <p className="text-center text-[10px] text-zinc-400 dm-sans-regular uppercase tracking-widest mt-8">
              Already have an account? <a href="/login" className="text-orange-600 font-black hover:underline">Login here</a>
            </p>
          </form>
        </div>
      </section>

    </main>
  );
}
