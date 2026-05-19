import { useState, useEffect } from 'react';
import useTelemetry from '../hooks/useTelemetry';

export default function HistorianChart({ deviceId }) {
  // 1. Hook into the live feed
  const liveData = useTelemetry(deviceId);
  
  // 2. State to hold the "Historical" sequence (last 48 points)
  const [history, setHistory] = useState(new Array(48).fill(0));

  useEffect(() => {
    if (liveData.value !== '--') {
      setHistory(prev => {
        const newHistory = [...prev.slice(1), liveData.value];
        return newHistory;
      });
    }
  }, [liveData.value]);

  const SCALE_CEILING = 600;

  return (
    <section className="-mx-8 p-8 border-b border-gray-100 relative z-10">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-600 mb-8 flex justify-between">
        <span>Real-Time Telemetry / Historian Trends</span>
        <span className="font-mono text-zinc-400">ACTIVE_NODE: {deviceId}</span>
      </h3>
      
      <div className="h-64 w-full flex items-end justify-between gap-1 border-b border-zinc-200 pb-2">
        {history.map((val, i) => (
          <div 
            key={i} 
            className={`w-full transition-all duration-300 ${
              i === 47 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-zinc-100'
            }`} 
            style={{ 
            height: `${(val / SCALE_CEILING) * 100}%`, // Constant scale
            opacity: 0.2 + (i / 48) * 0.8 
            }}
          />
        ))}
      </div>
      
      <div className="mt-4 flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
        <span>T-48 SEC</span>
        <div className="flex gap-4">
          <span className="text-orange-500">LIVE_VALUE: {liveData.value}</span>
          <span>Current Stream (T-0)</span>
        </div>
      </div>
    </section>
  );
}
