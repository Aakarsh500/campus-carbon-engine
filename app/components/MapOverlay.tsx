import React from 'react';
import { Map, Overlay } from 'pigeon-maps';
import { MapPin } from 'lucide-react';

interface MapOverlayProps {
  activeBuilding: 'SJT' | 'PRP' | null;
  setActiveBuilding: (building: 'SJT' | 'PRP' | null) => void;
  isEcoMode: boolean; // Add this prop
}

export default function MapOverlay({ activeBuilding, setActiveBuilding, isEcoMode }: MapOverlayProps) {
  // If eco-mode is on, markers turn green.
  return (
    <div className="absolute inset-0 z-0">
      <Map defaultCenter={[12.9713, 79.1650]} defaultZoom={16} minZoom={14}>
        {/* SJT Marker */}
        <Overlay anchor={[12.9712, 79.1638]} offset={[60, 60]}>
          <div onClick={() => setActiveBuilding('SJT')} className="relative group cursor-pointer flex flex-col items-center transform transition-transform hover:scale-110">
            <div className={`absolute -inset-4 rounded-full blur-xl transition duration-500 ${isEcoMode ? 'bg-emerald-500/80 animate-pulse' : (activeBuilding === 'SJT' ? 'bg-blue-500/60 animate-pulse' : 'bg-blue-500/0 group-hover:bg-blue-500/40')}`}></div>
            <MapPin className={`w-14 h-14 drop-shadow-2xl z-10 ${isEcoMode ? 'text-emerald-500' : (activeBuilding === 'SJT' ? 'text-blue-600' : 'text-slate-500')}`} fill="currentColor" />
            <div className="mt-1 px-4 py-2 bg-white shadow-2xl rounded-full text-sm font-bold text-slate-800 border-2 border-blue-100 z-10 whitespace-nowrap">
              SJT (Deterministic)
            </div>
          </div>
        </Overlay>

        {/* PRP Marker */}
        <Overlay anchor={[12.97149, 79.16621]} offset={[60, 60]}>
          <div onClick={() => setActiveBuilding('PRP')} className="relative group cursor-pointer flex flex-col items-center transform transition-transform hover:scale-110">
            <div className={`absolute -inset-4 rounded-full blur-xl transition duration-500 ${isEcoMode ? 'bg-emerald-500/80 animate-pulse' : (activeBuilding === 'PRP' ? 'bg-purple-500/60 animate-pulse' : 'bg-purple-500/0 group-hover:bg-purple-500/40')}`}></div>
            <MapPin className={`w-14 h-14 drop-shadow-2xl z-10 ${isEcoMode ? 'text-emerald-500' : (activeBuilding === 'PRP' ? 'text-purple-600' : 'text-slate-500')}`} fill="currentColor" />
            <div className="mt-1 px-4 py-2 bg-white shadow-2xl rounded-full text-sm font-bold text-slate-800 border-2 border-purple-100 z-10 whitespace-nowrap">
              PRP (AI Forecast)
            </div>
          </div>
        </Overlay>
      </Map>
    </div>
  );
}
