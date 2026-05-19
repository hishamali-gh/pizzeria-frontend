import NavBar2 from "../../components/NavBar2";
import Footer from "../../components/Footer";

import DeviceCard from "../../components/DeviceCard";
import HistorianChart from "../../components/HistorianChart";


export default function Dashboard() {
  return (
    <main className="min-h-screen bg-white dm-sans-regular">
      <NavBar2 variant="hmi" tenantName="Crust & Co - NY Branch" />

      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col relative overflow-hidden min-h-screen">

        <div className="grid grid-cols-12 -mx-8 border-b border-gray-100">

          <section className="col-span-8 border-r border-gray-100 p-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-600 mb-8">
              Plant Overview / Topology [cite: 10]
            </h3>
            
            <div className="grid grid-cols-3 -m-8">
              <DeviceCard 
                deviceId="OVN-001" 
                deviceName="Master Oven" 
                type="oven" 
              />
              <DeviceCard 
                deviceId="CVR-001" 
                deviceName="Master Conveyor" 
                type="conveyor" 
              />
              <DeviceCard 
                deviceId="PMP-001" 
                deviceName="Master Pump" 
                type="pump" 
              />
              <DeviceCard 
                deviceId="OVN-002" 
                deviceName="Secondary Oven" 
                type="oven" 
              />
              <DeviceCard 
                deviceId="CVR-002" 
                deviceName="Secondary Conveyor" 
                type="conveyor" 
              />
              <DeviceCard 
                deviceId="PMP-002" 
                deviceName="Secondary Pump" 
                type="pump" 
              />
            </div>
          </section>

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

        <section className="-mx-8 p-8 border-b border-gray-100 relative z-10">
          <HistorianChart deviceId='OVN-001' />
        </section>
        
        <Footer />
      </div>
    </main>
  );
}
