"use client";

import React, { useState, useEffect } from 'react';
import { Leaf, Power, AlertTriangle, X, ArrowUpRight } from 'lucide-react';
import MapOverlay from './components/MapOverlay';
import DashboardPanel from './components/DashboardPanel';

interface Toast {
  id: number;
  message: string;
}

export default function CampusDashboard() {
  const [activeBuilding, setActiveBuilding] = useState<null | 'SJT' | 'PRP'>(null);
  const [isEcoMode, setIsEcoMode] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [liveOdometer, setLiveOdometer] = useState(1450234);

  // Odometer effect
  useEffect(() => {
    const ticker = setInterval(() => {
      setLiveOdometer(prev => prev + Math.floor(Math.random() * 5) + (isEcoMode ? 15 : 2));
    }, 1000);
    return () => clearInterval(ticker);
  }, [isEcoMode]);

  // Simulated Anomaly Alerts via Toast Notifications
  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    
    // Simulate an anomaly after 15 seconds
    const t1 = setTimeout(() => {
      setToasts(prev => [...prev, { id: 1, message: "⚠️ Anomaly Detected: HVAC load spike in PRP due to external heat gain." }]);
    }, 15000);
    
    // Simulate a model update after 30 seconds
    const t2 = setTimeout(() => {
      setToasts(prev => [...prev, { id: 2, message: "🧠 Prophet Model Update: Confidence bounds widened by 4.2%." }]);
    }, 30000);

    timeoutIds.push(t1, t2);

    return () => timeoutIds.forEach(clearTimeout);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans text-slate-800 transition-colors duration-1000 ${isEcoMode ? 'bg-emerald-950' : 'bg-slate-900'}`}>
      
      {/* NAVBAR */}
      <nav className={`absolute top-0 left-0 w-full z-20 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center shadow-sm transition-colors duration-500 ${isEcoMode ? 'bg-emerald-900/80 border-emerald-500/50' : 'bg-white/80 border-white/20'}`}>
        <div className="flex items-center gap-3">
          <Leaf className={`w-6 h-6 ${isEcoMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
          <h1 className={`text-xl font-bold tracking-wide ${isEcoMode ? 'text-white' : 'text-slate-800'}`}>Campus AI Carbon Engine</h1>
        </div>
        
        {/* NEW LIVE ODOMETER */}
        <div className={`hidden md:flex items-center gap-3 px-5 py-1.5 rounded-full border shadow-inner ${isEcoMode ? 'bg-emerald-800/80 border-emerald-500 text-emerald-100' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
           <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> Live Offset</span>
           <span className="font-mono font-bold text-lg tabular-nums">{liveOdometer.toLocaleString()} <span className="text-xs">kg</span></span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsEcoMode(!isEcoMode)}
            className={`flex items-center gap-2 px-4 py-2 font-bold rounded-full border shadow-sm transition-all duration-300 ${isEcoMode ? 'bg-red-500 text-white border-red-400 hover:bg-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200'}`}
          >
            <Power className="w-4 h-4" />
            {isEcoMode ? 'DISABLE ECO-MODE' : 'ENGAGE ECO-MODE'}
          </button>
          
          <div className={`text-sm font-bold px-4 py-2 rounded-full border shadow-inner ${isEcoMode ? 'bg-emerald-800 text-emerald-100 border-emerald-700' : 'text-slate-600 bg-slate-100 border-slate-200'}`}>
            Admin: Aakarsh | 23BCE0341
          </div>
        </div>
      </nav>

      {/* TOAST NOTIFICATIONS */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto flex items-center justify-between bg-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              {toast.message}
            </div>
            <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        ))}
      </div>

      {/* INTERACTIVE MAP */}
      <MapOverlay activeBuilding={activeBuilding} setActiveBuilding={setActiveBuilding} isEcoMode={isEcoMode} />

      {/* DASHBOARD PANEL */}
      <DashboardPanel activeBuilding={activeBuilding} setActiveBuilding={setActiveBuilding} isEcoMode={isEcoMode} />
    </div>
  );
}