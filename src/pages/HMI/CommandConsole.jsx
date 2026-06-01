import { useState, useEffect } from 'react';
import API from '../../apiConfig';
import NavBar2 from '../../components/NavBar2';
import Footer from '../../components/Footer';

export default function MasterController() {
  const [devices, setDevices] = useState([]);
  const [input, setInput] = useState("");
  const [consoleHistory, setConsoleHistory] = useState([
    { type: 'system', text: 'PIZZERIA V-DCS TERMINAL [Version 1.0.4]' },
    { type: 'system', text: 'GRID CONTROL NETWORKS OPERATIONAL.' },
    { type: 'system', text: 'READY FOR PROTOCOLS.' },
  ]);

  // 1. Fetch live device inventory from database
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await API.get('devices/inventory/');
        const mappedDevices = res.data.map(device => ({
          dbId: device.id,
          id: device.device_id,
          name: device.name,
          val: device.setpoint || 0,
          unit: device.type === 'oven' ? '°F' : device.type === 'conveyor' ? '%' : 'L/m',
          power: device.is_on,
          status: device.is_on ? 'ACTIVE' : 'OFFLINE',
          type: device.type
        }));
        setDevices(mappedDevices);
      } catch (err) {
        console.error('Failed to load HMI telemetry grid', err);
      }
    };
    fetchDevices();
  }, []);

  // 2. Connect WebSockets for real-time SCADA telemetry
  useEffect(() => {
    if (devices.length === 0) return;

    const sockets = {};

    devices.forEach(device => {
      const { hostname, protocol } = window.location;
      const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${hostname}:8000/ws/telemetry/${device.id}/`;
      
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        setDevices(prevDevices => 
          prevDevices.map(d => 
            d.id === device.id 
              ? { 
                  ...d, 
                  val: payload.value, 
                  power: payload.status, 
                  status: payload.status ? 'ACTIVE' : 'OFFLINE' 
                } 
              : d
          )
        );
      };

      sockets[device.id] = ws;
    });

    return () => {
      Object.values(sockets).forEach(socket => socket.close());
    };
  }, [devices.map(d => d.id).join(',')]);

  // 3. Actuate Controls (Power & Adjustment)
  const togglePower = async (dbId, id, currentPower) => {
    try {
      await API.patch(`devices/${dbId}/control/`, { is_on: !currentPower });
      setConsoleHistory(prev => [
        ...prev, 
        { type: 'system', text: `PROTOCOL: ${!currentPower ? 'START' : 'SHUTDOWN'} sequence dispatched to ${id}` }
      ]);
    } catch (err) {
      setConsoleHistory(prev => [
        ...prev, 
        { type: 'error', text: `ERR: Transit failure on power command to ${id}` }
      ]);
    }
  };

  const handleSliderChange = async (dbId, id, value) => {
    try {
      await API.patch(`devices/${dbId}/control/`, { last_value: value });
    } catch (err) {
      console.error(`Failed to adjust value on ${id}`, err);
    }
  };

  // 4. Command Input Handler
  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input) return;

    const newEntry = { type: 'user', text: `> ${input}` };
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const targetId = parts[1];
    const rawVal = parts[2];

    let response = { type: 'error', text: `ERR: PROTOCOL UNRECOGNIZED` };

    if (command === 'help') {
      response = { type: 'system', text: 'AVAILABLE: STATUS [id], START [id], SHUTDOWN [id], SET_VAL [id] [value]' };
      setConsoleHistory(prev => [...prev, newEntry, response]);
      setInput("");
      return;
    }

    const device = devices.find(d => d.id === targetId);
    if (!device) {
      if (['status', 'start', 'shutdown', 'set_val'].includes(command)) {
        response = { type: 'error', text: `ERR: NODE ${targetId || 'UNKNOWN'} NOT REGISTERED` };
      }
      setConsoleHistory(prev => [...prev, newEntry, response]);
      setInput("");
      return;
    }

    try {
      if (command === 'status') {
        response = { type: 'success', text: `NODE ${device.id}: ${device.val}${device.unit} [${device.status}]` };
      } else if (command === 'start') {
        await API.patch(`devices/${device.dbId}/control/`, { is_on: true });
        response = { type: 'system', text: `PROTOCOL: START sequence dispatched to ${device.id}` };
      } else if (command === 'shutdown') {
        await API.patch(`devices/${device.dbId}/control/`, { is_on: false });
        response = { type: 'system', text: `PROTOCOL: SHUTDOWN sequence dispatched to ${device.id}` };
      } else if (command === 'set_val') {
        const val = parseFloat(rawVal);
        if (isNaN(val)) {
          response = { type: 'error', text: `ERR: EXPECTED NUMERICAL VALUE` };
        } else {
          await API.patch(`devices/${device.dbId}/control/`, { last_value: val });
          response = { type: 'system', text: `PROTOCOL: SET_VAL (${val}${device.unit}) dispatched to ${device.id}` };
        }
      }
    } catch (err) {
      response = { type: 'error', text: `ERR: TRANSMISSION LOSS ON NODE ${device.id}` };
    }

    setConsoleHistory(prev => [...prev, newEntry, response]);
    setInput("");
  };

  return (
    <main className="min-h-screen bg-white dm-sans-regular flex flex-col">
      <NavBar2 variant="hmi" tenantName="Crust & Co - NY Branch" />

      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col relative overflow-hidden min-h-screen w-full">
        
        <section className="py-8 -mx-8 px-8 border-b border-gray-100 bg-zinc-50/20">
          <p className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[9px] mb-2">Hybrid Actuation Layer</p>
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 uppercase leading-none">
            Master <span className="text-zinc-400 italic font-light tracking-tight">Controller.</span>
          </h1>
        </section>

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
                   <button onClick={() => togglePower(device.dbId, device.id, device.power)} className={`w-8 h-4 rounded-full relative transition-colors ${device.power ? 'bg-orange-500' : 'bg-zinc-300'}`}>
                     <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${device.power ? 'left-4.5' : 'left-0.5'}`} />
                   </button>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                   <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Manual Adjustment</span>
                   <input 
                     type="range" 
                     disabled={!device.power} 
                     min={0}
                     max={device.type === 'oven' ? 500 : device.type === 'conveyor' ? 1.0 : 20.0}
                     step={device.type === 'conveyor' ? 0.05 : 1}
                     value={device.val}
                     onMouseUp={(e) => handleSliderChange(device.dbId, device.id, parseFloat(e.target.value))}
                     onChange={(e) => {
                       const value = parseFloat(e.target.value);
                       setDevices(prev => prev.map(d => d.id === device.id ? { ...d, val: value } : d));
                     }}
                     className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-orange-600" 
                   />
                </div>
              </div>

              <div className="col-span-3 p-6 pr-8 flex flex-col items-end justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-tighter">{device.status}</span>
                  <div className={`h-1.5 w-1.5 rounded-full ${device.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <p className="text-2xl font-bold tracking-tighter text-zinc-900 mt-1">{device.val.toFixed(device.type === 'conveyor' ? 2 : 1)}{device.unit}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-12 -mx-8 border-b border-gray-100 bg-white">
          <div className="col-span-12 lg:col-span-9 bg-zinc-900 p-8 flex flex-col text-sm border-r border-zinc-800 min-h-125">
            <div className="flex-1 overflow-y-auto space-y-1.5 mb-6 max-h-80 custom-scrollbar">
              {consoleHistory.map((line, i) => (
                <div key={i} className={`font-mono text-xs leading-relaxed ${
                  line.type === 'user' ? 'text-white font-bold' : line.type === 'error' ? 'text-red-400' : line.type === 'success' ? 'text-green-400' : 'text-zinc-500'
                }`}>
                  {line.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleCommand} className="flex gap-3 border-t border-zinc-800 pt-6">
              <span className="text-orange-500 font-bold font-mono text-xs">root@pizzeria:~#</span>
              <input 
                autoFocus
                className="bg-transparent border-none outline-none text-white w-full font-mono text-xs"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </form>
          </div>

          <aside className="col-span-12 lg:col-span-3 p-8 bg-zinc-50/50 flex flex-col border-l border-gray-100">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">Protocol Guide</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest border-l border-orange-500 pl-3">STATUS [ID]</p>
                <p className="text-[11px] text-zinc-500 mt-1 pl-4 italic">Node ping.</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest border-l border-zinc-300 pl-3">START [ID]</p>
                <p className="text-[11px] text-zinc-500 mt-1 pl-4 italic">Start device.</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest border-l border-zinc-300 pl-3">SHUTDOWN [ID]</p>
                <p className="text-[11px] text-zinc-500 mt-1 pl-4 italic">Emergency stop.</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest border-l border-zinc-300 pl-3">SET_VAL [ID] [VAL]</p>
                <p className="text-[11px] text-zinc-500 mt-1 pl-4 italic">Change value setpoint.</p>
              </div>
            </div>
          </aside>
        </section>

        <Footer />
      </div>
    </main>
  );
}
