
import React from 'react';
import { Activity } from 'lucide-react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" 
          onClick={onLogoClick}
        >
          <div className="w-10 h-10 bg-[#ad3642] rounded-lg flex items-center justify-center shadow-lg shadow-[#ad3642]/20">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-slate-900">LexiConn</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#ad3642] font-semibold">Intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <div className="px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AI AUDIT ENGINE ACTIVE
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
