import { useState, useEffect } from 'react';
import API from "../../apiConfig";
import NavBar2 from "../../components/NavBar2";
import Footer from "../../components/Footer";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All', 'Active', 'Acknowledged'

  const fetchAlerts = async () => {
    try {
      const res = await API.get('devices/alerts/');
      setAlerts(res.data);
    } catch (err) {
      console.error("Failed to load event alerts", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await API.post(`devices/alerts/${id}/acknowledge/`);
      fetchAlerts();
    } catch (err) {
      console.error("Failed to acknowledge alert", err);
    }
  };

  // Filter logs
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'Active') return !alert.is_acknowledged;
    if (filter === 'Acknowledged') return alert.is_acknowledged;
    return true;
  });

  return (
    <main className="min-h-screen bg-white dm-sans-regular">
      <NavBar2 variant="hmi" tenantName="Crust & Co - HMI Grid" />

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
              {['All', 'Active', 'Acknowledged'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setFilter(tab)}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-all ${filter === tab ? 'text-zinc-900 underline underline-offset-8 font-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  {tab === 'All' ? 'All Events' : tab === 'Active' ? 'Active Alerts' : 'Acknowledged'}
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
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-zinc-400 text-xs uppercase tracking-wider">
              No system logs found in this sector.
            </div>
          ) : (
            filteredAlerts.map((alert, i) => (
              <div 
                key={alert.id || i} 
                className={`grid grid-cols-12 border-b border-gray-100 hover:bg-zinc-50/50 transition-colors ${!alert.is_acknowledged ? 'bg-red-50/20' : ''}`}
              >
                {/* Timestamp */}
                <div className="col-span-2 p-6 pl-8 font-mono text-[11px] text-zinc-400 uppercase">
                  {new Date(alert.created_at).toLocaleTimeString()}
                </div>

                {/* Type & Node */}
                <div className="col-span-2 p-6 flex flex-col justify-center gap-1">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded w-fit ${alert.is_acknowledged ? 'bg-zinc-900 text-white' : 'bg-red-100 text-red-600'}`}>
                    {alert.type}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{alert.device_id}</span>
                </div>

                {/* Description */}
                <div className="col-span-5 p-6 flex items-center border-l border-gray-50">
                  <p className="text-sm font-bold text-zinc-900 tracking-tight leading-tight">
                    Setpoint of <span className="text-red-500 font-mono">{alert.value}</span> breached the safety limit threshold of {alert.threshold}.
                  </p>
                </div>

                {/* Audit Status */}
                <div className="col-span-3 p-6 pr-8 flex items-center justify-end text-right">
                  {!alert.is_acknowledged ? (
                    <button 
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-4 py-2 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
                    >
                      Require ACK
                    </button>
                  ) : (
                    <div>
                      <p className="text-[10px] font-black text-zinc-800 uppercase tracking-widest mb-0.5">
                        ACK BY {alert.acknowledged_by || "System"}
                      </p>
                      <p className="text-[8px] font-mono text-zinc-400 uppercase italic">
                        Triggered by: {alert.triggered_by || "System/Unknown"}
                      </p>
                      {alert.acknowledged_at && (
                        <p className="text-[9px] font-mono text-zinc-400 uppercase italic mt-0.5">
                          @{new Date(alert.acknowledged_at).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}
