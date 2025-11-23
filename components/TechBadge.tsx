import React, { useState } from 'react';

import { Sparkles, Cpu, Code2, Zap } from 'lucide-react';

const TechBadge: React.FC = () => {
  return (
    <div className="fixed bottom-24 right-8 z-40 group">
      <div className="relative flex items-center justify-end">
        {/* Collapsible Content */}
        <div className="absolute right-0 bottom-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-blue-500/20 border border-white/50 dark:border-gray-700 p-1.5 w-14 h-14 group-hover:w-72 group-hover:h-auto group-hover:p-5 overflow-hidden transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) origin-bottom-right">
          <div className="w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <h4 className="font-bold text-sm mb-4 text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold tracking-tight">POWERED BY</span>
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-700/60 p-3 rounded-2xl border border-gray-100 dark:border-gray-600 hover:scale-[1.02] hover:shadow-md transition-all cursor-default group/item">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl group-hover/item:scale-110 transition-transform">
                  <Cpu className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-purple-900 dark:text-purple-100">Gemini 2.0 Flash</span>
                  <span className="text-[10px] text-gray-500">Advanced AI Model</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-700/60 p-3 rounded-2xl border border-gray-100 dark:border-gray-600 hover:scale-[1.02] hover:shadow-md transition-all cursor-default group/item">
                <div className="p-2 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl group-hover/item:scale-110 transition-transform">
                  <Code2 className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-cyan-900 dark:text-cyan-100">React 19 + TS</span>
                  <span className="text-[10px] text-gray-500">Modern Frontend</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-700/60 p-3 rounded-2xl border border-gray-100 dark:border-gray-600 hover:scale-[1.02] hover:shadow-md transition-all cursor-default group/item">
                <div className="p-2 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl group-hover/item:scale-110 transition-transform">
                  <Zap className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-yellow-900 dark:text-yellow-100">Vite + Tailwind</span>
                  <span className="text-[10px] text-gray-500">Lightning Fast Build</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trigger Button */}
        <div className="absolute right-0 bottom-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-500 cursor-pointer z-10 group-hover:scale-0 group-hover:opacity-0 group-hover:rotate-90">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default TechBadge;
