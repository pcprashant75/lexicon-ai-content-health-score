
import React, { useState, useEffect } from 'react';
import { Search, Brain, BarChart3, ShieldCheck } from 'lucide-react';

const STEPS = [
  { id: 1, label: "Agent 1: Discovering Industry & Market Context", icon: Search },
  { id: 2, label: "Agent 2: Mapping Buyer Intent & Personas", icon: Brain },
  { id: 3, label: "Agent 3: Scoring Strategic Content Maturity", icon: BarChart3 },
  { id: 4, label: "Finalizing Content Intelligence Report", icon: ShieldCheck }
];

const ProcessingView: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-12">
        <div className="w-24 h-24 rounded-full border-4 border-[#ad3642]/10 border-t-[#ad3642] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
            <Brain className="w-8 h-8 text-[#ad3642]" />
          </div>
        </div>
      </div>

      <h3 className="text-3xl font-display font-bold text-slate-900 mb-2">Analyzing Intelligence...</h3>
      <p className="text-slate-500 mb-12">Our multi-agent system is autonomously auditing your website content.</p>

      <div className="w-full space-y-4">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          const isDone = idx < activeStep;

          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 ${
                isActive 
                  ? 'bg-white border-[#ad3642] shadow-xl shadow-[#ad3642]/5 scale-[1.02]' 
                  : isDone 
                  ? 'bg-slate-50 border-slate-100 opacity-60' 
                  : 'bg-transparent border-transparent opacity-30'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${isActive || isDone ? 'bg-[#ad3642] text-white' : 'bg-slate-200 text-slate-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.label}
              </span>
              {isActive && (
                <div className="ml-auto flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#ad3642] rounded-full animate-bounce delay-0"></div>
                  <div className="w-1.5 h-1.5 bg-[#ad3642] rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-[#ad3642] rounded-full animate-bounce delay-300"></div>
                </div>
              )}
              {isDone && (
                <div className="ml-auto text-emerald-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingView;
