import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface DataListItem {
  id: string;
  category: string;
  icon: LucideIcon;
  qty?: number;
  kwh: number;
  percentage: number;
  progressBarColor: string; // e.g. 'bg-blue-500'
  iconColor: string; // e.g. 'text-blue-400'
}

interface DenseDataListProps {
  title: string;
  items: DataListItem[];
  themeColor: 'blue' | 'purple' | 'emerald';
}

export default function DenseDataList({ title, items, themeColor }: DenseDataListProps) {
  const headerTextClass = 
    themeColor === 'purple' ? 'text-purple-400' : 
    themeColor === 'emerald' ? 'text-emerald-400' : 
    'text-blue-400';

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-slate-700 mb-6">
      <h3 className={`text-lg font-bold mb-4 ${headerTextClass}`}>{title}</h3>
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-800/50 p-3 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-700/50 ${item.iconColor}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-200">{item.category}</p>
                  {item.qty && <p className="text-xs text-slate-400 font-medium">Qty: {item.qty}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{item.kwh.toLocaleString()} <span className="text-xs text-slate-400">kWh</span></p>
                <p className="text-xs font-semibold text-slate-400">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div className={`h-1.5 rounded-full ${item.progressBarColor}`} style={{ width: `${item.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
