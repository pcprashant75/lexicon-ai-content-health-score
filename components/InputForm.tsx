
import React, { useState } from 'react';
import { UserInputs } from '../types';
import { Globe, ChevronRight } from 'lucide-react';

interface InputFormProps {
  onSubmit: (inputs: UserInputs) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl) return;
    
    let url = websiteUrl.trim();
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    onSubmit({ websiteUrl: url });
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center animate-in fade-in duration-700">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 tracking-tight">
          Audit Your Content <br/>
          <span className="text-[#ad3642]">With Autonomous AI Intelligence.</span>
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Enter your website URL. Our multi-agent AI system will autonomously scan your site, detect your industry, and benchmark your content maturity.
        </p>
      </div>

      <div className="w-full bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ad3642]/5 rounded-bl-full -z-0"></div>
        
        <form onSubmit={handleSubmit} className="relative space-y-6 z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Company Website URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="https://yourcompany.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#ad3642] focus:ring-4 focus:ring-[#ad3642]/5 rounded-xl py-5 pl-14 pr-4 text-slate-900 text-lg placeholder-slate-400 outline-none transition-all"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!websiteUrl}
              className={`w-full flex items-center justify-center gap-2 py-5 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl ${
                websiteUrl
                  ? 'bg-[#ad3642] hover:bg-[#8e2b35] text-white shadow-[#ad3642]/30 cursor-pointer active:scale-[0.98]' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-80'
              }`}
            >
              Analyze Website Content
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            No registration required • Industry Auto-Detection • Real-time Scan
          </p>
        </form>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="text-[#ad3642] mb-4 font-display font-bold text-lg">01. URL Discovery</div>
          <p className="text-sm text-slate-500 leading-relaxed">Agent 1 detects your industry and extracts messaging from high-impact conversion pages.</p>
        </div>
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="text-[#ad3642] mb-4 font-display font-bold text-lg">02. Context Engine</div>
          <p className="text-sm text-slate-500 leading-relaxed">Agent 2 mapping buyer personas and market complexity specific to your segment.</p>
        </div>
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="text-[#ad3642] mb-4 font-display font-bold text-lg">03. Scoring Engine</div>
          <p className="text-sm text-slate-500 leading-relaxed">Agent 3 performs a 5-dimension strategic audit to reveal hidden content gaps.</p>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
