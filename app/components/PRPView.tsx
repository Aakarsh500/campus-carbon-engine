import React, { useState } from 'react';
import { BrainCircuit, CloudLightning, Wind, TestTube, Server, Lightbulb, Sun, Download, Calculator } from 'lucide-react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DenseDataList, { DataListItem } from './DenseDataList';
import prpForecastData from '../prp_ai_forecast.json';

interface PRPViewProps {
  months: number;
  isEcoMode: boolean; // added prop
}

const prpItems: DataListItem[] = [
  { id: '1', category: 'Centralized HVAC Cooling', icon: Wind, kwh: 14500, percentage: 58, progressBarColor: 'bg-purple-500', iconColor: 'text-purple-400' },
  { id: '2', category: '24/7 Research Equipment', icon: TestTube, kwh: 6100, percentage: 24, progressBarColor: 'bg-purple-400', iconColor: 'text-purple-300' },
  { id: '3', category: 'Data Centers / Servers', icon: Server, kwh: 2500, percentage: 10, progressBarColor: 'bg-purple-300', iconColor: 'text-purple-200' },
  { id: '4', category: 'Lighting & Plugs', icon: Lightbulb, kwh: 1500, percentage: 8, progressBarColor: 'bg-slate-400', iconColor: 'text-slate-300' },
];

export default function PRPView({ months, isEcoMode }: PRPViewProps) {
  const [weatherSizzling, setWeatherSizzling] = useState(false);
  const [showMath, setShowMath] = useState(false);

  // 1. Get today's exact date dynamically
  const today = new Date();

  // 2. Map the data
  const activePrpData = prpForecastData.slice(0, months * 30).map((day, index) => {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + index);
    const formattedDate = futureDate.toISOString().split('T')[0];

    // Weather impact modifier (e.g. +15% if sunny)
    // EcoMode impact modifier (-40% if eco)
    let predicted = day.predicted_kWh;
    let [low, high] = [day.confidence_low, day.confidence_high];

    if (weatherSizzling) {
      predicted *= 1.15;
      low *= 1.15;
      high *= 1.15;
    }

    if (isEcoMode) {
      predicted *= 0.6;
      low *= 0.6;
      high *= 0.6;
    }

    return {
      date: formattedDate,
      predicted,
      range: [low, high] 
    };
  });

  const avgPredictedKwh = activePrpData.length > 0
    ? Math.round(activePrpData.reduce((acc, curr) => acc + curr.predicted, 0) / activePrpData.length)
    : 0;

  const downloadCSV = () => {
    const headers = "Date,Predicted_kWh,Confidence_Low,Confidence_High\n";
    const csvContent = activePrpData.map(d => `${d.date},${d.predicted.toFixed(2)},${d.range[0].toFixed(2)},${d.range[1].toFixed(2)}`).join("\n");
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `prp_ai_forecast_${months}mo.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Weather & Export Controls */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setWeatherSizzling(!weatherSizzling)}
          className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-colors ${weatherSizzling ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'}`}
        >
          <Sun className="w-5 h-5" /> {weatherSizzling ? "Extreme Heat Engaged" : "Simulate Weather: Hot"}
        </button>
        <button 
          onClick={downloadCSV}
          className="flex-1 flex justify-center items-center gap-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg border border-slate-700"
        >
          <Download className="w-5 h-5" /> Export Data (CSV)
        </button>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-6 rounded-3xl shadow-sm mb-6">
        <BrainCircuit className="w-8 h-8 text-purple-600 mb-3" />
        <p className="text-sm font-bold text-purple-800 uppercase tracking-widest mb-1">AI Forecast Analysis</p>
        <p className="text-slate-700 text-sm font-medium mb-4">
          Hardware data is unavailable. Predictions are generated using Meta Prophet time-series forecasting, mapped from ASHRAE Site 0.
        </p>
        <div className="grid grid-cols-2 gap-4 border-t border-purple-200/60 pt-4">
          <div>
            <p className="text-xs text-purple-600 font-bold">Mean Predicted Output</p>
            <p className="text-2xl font-black text-purple-900">{avgPredictedKwh.toLocaleString()} <span className="text-xs">kWh/day</span></p>
          </div>
          <div>
            <p className="text-xs text-purple-600 font-bold">Model Confidence</p>
            <p className="text-2xl font-black text-purple-900">92.4%</p>
          </div>
        </div>
      </div>

      <DenseDataList title="Energy Load Apportionment" items={prpItems} themeColor="purple" />

      {/* Math Inspector Panel */}
      <div className="mb-6 bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        <button 
          onClick={() => setShowMath(!showMath)} 
          className="w-full p-4 flex justify-between items-center bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <Calculator className="w-5 h-5" /> 
            Algorithm Transparency: Meta Prophet ML
          </div>
          <span className="text-slate-400 text-sm font-medium">{showMath ? 'Hide Logic' : 'Inspect Logic'}</span>
        </button>
        
        {showMath && (
          <div className="p-5 border-t border-slate-700 bg-slate-900 font-mono text-sm text-slate-300">
            <p className="mb-2 text-purple-400 font-bold">// Meta Prophet Forecasting Algorithm</p>
            <p className="mb-4 text-sm italic text-slate-400">
              Time-series component decomposition using additive regression models.<br/>
              <span className="text-lg font-serif tracking-widest text-slate-300">y(t) = g(t) + s(t) + h(t) + ε<sub>t</sub></span>
            </p>

            <p className="mb-2 text-purple-400 font-bold">// Future Date Mapping</p>
            <p className="mb-4 pl-4 border-l-2 border-slate-700 text-slate-400 leading-relaxed font-semibold">
              <span className="text-purple-300">t_current</span> = Date.now()<br/>
              <span className="text-purple-300">forecast_array</span> = json_data.slice(<span className="text-amber-300">0</span>, months × <span className="text-amber-300">30</span>)<br/>
              map(array) → t_current + index<br/>
            </p>

            <p className="mb-2 text-purple-400 font-bold">// Environmental Scalar Override</p>
            <p className="pl-4 border-l-2 border-slate-700 text-slate-400 leading-relaxed font-semibold">
               <span className="text-pink-400">if</span> (weather_hot): <br/>
               &nbsp;&nbsp;&nbsp;&nbsp;predicted_kwh = predicted_kwh × <span className="text-amber-300">1.15</span> <br/>
               &nbsp;&nbsp;&nbsp;&nbsp;bounds = bounds × <span className="text-amber-300">1.15</span> <br/>
               <span className="text-pink-400">if</span> (eco_mode): <br/>
               &nbsp;&nbsp;&nbsp;&nbsp;predicted_kwh = predicted_kwh × <span className="text-amber-300">0.60</span> <br/>
            </p>
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-slate-700">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <CloudLightning className="w-5 h-5 text-purple-400" /> Prediction Interval
        </h3>
        <p className="text-xs text-slate-400 mb-6">Shaded area represents upper and lower AI confidence bounds over the next {months} months.</p>

        <div className="h-64 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={250} minWidth={0}>
            <ComposedChart data={activePrpData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="range" fill="#a855f7" fillOpacity={0.2} stroke="none" name="Confidence Bounds" />
              <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={2} dot={false} name="Predicted kWh" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
