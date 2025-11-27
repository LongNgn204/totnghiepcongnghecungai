import React from 'react';
import { Cpu, Code2, Zap, Atom } from 'lucide-react';

const TechBadge: React.FC = () => {
  return (
    <div className="fixed bottom-24 right-8 z-40 group">
      <div className="relative flex items-center justify-end">
        {/* Collapsible Content */}
        <div className="absolute right-0 bottom-0 bg-stem-sidebar/90 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.2)] border border-stem-primary/30 p-1.5 w-14 h-14 group-hover:w-72 group-hover:h-auto group-hover:p-5 overflow-hidden transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) origin-bottom-right">
          <div className="w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <h4 className="font-bold text-sm mb-4 text-white flex items-center gap-2 border-b border-slate-700 pb-2">
              <Atom className="w-5 h-5 text-blue-500 animate-spin-slow" />
              <span className="text-blue-500 font-black tracking-widest uppercase drop-shadow-sm text-base">
                HỆ THỐNG LÕI
              </span>
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-xs font-medium text-slate-300 bg-stem-bg/60 p-3 rounded-xl border border-slate-700 hover:border-stem-primary/50 transition-all cursor-default group/item">
                <div className="p-2 bg-stem-primary/10 rounded-lg group-hover/item:text-stem-primary transition-colors">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">Gemini 2.0 Flash</span>
                  <span className="text-[10px] text-slate-500">Động Cơ AI Neural</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium text-slate-300 bg-stem-bg/60 p-3 rounded-xl border border-slate-700 hover:border-stem-accent/50 transition-all cursor-default group/item">
                <div className="p-2 bg-stem-accent/10 rounded-lg group-hover/item:text-stem-accent transition-colors">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">React 19 + TS</span>
                  <span className="text-[10px] text-slate-500">Kiến Trúc Frontend</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium text-slate-300 bg-stem-bg/60 p-3 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all cursor-default group/item">
                <div className="p-2 bg-emerald-500/10 rounded-lg group-hover/item:text-emerald-500 transition-colors">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">Vite + Tailwind</span>
                  <span className="text-[10px] text-slate-500">Hiệu Suất Cao</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trigger Button (Chip Style) */}
        <div className="absolute right-0 bottom-0 w-14 h-14 bg-stem-sidebar border-2 border-stem-primary rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center cursor-pointer z-10 group-hover:scale-0 group-hover:opacity-0 group-hover:rotate-90 transition-all duration-500">
          <div className="absolute inset-0 bg-stem-primary/20 animate-pulse rounded-xl"></div>
          <Cpu className="w-8 h-8 text-stem-primary relative z-10" />
          {/* Circuit Lines Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-stem-primary"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-stem-primary"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-2 bg-stem-primary"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-2 bg-stem-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default TechBadge;
