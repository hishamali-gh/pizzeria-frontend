import NavBar2 from "../../components/NavBar2";
import Footer from "../../components/Footer";


export default function DeviceInventory() {
  return (
    <main className="min-h-screen bg-white dm-sans-regular">
      <NavBar2 variant="hmi" tenantName="Crust & Co - NY Branch" />

      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col relative overflow-hidden min-h-screen">

        <section className="py-12 -mx-8 px-8 border-b border-gray-100">
          <p className="text-orange-600 font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
            System Assets / Node Inventory
          </p>
          <h1 className="text-5xl font-bold tracking-tighter text-zinc-900 leading-none">
            Device <span className="text-zinc-400 italic font-light tracking-tight">Provisioning.</span>
          </h1>
        </section>

        <div className="grid grid-cols-12 -mx-8 border-b border-gray-100 bg-zinc-50/30">
          <div className="col-span-12 flex items-center justify-between p-4 px-8">
            <div className="flex gap-8">
              {['All Nodes', 'Ovens', 'Mixers', 'Pumps'].map((tab, i) => (
                <button key={i} className={`text-[10px] font-bold uppercase tracking-widest ${i === 0 ? 'text-zinc-900 underline underline-offset-8' : 'text-zinc-400 hover:text-zinc-600'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Total Assets: 24
            </span>
          </div>
        </div>

        <section className="-mx-8">
          <div className="grid grid-cols-12 border-b border-gray-100 bg-white">
            <div className="col-span-4 p-4 pl-8 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Node Identity</div>
            <div className="col-span-2 p-4 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Category</div>
            <div className="col-span-2 p-4 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Live Status</div>
            <div className="col-span-2 p-4 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Telemetry</div>
            <div className="col-span-2 p-4 pr-8 text-right text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Actions</div>
          </div>

          {[
            { id: "OVN-001", name: "Master Oven Primary", type: "Thermal", status: "ACTIVE", val: "485°F" },
            { id: "MIX-042", name: "Dough Hydrator", type: "Mechanical", status: "WARNING", val: "89% Load" },
            { id: "PMP-012", name: "Tomato Sauce Injector", type: "Fluidics", status: "OFFLINE", val: "0.0 L/m" },
            { id: "OVN-002", name: "Backup Oven South", type: "Thermal", status: "ACTIVE", val: "482°F" },
          ].map((device, i) => (
            <div key={i} className="grid grid-cols-12 border-b border-gray-100 hover:bg-zinc-50/50 transition-colors group">
              <div className="col-span-4 p-6 pl-8">
                <p className="text-sm font-bold text-zinc-900 tracking-tight leading-none">{device.name}</p>
                <p className="text-[10px] font-mono text-zinc-400 mt-2 uppercase">{device.id}</p>
              </div>
              <div className="col-span-2 p-6 flex items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{device.type}</span>
              </div>
              <div className="col-span-2 p-6 flex items-center gap-3">
                <div className={`h-1.5 w-1.5 rounded-full ${
                  device.status === 'ACTIVE' ? 'bg-green-500' : 
                  device.status === 'WARNING' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-tighter">{device.status}</span>
              </div>
              <div className="col-span-2 p-6 flex items-center font-bold text-zinc-900 tracking-tighter">
                {device.val}
              </div>
              <div className="col-span-2 p-6 pr-8 flex items-center justify-end gap-4">
                <button className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest hover:text-orange-600 transition-colors">Configure</button>
                <button className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest hover:text-red-600 transition-colors">Service</button>
              </div>
            </div>
          ))}
        </section>

        <Footer />

      </div>
    </main>
  );
}
