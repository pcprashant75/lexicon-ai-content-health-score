
import React from 'react';
import { CategoryScore } from '../types';

interface ScoreCardProps {
  data: CategoryScore;
  index: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ data, index }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#ad3642]/40 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#ad3642]/10 transition-all duration-500 group cursor-default">
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <span className="text-[10px] text-[#ad3642] font-bold tracking-widest uppercase">Dimension {index + 1}</span>
          <h4 className="text-xl font-display font-bold text-slate-900 group-hover:text-[#ad3642] transition-colors leading-tight">{data.name}</h4>
        </div>
        <div className="relative flex-shrink-0 ml-4">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 * (1 - data.score / 100)}
              className="text-[#ad3642]"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-slate-900 leading-none">{data.score}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">/ 100</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-5">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-[#ad3642]/5 transition-colors">
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">AI Observation</p>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">"{data.insight}"</p>
        </div>
        
        <div className="px-1">
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Strategic Reasoning</p>
          <p className="text-xs text-slate-500 leading-relaxed">{data.reasoning}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
