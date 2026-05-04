import NavBar2 from "../../components/NavBar2";
import Footer from "../../components/Footer";

export default function Alerts() {
  const logs = [
    { id: "LOG-901", type: "ACTUATION", node: "OVN-001", msg: "Manual Temperature Override", time: "14:10:05", user: "OP_MARCUS_V", status: "EXECUTED" },
    { id: "ALM-402", type: "ALERT", node: "OVN-001", msg: "Thermal Runaway Detected", time: "14:05:22", user: "OP_MARCUS_V", status: "ACKNOWLEDGED", ack_at: "14:08:12" },
    { id: "LOG-882", type: "ACTUATION", node: "MIX-042", msg: "RPM Setpoint Adjustment", time: "13:55:01", user: "OP_ELENA_R", status: "EXECUTED" },
    { id: "ALM-112", type: "ALERT", node: "MIX-042", msg: "Torque Limit Approximation", time: "13:50:10", user: null, status: "UNACKNOWLEDGED" },
  ];

  return (
    <main className="min-h-screen bg-white dm-sans-regular">
      <NavBar2 variant="hmi" tenantName="Crust & Co - NY Branch" />

      {/* Main Integrated Container - Using the working Inventory structure */}
      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col relative overflow-hidden min-h-screen">
        
        {/* Header Section */}
        <section className="py-12 -mx-8 px-8 border-b border-gray-100">
          <p className="text-orange-600 font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
            Historian / Sequence of Events
          </p>
          <h1 className="text-5xl font-bold tracking-tighter text-zinc-900 leading-none">
            System <span className="text-zinc-400 italic font-light tracking-tight">Logs.</span>
          </h1>
        </section>

        {/* Filter Bar */}
        <div className="grid grid-cols-12 -mx-8 border-b border-gray-100 bg-zinc-50/30">
          <div className="col-span-12 flex items-center justify-between p-4 px-8">
            <div className="flex gap-8">
              {['All Events', 'Alerts', 'Actuations', 'Maintenance'].map((tab, i) => (
                <button key={i} className={`text-[10px] font-bold uppercase tracking-widest ${i === 0 ? 'text-zinc-900 underline underline-offset-8' : 'text-zinc-400'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Grid */}
        <section className="-mx-8">
          {/* Table Header */}
          <div className="grid grid-cols-12 border-b border-gray-100 bg-white">
            <div className="col-span-2 p-4 pl-8 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Timestamp</div>
            <div className="col-span-2 p-4 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Type / Node</div>
            <div className="col-span-5 p-4 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Event Description</div>
            <div className="col-span-3 p-4 pr-8 text-right text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Audit Status</div>
          </div>

          {/* Table Rows */}
          {logs.map((log, i) => (
            <div key={i} className={`grid grid-cols-12 border-b border-gray-100 hover:bg-zinc-50/50 transition-colors ${log.status === 'UNACKNOWLEDGED' ? 'bg-red-50/20' : ''}`}>
              
              <div className="col-span-2 p-6 pl-8 font-mono text-[11px] text-zinc-400 uppercase">
                {log.time}
              </div>

              <div className="col-span-2 p-6 flex flex-col justify-center gap-1">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded w-fit ${log.type === 'ACTUATION' ? 'bg-zinc-900 text-white' : 'bg-orange-100 text-orange-600'}`}>
                  {log.type}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">{log.node}</span>
              </div>

              <div className="col-span-5 p-6 flex items-center border-l border-gray-50">
                <p className="text-sm font-bold text-zinc-900 tracking-tight leading-tight">{log.msg}</p>
              </div>

              <div className="col-span-3 p-6 pr-8 flex items-center justify-end text-right">
                {log.status === 'UNACKNOWLEDGED' ? (
                  <button className="px-4 py-2 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-lg shadow-red-100 hover:bg-red-700 transition-all">
                    Require ACK
                  </button>
                ) : (
                  <div>
                    <p className="text-[10px] font-black text-zinc-800 uppercase tracking-widest mb-0.5">
                      {log.type === 'ACTUATION' ? `Action by ${log.user}` : `ACK by ${log.user}`}
                    </p>
                    <p className="text-[9px] font-mono text-zinc-400 uppercase italic">
                      @{log.ack_at || log.time}
                    </p>
                  </div>
                )}
              </div>

            </div>
          ))}
        </section>

        <Footer />
      </div>
    </main>
  );
}
