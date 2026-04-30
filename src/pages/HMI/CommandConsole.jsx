import { useState } from 'react';
import NavBar2 from '../../components/NavBar2';
import Footer from '../../components/Footer';

export default function MasterController() {
  // 1. STATE: Visual HMI Layer
  const [devices, setDevices] = useState([
    { id: "OVN-001", name: "Master Oven Primary", val: 485, unit: "°F", power: true, status: "ACTIVE" },
    { id: "MIX-042", name: "Dough Hydrator", val: 89, unit: "%", power: true, status: "WARNING" },
    { id: "PMP-012", name: "Sauce Injector", val: 0, unit: "L/m", power: false, status: "OFFLINE" },
  ]);

  // 2. STATE: Engineering Console Layer
  const [input, setInput] = useState("");
  const [consoleHistory, setConsoleHistory] = useState([
    { type: 'system', text: 'PIZZERIA V-DCS TERMINAL [Version 1.0.4]' },
    { type: 'system', text: 'TUNNEL: CRUST-NY-01 ESTABLISHED.' },
    { type: 'system', text: 'READY FOR COMMANDS.' },
  ]);

  const togglePower = (id) => {
    setDevices(devices.map(d => d.id === id ? { ...d, power: !d.power, status: !d.power ? 'ACTIVE' : 'OFFLINE' } : d));
    const action = devices.find(d => d.id === id).power ? 'SHUTDOWN' : 'INITIALIZE';
    setConsoleHistory([...consoleHistory, { type: 'system', text: `PROTOCOL: ${action} sequence broadcast to ${id}` }]);
  };

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input) return;
    const newEntry = { type: 'user', text: `> ${input}` };
    let response = { type: 'error', text: `ERR: PROTOCOL UNRECOGNIZED: ${input.split(' ')[0]}` };
    if (input.toLowerCase() === 'help') {
      response = { type: 'system', text: 'AVAILABLE: STATUS, SHUTDOWN, SET_TEMP' };
    }
    setConsoleHistory([...consoleHistory, newEntry, response]);
    setInput("");
  };

  return (
    <main className="min-h-screen bg-white dm-sans-regular flex flex-col">
      <NavBar2 variant="hmi" tenantName="Crust & Co - NY Branch" />

      {/* Main Integrated Container */}
      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col flex-1 w-full relative">
        
        {/* HEADER SECTION - Tightened py-12 to py-8 */}
        <section className="py-8 -mx-8 px-8 border-b border-gray-100 bg-zinc-50/20">
          <p className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Hybrid Actuation Layer</p>
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 uppercase leading-none">
            Master <span className="text-zinc-400 italic font-light tracking-tight">Controller.</span>
          </h1>
        </section>

        {/* VISUAL HMI LAYER (Device Grid) - Tightened padding from p-8 to p-6 */}
        <section className="-mx-8 border-b border-gray-100 bg-white">
          <div className="grid grid-cols-12 border-b border-gray-100 bg-zinc-50/10">
            <div className="col-span-4 p-4 pl-8 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Node Identity</div>
            <div className="col-span-5 p-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">HMI Actuators</div>
            <div className="col-span-3 p-4 pr-8 text-right text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Global Status</div>
          </div>

          {devices.map((device, i) => (
            <div key={i} className={`grid grid-cols-12 border-b border-gray-100 last:border-0 hover:bg-zinc-50/30 transition-all ${!device.power ? 'opacity-40' : ''}`}>
              <div className="col-span-4 p-6 pl-8">
                <p className="text-base font-bold text-zinc-900 tracking-tight leading-none">{device.name}</p>
                <p className="text-[10px] font-mono text-zinc-400 mt-2 uppercase tracking-wider">{device.id}</p>
              </div>
              
              <div className="col-span-5 p-6 flex items-center gap-10">
                <div className="flex flex-col gap-2">
                   <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest text-center">Power</span>
                   <button onClick={() => togglePower(device.id)} className={`w-8 h-4 rounded-full relative transition-colors ${device.power ? 'bg-orange-500' : 'bg-zinc-300'}`}>
                     <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${device.power ? 'left-4.5' : 'left-0.5'}`} />
                   </button>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                   <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Manual Adjustment</span>
                   <input type="range" disabled={!device.power} className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
                </div>
              </div>

              <div className="col-span-3 p-6 pr-8 flex flex-col items-end justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-tighter">{device.status}</span>
                  <div className={`h-1.5 w-1.5 rounded-full ${device.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <p className="text-2xl font-bold tracking-tighter text-zinc-900 mt-1">{device.val}{device.unit}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ENGINEERING CONSOLE LAYER - Reduced padding and min-height for a tidier look */}
        <section className="grid grid-cols-12 -mx-8 flex-1 min-h-125">
          
          {/* Terminal Output Feed */}
          <div className="col-span-12 lg:col-span-9 bg-zinc-900 p-8 flex flex-col text-sm border-r border-zinc-800">
            <div className="flex-1 overflow-y-auto space-y-1.5 mb-6 custom-scrollbar">
              {consoleHistory.map((line, i) => (
                <div key={i} className={`font-mono text-xs leading-relaxed ${
                  line.type === 'user' ? 'text-white font-bold' : 
                  line.type === 'error' ? 'text-red-400' : 
                  line.type === 'success' ? 'text-green-400' : 'text-zinc-500'
                }`}>
                  {line.text}
                </div>
              ))}
            </div>

            {/* Terminal Input Line */}
            <form onSubmit={handleCommand} className="flex gap-3 border-t border-zinc-800 pt-6">
              <span className="text-orange-500 font-bold font-mono text-xs">root@pizzeria:~#</span>
              <input 
                autoFocus
                className="bg-transparent border-none outline-none text-white w-full font-mono text-xs placeholder:text-zinc-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Awaiting protocol..."
              />
            </form>
          </div>

          {/* Quick-Ref Sidebar */}
          <aside className="col-span-12 lg:col-span-3 p-8 bg-zinc-50/50 flex flex-col border-l border-gray-100">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">Protocol Guide</h3>
            <div className="space-y-8 flex-1">
              <div>
                <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest border-l border-orange-500 pl-3">STATUS [ID]</p>
                <p className="text-[11px] text-zinc-500 mt-1 pl-4 leading-snug italic">Real-time node ping.</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest border-l border-zinc-300 pl-3">SHUTDOWN [ID]</p>
                <p className="text-[11px] text-zinc-500 mt-1 pl-4 leading-snug italic">Kill automated loop.</p>
              </div>
              
              <div className="pt-8 border-t border-gray-200 mt-auto">
                <p className="text-[8px] font-bold text-orange-600 uppercase tracking-widest">Active Auth</p>
                <p className="text-xs font-bold text-zinc-900 mt-1 tracking-tight">Shift_Mgr_NY</p>
                <div className="mt-3 px-3 py-1 bg-zinc-900 text-white text-[8px] font-bold rounded uppercase inline-block">
                  Clearance: L4
                </div>
              </div>
            </div>
          </aside>
        </section>

        <Footer />

      </div>
    </main>
  );
}
