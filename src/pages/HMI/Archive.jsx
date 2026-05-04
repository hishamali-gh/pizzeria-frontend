import { useState } from 'react';
import NavBar2 from '../../components/NavBar2';
import Footer from '../../components/Footer';

export default function Archive() {
  const [dateRange, setDateRange] = useState("Last 24 Hours");

  return (
    <main className="min-h-screen bg-white dm-sans-regular flex flex-col">
      <NavBar2 variant="hmi" tenantName="Crust & Co - NY Branch" />

      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col flex-1 w-full relative overflow-hidden">
        
        {/* 1. PAGE HEADER */}
        <section className="py-8 -mx-8 px-8 border-b border-gray-100 bg-zinc-50/20">
          <p className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Data Archive // Post-Mortem</p>
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 uppercase leading-none">
            The <span className="text-zinc-400 italic font-light tracking-tight">Historian.</span>
          </h1>
        </section>

        {/* 2. ANALYTICS FILTERS (Integrated Grid) */}
        <div className="grid grid-cols-12 -mx-8 border-b border-gray-100 bg-white">
          <div className="col-span-12 flex items-center justify-between p-4 px-8">
            <div className="flex gap-8">
              {['Last 24h', '7 Days', '30 Days', 'Custom Range'].map((range, i) => (
                <button 
                  key={i} 
                  onClick={() => setDateRange(range)}
                  className={`text-[10px] font-bold uppercase tracking-widest ${dateRange.includes(range) ? 'text-zinc-900 underline underline-offset-8' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  {range}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
               <button className="px-4 py-1.5 border border-zinc-200 text-[9px] font-bold uppercase tracking-widest rounded-md hover:bg-zinc-50">Export CSV</button>
               <button className="px-4 py-1.5 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-md hover:bg-orange-600 transition-all">Generate Report</button>
            </div>
          </div>
        </div>

        {/* 3. MAIN TREND VIEW (The Big Chart) */}
        <section className="-mx-8 p-8 border-b border-gray-100 flex-1 min-h-100 bg-white">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Parameter: Oven_Thermal_Output [Node: OVN-001]</h3>
             <span className="text-[10px] font-mono text-zinc-400">Resolution: 1s Intervals</span>
          </div>
          
          {/* Placeholder for a high-density graph (Recharts/D3) */}
          <div className="w-full h-80 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl flex items-center justify-center">
             <p className="text-zinc-400 text-xs italic font-mono uppercase">Historical_Telemetry_Stream_Render_Area</p>
          </div>

          {/* 4. DATA TABLE SUMMARY (Integrated rows) */}
          <div className="mt-12">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">Statistical Anomalies Detected</h3>
            <div className="border-t border-gray-100">
               {[
                 { time: "03:14:22 AM", node: "OVN-001", issue: "Setpoint Deviation", val: "+12.4°F" },
                 { time: "01:05:01 AM", node: "MIX-042", issue: "Torque Spike", val: "94% Load" }
               ].map((log, i) => (
                 <div key={i} className="grid grid-cols-12 py-4 border-b border-gray-100 text-[11px]">
                    <span className="col-span-2 font-mono text-zinc-400">{log.time}</span>
                    <span className="col-span-2 font-bold text-zinc-900 uppercase">{log.node}</span>
                    <span className="col-span-6 text-zinc-500 uppercase font-bold tracking-tight">{log.issue}</span>
                    <span className="col-span-2 text-right font-black text-orange-600">{log.val}</span>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <Footer />

      </div>
    </main>
  );
}
