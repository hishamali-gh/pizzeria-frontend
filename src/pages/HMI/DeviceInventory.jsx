import { useState, useEffect } from 'react';

import NavBar2 from "../../components/NavBar2";
import Footer from "../../components/Footer";

import useTelemetry from "../../hooks/useTelemetry";

import API from "../../apiConfig";


function InventoryRow({ device }) {
  const { value, status } = useTelemetry(device.device_id);

  const liveStatus = status ?? false;
  const liveValue = value ?? "---";

  return (
    <div className="grid grid-cols-12 border-b border-gray-100 hover:bg-zinc-50/50 transition-colors group">
      <div className="col-span-4 p-6 pl-8">
        <p className="text-sm font-bold text-zinc-900 tracking-tight">{device.name}</p>
        <p className="text-[10px] font-mono text-zinc-400 mt-2 uppercase">{device.device_id}</p>
      </div>

      <div className="col-span-2 p-6 flex items-center">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{device.type}</span>
      </div>

      <div className="col-span-2 p-6 flex items-center gap-3">
        <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
          liveStatus ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'
        }`} />
        <span className="text-[10px] font-bold text-zinc-800 uppercase">
          {liveStatus ? 'ACTIVE' : 'OFFLINE'}
        </span>
      </div>

      <div className="col-span-2 p-6 flex items-center font-mono text-sm font-bold text-zinc-900 tracking-tighter">
        {liveValue !== "---" ? `${liveValue}${device.type === 'oven' ? '°F' : ' RPM'}` : 'SYNCING...'}
      </div>

      <div className="col-span-2 p-6 pr-8 flex items-center justify-end gap-4">
        <div className={`text-[8px] font-bold px-2 py-1 rounded ${liveStatus ? 'bg-zinc-100 text-zinc-600' : 'bg-red-50 text-red-400'}`}>
          {liveStatus ? 'LINK_LIVE' : 'CONN_WAIT'}
        </div>
      </div>
    </div>
  );
}

export default function DeviceInventory() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await API.get('devices/inventory/');
        setDevices(res.data);
      } catch (err) {
        console.error("Inventory Fetch Failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <main className="min-h-screen bg-white dm-sans-regular">
      <NavBar2 variant="hmi" tenantName="Crust & Co - NY Branch" />

      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col min-h-screen">
        <section className="py-12 -mx-8 px-8 border-b border-gray-100">
          <p className="text-orange-600 font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
            System Assets / Node Inventory
          </p>
          <h1 className="text-5xl font-bold tracking-tighter text-zinc-900 leading-none">
            Device <span className="text-zinc-400 italic font-light tracking-tight">Provisioning.</span>
          </h1>
        </section>

        <section className="-mx-8">
          <div className="grid grid-cols-12 border-b border-gray-100 bg-zinc-50/50">
            <div className="col-span-4 p-4 pl-8 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Node Identity</div>
            <div className="col-span-2 p-4 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Category</div>
            <div className="col-span-2 p-4 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Live Status</div>
            <div className="col-span-2 p-4 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Telemetry</div>
            <div className="col-span-2 p-4 pr-8 text-right text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Link Status</div>
          </div>

          {loading ? (
            <div className="p-12 text-center font-mono text-xs text-zinc-400">CONNECTING_TO_DCS_VAULT...</div>
          ) : (
            devices.map((device) => (
              <InventoryRow key={device.device_id} device={device} />
            ))
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}
