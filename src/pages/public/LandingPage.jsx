import NavBar1 from "../../components/NavBar1";
import Footer from "../../components/Footer";


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      <NavBar1 />

      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col relative overflow-hidden">

        <section className="py-24 relative z-10">
          <p className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-6 dm-sans-regular">
            System Initialization: Complete
          </p>

          <h1 className="text-7xl font-bold tracking-tighter text-zinc-900 dm-sans-regular max-w-3xl leading-[0.9] mb-8">
            Welcome to the <br />
            <span className="text-orange-600 italic">Command Center.</span>
          </h1>

          <div className="max-w-2xl space-y-6">
            <p className="text-xl text-zinc-600 dm-sans-regular leading-relaxed italic border-l-2 border-orange-200 pl-6">
              "In an era where scale is the only metric that matters, a single
              unmonitored oven isn't just a kitchen error—it's a
              telemetry failure. We didn't build a website; we built a
              nervous system for your franchise."
            </p>

            <p className="text-lg text-zinc-500 dm-sans-regular leading-relaxed">
              Standardization is the bedrock of the modern Pizzeria. By treating
              every station as a high-precision node in a global network, we
              ensure that the crust in London is identical to the crust in Tokyo.
              The Pizzeria VDCS provides the situational awareness required to
              manage the chaos of global demand with industrial-grade precision.
            </p>
          </div>

          <div className="mt-12 flex gap-4">
            <button className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 dm-sans-regular uppercase text-sm tracking-tighter">
              Access Dashboard
            </button>
            <button className="px-8 py-4 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-full hover:bg-zinc-50 transition-all dm-sans-regular uppercase text-sm tracking-tighter">
              Review Architecture
            </button>
          </div>
        </section>

        <section className="py-24 border-t border-gray-100 relative z-10 bg-zinc-50/50 -mx-8 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 dm-sans-regular uppercase mb-6">
                Distributed Control <br />Architecture (DCS)
              </h2>
              <p className="text-zinc-500 dm-sans-regular leading-relaxed mb-6">
                Unlike traditional monolithic management tools, our VDCS
                (Virtual Distributed Control System) decentralizes decision-making.
                Each station—the dough mixer, the sauce injector, the oven—acts
                as an intelligent node.
              </p>
              <ul className="space-y-4">
                {[
                  { title: "Real-time Telemetry", desc: "100ms latency on sensor data streams." },
                  { title: "Multi-Tenant Isolation", desc: "Physical data separation for every franchise." },
                  { title: "Fault Tolerance", desc: "Automatic failover protocols for offline stations." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="text-orange-600 font-bold">0{i + 1}</span>
                    <div>
                      <h4 className="font-bold text-zinc-800 dm-sans-regular uppercase text-sm">{item.title}</h4>
                      <p className="text-zinc-500 text-xs">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-zinc-200 rounded-2xl bg-white p-8 shadow-sm flex flex-col justify-center">
              <div className="h-1 w-20 bg-orange-600 mb-4" />
              <p className="text-4xl font-bold text-zinc-900 dm-sans-regular tracking-tighter leading-none mb-2">99.9%</p>
              <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">System Uptime Reliability</p>
              <div className="mt-8 grid grid-cols-5 gap-2">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className={`h-8 rounded-sm ${i === 12 ? 'bg-orange-500 animate-pulse' : 'bg-zinc-100'}`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />

      </div>
    </main>
  );
}
