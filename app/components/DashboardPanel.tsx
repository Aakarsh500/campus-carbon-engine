import React, { useState } from 'react';
import { ChevronRight, BrainCircuit, Activity } from 'lucide-react';
import SJTView from './SJTView';
import PRPView from './PRPView';

interface DashboardPanelProps {
  activeBuilding: 'SJT' | 'PRP' | null;
  setActiveBuilding: (building: 'SJT' | 'PRP' | null) => void;
  isEcoMode: boolean; // Add this prop
}

export default function DashboardPanel({ activeBuilding, setActiveBuilding, isEcoMode }: DashboardPanelProps) {
  const [months, setMonths] = useState(6);

  return (
    <div className={`absolute top-0 right-0 h-full w-full md:w-[500px] bg-white/95 backdrop-blur-2xl shadow-[[-20px_0_60px_-15px_rgba(0,0,0,0.3)]] border-l border-white/40 z-30 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${activeBuilding ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto pb-10`}>
      <div className="p-6 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {activeBuilding === 'SJT' ? 'Silver Jubilee Tower' : activeBuilding === 'PRP' ? 'Pearl Research Park' : ''}
            </h2>
            {activeBuilding && (
              <p className={`text-sm font-bold flex items-center gap-1 mt-1 ${activeBuilding === 'PRP' ? 'text-purple-600' : 'text-blue-600'}`}>
                {activeBuilding === 'PRP' ? <><BrainCircuit className="w-4 h-4" /> Prophet ML Model Active</> : <><Activity className="w-4 h-4" /> Hardware Logic Active</>}
              </p>
            )}
          </div>
          <button onClick={() => setActiveBuilding(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition shadow-sm border border-slate-200">
            <ChevronRight className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {isEcoMode && (
          <div className="mb-6 bg-emerald-100 border border-emerald-400 p-3 rounded-xl animate-pulse">
            <p className="text-emerald-800 text-sm font-bold text-center">🌍 Emergency Eco-Mode Engaged</p>
          </div>
        )}

        {activeBuilding === 'SJT' && <SJTView months={months} isEcoMode={isEcoMode} />}
        {activeBuilding === 'PRP' && <PRPView months={months} isEcoMode={isEcoMode} />}

        {/* Universal Timeline Slider */}
        {activeBuilding && (
          <div className="mt-8 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between text-sm font-medium mb-4">
              <span className="text-slate-600 font-bold">Projection Timeline</span>
              <span className="text-slate-900 font-black bg-slate-100 px-3 py-1 rounded-full">{months} Months</span>
            </div>
            <input
              type="range" min="1" max="12" value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
            />
          </div>
        )}
      </div>
    </div>
  );
}
