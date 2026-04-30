import NavBar2 from "../../components/NavBar2";
import Footer from "../../components/Footer";


export default function Dashboard() {
  return (
    <main className="min-h-screen bg-white dm-sans-regular">
      <NavBar2 />

      {/* 2. The Integrated Grid Container */}
      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col relative overflow-hidden min-h-screen">
        
        {/* TOP SECTION: Split between Node Grid and Event Log */}
        <div className="grid grid-cols-12 -mx-8 border-b border-gray-100">
          
          {/* 3. Plant Overview (Node Grid) */}
          <section className="col-span-8 border-r border-gray-100 p-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-600 mb-8">
              Plant Overview / Topology [cite: 10]
            </h3>
            
            <div className="grid grid-cols-3 -m-8">
              {[
                { name: "Oven #01", val: "485° F", status: "NORMAL" },
                { name: "Mixer #01", val: "89%", status: "DRIFT" },
                { name: "Pump #01", val: "FAIL", status: "CRITICAL" },
                { name: "Oven #02", val: "482° F", status: "NORMAL" },
                { name: "Mixer #02", val: "42%", status: "NORMAL" },
                { name: "Pump #02", val: "12.4 L/m", status: "NORMAL" },
              ].map((node, i) => (
                <div key={i} className="p-8 border-r border-b border-gray-100 last:border-r-0">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">{node.name}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      node.status === 'NORMAL' ? 'bg-green-500' : 
                      node.status === 'DRIFT' ? 'bg-yellow-500' : 'bg-red-500 animate-ping'
                    }`} />
                  </div>
                  <div className={`text-4xl font-bold tracking-tighter leading-none ${
                    node.status === 'CRITICAL' ? 'text-red-600' : 'text-zinc-900'
                  }`}>
                    {node.val}
                  </div>
                  <div className="mt-4 h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full ${node.status === 'CRITICAL' ? 'bg-red-500 w-full' : 'bg-zinc-300 w-2/3'}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Event & Alert Log (The Sidebar) */}
          <aside className="col-span-4 p-8 bg-zinc-50/30">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-8">
              Historian Event Log [cite: 23]
            </h3>
            <div className="space-y-6">
              {[
                { time: "14:05:22", msg: "Oven #2 Temp Spike" },
                { time: "13:58:10", msg: "Mixer #1 Load high" },
                { time: "13:50:01", msg: "Pump #1 initialized" },
                { time: "13:45:12", msg: "Shift Manager Auth" },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0">
                  <span className="font-mono text-[10px] text-zinc-400">{log.time}</span>
                  <span className="text-[11px] font-bold text-zinc-800 uppercase tracking-tight">{log.msg}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* 5. Real-Time Telemetry (The Historian) */}
        <section className="-mx-8 p-8 border-b border-gray-100 relative z-10">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-600 mb-8">
            Real-Time Telemetry / Historian Trends [cite: 15]
          </h3>
          <div className="h-64 w-full flex items-end justify-between gap-1 border-b border-zinc-200 pb-2">
            {[...Array(48)].map((_, i) => (
              <div 
                key={i} 
                className={`w-full transition-all duration-500 ${
                  i === 40 ? 'bg-orange-500 h-[90%]' : 'bg-zinc-100 h-[40%]'
                }`} 
                style={{ height: `${Math.random() * 60 + 20}%` }}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
            <span>14:00:00</span>
            <span>Current Stream (T-0)</span>
          </div>
        </section>
        
        <Footer />

      </div>
    </main>
  );
}
