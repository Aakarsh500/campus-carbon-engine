import React, { useState } from 'react';
import { Settings, Monitor, BookOpen, Briefcase, Server, ArrowDownToDot, Presentation, UserCircle2, Coffee, TreePine, Calculator } from 'lucide-react';
import DenseDataList, { DataListItem } from './DenseDataList';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SJTViewProps {
  months: number;
  isEcoMode: boolean; // added prop
}

const sjtItems: DataListItem[] = [
  { id: '1', category: 'Computer Labs', icon: Monitor, qty: 42, kwh: 4602, percentage: 60.1, progressBarColor: 'bg-emerald-500', iconColor: 'text-emerald-400' },
  { id: '2', category: 'Classrooms', icon: BookOpen, qty: 161, kwh: 821, percentage: 10.7, progressBarColor: 'bg-emerald-400', iconColor: 'text-emerald-300' },
  { id: '3', category: 'Offices', icon: Briefcase, qty: 50, kwh: 720, percentage: 9.4, progressBarColor: 'bg-emerald-400', iconColor: 'text-emerald-300' },
  { id: '4', category: 'Server Rooms', icon: Server, qty: 8, kwh: 576, percentage: 7.5, progressBarColor: 'bg-emerald-300', iconColor: 'text-emerald-200' },
  { id: '5', category: 'Lifts', icon: ArrowDownToDot, qty: 8, kwh: 320, percentage: 4.2, progressBarColor: 'bg-slate-400', iconColor: 'text-slate-300' },
  { id: '6', category: 'Auditoriums', icon: Presentation, qty: 3, kwh: 288, percentage: 3.8, progressBarColor: 'bg-slate-400', iconColor: 'text-slate-300' },
  { id: '7', category: 'Faculty Cabins', icon: UserCircle2, qty: 270, kwh: 194, percentage: 2.5, progressBarColor: 'bg-slate-500', iconColor: 'text-slate-400' },
  { id: '8', category: 'Canteens & Shops', icon: Coffee, qty: 4, kwh: 132, percentage: 1.7, progressBarColor: 'bg-slate-500', iconColor: 'text-slate-400' },
];

export default function SJTView({ months, isEcoMode }: SJTViewProps) {
  const [pcSleepOn, setPcSleepOn] = useState(false);
  const [acOptOn, setAcOptOn] = useState(false);
  const [showMath, setShowMath] = useState(false);

  const BASE_DAILY_CO2 = 5433.64;
  const ACTIVE_DAYS_PER_MONTH = 25;
  
  // Eco mode enforces massive savings everywhere
  const ecoModeSavings = isEcoMode ? 3500 : 0; 
  const currentDailyCO2 = BASE_DAILY_CO2 - (pcSleepOn ? 322 : 0) - (acOptOn ? 865 : 0) - ecoModeSavings;
  const sjtTotalSaved = Math.round((BASE_DAILY_CO2 * (months * ACTIVE_DAYS_PER_MONTH)) - (currentDailyCO2 * (months * ACTIVE_DAYS_PER_MONTH)));

  const treesOffset = Math.round(sjtTotalSaved / 21); // Approx 21kg CO2 per tree per year

  // Generate chart data based on months
  const chartData = Array.from({ length: months }, (_, i) => {
    const monthIndex = i + 1;
    return {
      month: `Month ${monthIndex}`,
      baseline: Math.round(BASE_DAILY_CO2 * ACTIVE_DAYS_PER_MONTH * monthIndex),
      optimized: Math.round(currentDailyCO2 * ACTIVE_DAYS_PER_MONTH * monthIndex),
    };
  });

  return (
    <>
      {/* SJT Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Baseline Daily CO₂</p>
          <p className="text-3xl font-black text-blue-800">5,433 <span className="text-sm font-semibold">kg</span></p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Optimized Daily</p>
          <p className="text-3xl font-black text-emerald-800">{currentDailyCO2.toLocaleString()} <span className="text-sm font-semibold">kg</span></p>
        </div>
      </div>

      <DenseDataList title="Infrastructure Breakdown" items={sjtItems} themeColor="emerald" />

      {/* Math Inspector Panel */}
      <div className="mb-6 bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        <button 
          onClick={() => setShowMath(!showMath)} 
          className="w-full p-4 flex justify-between items-center bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Calculator className="w-5 h-5" /> 
            Algorithm Transparency: SJT Deterministic Model
          </div>
          <span className="text-slate-400 text-sm font-medium">{showMath ? 'Hide Math' : 'Show Math'}</span>
        </button>
        
        {showMath && (
          <div className="p-5 border-t border-slate-700 bg-slate-900 font-mono text-sm text-slate-300">
            <p className="mb-2 text-emerald-400 font-bold">// Baseline Calculation</p>
            <p className="mb-4 pl-4 border-l-2 border-slate-700 text-slate-400 leading-relaxed font-semibold">
              <span className="text-emerald-200">baseline_daily_co2</span> = <span className="text-amber-300">5433.64</span> kg<br/>
              <span className="text-emerald-200">active_days_per_month</span> = <span className="text-amber-300">25</span><br/>
            </p>

            <p className="mb-2 text-emerald-400 font-bold">// Optimization Logic Override</p>
            <p className="pl-4 border-l-2 border-slate-700 text-slate-400 leading-relaxed font-semibold">
               <span className="text-emerald-200">current_daily_co2</span> = baseline_daily_co2 <br/>
               &nbsp;&nbsp;&nbsp;&nbsp;- (pc_sleep_active ? <span className="text-amber-300">322</span> : <span className="text-amber-300">0</span>) <br/>
               &nbsp;&nbsp;&nbsp;&nbsp;- (ac_optimization ? <span className="text-amber-300">865</span> : <span className="text-amber-300">0</span>) <br/>
               &nbsp;&nbsp;&nbsp;&nbsp;- (eco_mode_active ? <span className="text-amber-300">3500</span> : <span className="text-amber-300">0</span>) <br/>
            </p>

            <p className="mt-4 mb-2 text-emerald-400 font-bold">// Projection Calculation</p>
            <p className="pl-4 border-l-2 border-slate-700 text-slate-400 leading-relaxed font-semibold">
               <span className="text-emerald-200">total_savings</span> = (months × days × baseline_daily_co2) <br/>
               &nbsp;&nbsp;&nbsp;&nbsp;- (months × days × current_daily_co2)
            </p>
          </div>
        )}
      </div>

      {/* SJT Toggles & Savings */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-slate-700 mb-6 relative overflow-hidden">
        {/* Background Tree Art for flavor */}
        <div className="absolute -bottom-10 -right-10 text-emerald-900/30">
          <TreePine className="w-48 h-48" />
        </div>

        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10"><Settings className="w-5 h-5 text-emerald-400" /> Hardware Optimization</h3>
        <div className="space-y-4 mb-6 relative z-10">
          <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl">
            <div><p className="font-bold text-sm">Force PC Sleep (Labs)</p></div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={pcSleepOn} onChange={() => setPcSleepOn(!pcSleepOn)} />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl">
            <div><p className="font-bold text-sm">AC Optimization (24°C)</p></div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={acOptOn} onChange={() => setAcOptOn(!acOptOn)} />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
        
        {/* New Savings Box with Trees Equivalent */}
        <div className="text-center pt-4 border-t border-slate-700 relative z-10 flex gap-4 mt-6">
          <div className="flex-1 bg-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Projected Savings ({months} Mo)</p>
            <p className="text-2xl font-black text-emerald-400">{sjtTotalSaved.toLocaleString()} kg</p>
          </div>
          <div className="flex-1 bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-md">
            <p className="text-xs text-emerald-200 font-bold uppercase mb-1 flex justify-center items-center gap-1">
              <TreePine className="w-4 h-4"/> Trees Offset
            </p>
            <p className="text-2xl font-black text-emerald-400">{treesOffset.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-slate-700">
        <h3 className="text-lg font-bold mb-4">Emissions Trajectory</h3>
        <div className="h-48 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={250} minWidth={0}>
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="baseline" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBaseline)" name="Baseline CO2" />
              <Area type="monotone" dataKey="optimized" stroke="#10b981" fillOpacity={1} fill="url(#colorOptimized)" name="Optimized CO2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
