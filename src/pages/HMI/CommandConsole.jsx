import { useState, useEffect } from 'react';
import API from '../../apiConfig';
import NavBar2 from '../../components/NavBar2';
import Footer from '../../components/Footer';

export default function MasterController() {
  const [devices, setDevices] = useState([]);
  const [input, setInput] = useState("");
  const [consoleHistory, setConsoleHistory] = useState([
    { type: 'system', text: 'PIZZERIA V-DCS TERMINAL [Version 1.0.4]' },
    { type: 'system', text: 'TUNNEL: CRUST-NY-01 ESTABLISHED.' },
    { type: 'system', text: 'READY FOR COMMANDS.' },
  ]);

  // 1. Fetch live device inventory from database
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await API.get('devices/inventory/');
        const mappedDevices = res.data.map(device => ({
          dbId: device.id,                // Database primary key UUID
          id: device.device_id,           // Alphanumeric device ID (e.g., 'oven-01')
          name: device.name,
          setpoint: device.setpoint || 0, // Target temperature or conveyor speed
          val: device.setpoint || 0,      // Live sensor value (starts at setpoint)
          unit: device.type === 'oven' ? '°F' : device.type === 'conveyor' ? '%' : 'L/m',
          power: device.is_on,            // Power state (true/false)
          isOnline: false,                // Connection health indicator (starts offline)
          lastSeen: 0,                    // Last telemetry heartbeat timestamp
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
      const subdomain = hostname.split('.')[0];
      const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
      let wsHost;

      if (hostname.endsWith('localhost')) {
          wsHost = `${hostname}:8000`;
      } else {
          wsHost = `${subdomain}.pizzeriavdcs.duckdns.org`;
      }

      const wsUrl = `${wsProtocol}//${wsHost}/ws/telemetry/${device.id}/`;

      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        setDevices(prevDevices =>
          prevDevices.map(d =>
            d.id === device.id
              ? {
                ...d,
                val: payload.value,      // Update ONLY live value
                power: payload.status,   // Power state reported by simulator
                isOnline: true,          // Telemetry received! Node is online
                lastSeen: Date.now()     // Update watchdog timestamp
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

  // 2B. Heartbeat watchdog to monitor node disconnection
  useEffect(() => {
    const watchdog = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(d => {
          // If never heard from or heard > 6s ago, mark offline
          const isOnline = d.lastSeen > 0 && (Date.now() - d.lastSeen < 6000);
          return { ...d, isOnline };
        })
      );
    }, 3000);

    return () => clearInterval(watchdog);
  }, []);

  // 3. Actuate Controls (Power & Adjustment)
  const togglePower = async (dbId, id, currentPower) => {
    const nextPower = !currentPower;
    try {
      await API.patch(`devices/inventory/${dbId}/control/`, { is_on: nextPower });
      
      // Update local state immediately for instant responsive feedback:
      setDevices(prev => prev.map(d => 
        d.id === id 
          ? { 
              ...d, 
              power: nextPower
            } 
          : d
      ));

      setConsoleHistory(prev => [
        ...prev, 
        { type: 'system', text: `PROTOCOL: ${nextPower ? 'START' : 'SHUTDOWN'} sequence dispatched to ${id}` }
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
      await API.patch(`devices/inventory/${dbId}/control/`, { last_value: value });
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

    const device = devices.find(d => d.id.toLowerCase() === targetId?.toLowerCase());
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
        response = { type: 'success', text: `NODE ${device.id}: Comm=${device.isOnline ? 'ONLINE' : 'OFFLINE'}, Power=${device.power ? 'ON' : 'OFF'}, Current=${device.val.toFixed(device.type === 'conveyor' ? 2 : 1)}${device.unit}, Target=${device.setpoint.toFixed(device.type === 'conveyor' ? 2 : 1)}${device.unit}` };
      } else if (command === 'start') {
        if (!device.isOnline) {
          response = { type: 'error', text: `ERR: NODE ${device.id} OFFLINE - CANNOT COMMAND` };
        } else {
          await API.patch(`devices/inventory/${device.dbId}/control/`, { is_on: true });
          setDevices(prev => prev.map(d => d.id === device.id ? { ...d, power: true } : d));
          response = { type: 'system', text: `PROTOCOL: START sequence dispatched to ${device.id}` };
        }
      } else if (command === 'shutdown') {
        if (!device.isOnline) {
          response = { type: 'error', text: `ERR: NODE ${device.id} OFFLINE - CANNOT COMMAND` };
        } else {
          await API.patch(`devices/inventory/${device.dbId}/control/`, { is_on: false });
          setDevices(prev => prev.map(d => d.id === device.id ? { ...d, power: false } : d));
          response = { type: 'system', text: `PROTOCOL: SHUTDOWN sequence dispatched to ${device.id}` };
        }
      } else if (command === 'set_val') {
        if (!device.isOnline) {
          response = { type: 'error', text: `ERR: NODE ${device.id} OFFLINE - CANNOT COMMAND` };
        } else {
          const val = parseFloat(rawVal);
          if (isNaN(val)) {
            response = { type: 'error', text: `ERR: EXPECTED NUMERICAL VALUE` };
          } else {
            await API.patch(`devices/inventory/${device.dbId}/control/`, { last_value: val });
            setDevices(prev => prev.map(d => d.id === device.id ? { ...d, setpoint: val } : d));
            response = { type: 'system', text: `PROTOCOL: SET_VAL (${val}${device.unit}) dispatched to ${device.id}` };
          }
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
            <div key={i} className={`grid grid-cols-12 border-b border-gray-100 last:border-0 hover:bg-zinc-50/30 transition-all ${!device.isOnline ? 'opacity-40' : ''}`}>
              <div className="col-span-4 p-6 pl-8">
                <p className="text-base font-bold text-zinc-900 tracking-tight leading-none">{device.name}</p>
                <p className="text-[10px] font-mono text-zinc-400 mt-2 uppercase tracking-wider">{device.id}</p>
              </div>
              
              <div className="col-span-5 p-6 flex items-center gap-10">
                <div className="flex flex-col gap-2">
                   <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest text-center">Power</span>
                   <button 
                     disabled={!device.isOnline}
                     onClick={() => togglePower(device.dbId, device.id, device.power)} 
                     className={`w-8 h-4 rounded-full relative transition-colors ${!device.isOnline ? 'bg-zinc-200 cursor-not-allowed' : device.power ? 'bg-orange-500' : 'bg-zinc-300'}`}
                   >
                     <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${device.power ? 'left-4.5' : 'left-0.5'}`} />
                   </button>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                     <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Setpoint / Target</span>
                     <span className="text-[10px] font-mono font-bold text-orange-600">
                       {device.setpoint.toFixed(device.type === 'conveyor' ? 2 : 1)}{device.unit}
                     </span>
                   </div>
                   <input 
                     type="range" 
                     disabled={!device.isOnline || !device.power} 
                     min={0}
                     max={device.type === 'oven' ? 500 : device.type === 'conveyor' ? 1.0 : 20.0}
                     step={device.type === 'conveyor' ? 0.05 : 1}
                     value={device.setpoint}
                     onMouseUp={(e) => handleSliderChange(device.dbId, device.id, parseFloat(e.target.value))}
                     onChange={(e) => {
                       const value = parseFloat(e.target.value);
                       setDevices(prev => prev.map(d => d.id === device.id ? { ...d, setpoint: value } : d));
                     }}
                     className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-orange-600" 
                   />
                </div>
              </div>

              <div className="col-span-3 p-6 pr-8 flex flex-col items-end justify-center">
                <div className="flex items-center gap-4 mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${device.power ? 'bg-orange-100 text-orange-700' : 'bg-zinc-100 text-zinc-600'}`}>
                    {device.power ? 'POWER: ON' : 'POWER: OFF'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-tighter">
                      {device.isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                    <div className={`h-1.5 w-1.5 rounded-full ${device.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </div>
                <div className="text-right mt-1">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block">Current Reading</span>
                  <p className="text-2xl font-bold tracking-tighter text-zinc-900 leading-none">
                    {device.val.toFixed(device.type === 'conveyor' ? 2 : 1)}{device.unit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-12 -mx-8 border-b border-gray-100 bg-white">
          <div className="col-span-12 lg:col-span-9 bg-zinc-900 p-8 flex flex-col text-sm border-r border-zinc-800 min-h-125">
            <div className="flex-1 overflow-y-auto space-y-1.5 mb-6 max-h-80 custom-scrollbar">
              {consoleHistory.map((line, i) => (
                <div key={i} className={`font-mono text-xs leading-relaxed ${line.type === 'user' ? 'text-white font-bold' : line.type === 'error' ? 'text-red-400' : line.type === 'success' ? 'text-green-400' : 'text-zinc-500'
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
