
import React, { useRef, useState } from 'react';
import { AnalysisResult, UserInputs } from '../types';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  RefreshCw, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  Loader2, 
  Lock, 
  Mail, 
  ChevronRight, 
  Globe, 
  ArrowRight, 
  Lightbulb 
} from 'lucide-react';
import ScoreCard from './ScoreCard';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface DashboardProps {
  results: AnalysisResult;
  inputs: UserInputs;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ results, inputs, onReset }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [email, setEmail] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const chartData = [
    { subject: 'Hygiene', A: results.categories.hygiene.score, fullMark: 100 },
    { subject: 'Relevance', A: results.categories.relevance.score, fullMark: 100 },
    { subject: 'Sales Tool', A: results.categories.salesTool.score, fullMark: 100 },
    { subject: 'Differentiation', A: results.categories.differentiation.score, fullMark: 100 },
    { subject: 'Strategy', A: results.categories.advancedStrategy.score, fullMark: 100 },
  ];

  const getMaturityColor = (level: string) => {
    switch (level) {
      case 'Market leader': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'Strategic': return 'text-[#ad3642] bg-[#ad3642]/5 border-[#ad3642]/10';
      case 'Growth-stage': return 'text-amber-700 bg-amber-50 border-amber-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsLocked(false);
      console.log(`Lead Captured: ${email} for ${inputs.websiteUrl}`);
    }
  };

  const handleBookMeeting = () => {
    window.open('https://www.lexiconn.in/Book-a-Meeting.html', '_blank');
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current || isLocked) return;
    setIsGeneratingPdf(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`LexiConn_Audit_${inputs.websiteUrl.replace(/^https?:\/\//, '').split('/')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      
      {!isLocked && (
        <div id="pdf-template" ref={reportRef} className="font-sans">
          <div className="flex justify-between items-center mb-8 border-b-2 border-[#ad3642] pb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">LexiConn Content Intelligence</h1>
              <p className="text-slate-500 font-medium">Autonomous AI Content Audit</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#ad3642]">CONFIDENTIAL REPORT</p>
              <p className="text-xs text-slate-400">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Website: {inputs.websiteUrl}</h2>
            <h3 className="text-lg font-semibold text-slate-600 mb-4">Detected Industry: {results.industry}</h3>
            <div className="bg-[#ad3642] text-white p-6 rounded-xl flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">Overall Content Health Score</p>
                <p className="text-5xl font-bold">{Math.round(results.overallScore)}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">Maturity Level</p>
                <p className="text-2xl font-bold">{results.maturityLevel}</p>
              </div>
            </div>
          </div>
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-[#ad3642] pl-3">Executive Summary</h3>
            <p className="text-slate-700 leading-relaxed text-sm">{results.executiveSummary}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${getMaturityColor(results.maturityLevel)}`}>
                {results.maturityLevel} Level
              </span>
              <span className="px-4 py-1.5 rounded-full border border-slate-100 bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Detected Industry: {results.industry}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              AI Content Intelligence: <br/>
              <span className="text-[#ad3642] font-medium underline decoration-[#ad3642]/10 underline-offset-8 decoration-4">{inputs.websiteUrl.replace(/^https?:\/\//, '')}</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              We've identified your industry and analyzed your content architecture. Your overall score is calculated against sector benchmarks.
            </p>
          </div>
        </div>

        <div className="bg-[#ad3642] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-[#ad3642]/30 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Initial Audit Result</div>
            <div className="text-9xl font-display font-bold text-white mb-4 leading-none tracking-tighter">
              {Math.round(results.overallScore)}<span className="text-3xl text-white/40">%</span>
            </div>
            <p className="text-white/80 text-sm font-medium px-4 mb-1">
              {results.maturityLevel} Content Status
            </p>
          </div>
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-x-0 bottom-0 top-[350px] z-20 flex flex-col items-center justify-start pt-32 px-4 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-xl"></div>
          <div className="relative z-30 max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-900/20 text-center animate-in zoom-in slide-in-from-bottom-12 duration-500">
            <div className="w-16 h-16 bg-[#ad3642] rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-[#ad3642]/20">
              <Lock size={28} />
            </div>
            <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">Unlock Full Comprehensive Report</h3>
            <p className="text-slate-500 mb-10 leading-relaxed">
              We have generated a 5-dimension strategic audit, identified 3 critical gaps, and built a content roadmap. Share your work email to reveal the full intelligence report.
            </p>
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#ad3642] focus:ring-4 focus:ring-[#ad3642]/5 rounded-xl py-4 pl-12 pr-4 text-slate-900 font-medium outline-none transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#ad3642] text-white rounded-xl font-bold text-lg hover:bg-[#8e2b35] transition-all shadow-xl shadow-[#ad3642]/20"
              >
                Reveal Full Intelligence
                <ChevronRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      <div className={`space-y-8 transition-all duration-700 ${isLocked ? 'blur-md opacity-40 select-none pointer-events-none' : 'blur-0 opacity-100'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-xl bg-[#ad3642]/5 text-[#ad3642] flex-shrink-0"><UserCheck size={24} /></div>
            <div>
              <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Target Personas</h5>
              <p className="text-sm text-slate-800 font-bold">{results.industryContext.buyerPersonas}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-xl bg-[#ad3642]/5 text-[#ad3642] flex-shrink-0"><ShieldCheck size={24} /></div>
            <div>
              <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Decision Makers</h5>
              <p className="text-sm text-slate-800 font-bold">{results.industryContext.decisionMakers}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-xl bg-[#ad3642]/5 text-[#ad3642] flex-shrink-0"><Clock size={24} /></div>
            <div>
              <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Sales Cycle</h5>
              <p className="text-sm text-slate-800 font-bold">{results.industryContext.salesCycle}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
              <TrendingUp className="text-[#ad3642]" size={20} /> Strategic Maturity Radar
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                  <Radar name="Website" dataKey="A" stroke="#ad3642" strokeWidth={3} fill="#ad3642" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-6 flex items-center gap-3">
              <TrendingUp className="text-[#ad3642]" size={20} /> Executive Summary
            </h3>
            <div className="flex-1 overflow-y-auto pr-4">
              <p className="text-slate-600 leading-relaxed text-lg italic">"{results.executiveSummary}"</p>
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={handleDownloadPdf} className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                {isGeneratingPdf ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} Download PDF
              </button>
              <button onClick={onReset} className="px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        {results.groundingSources && results.groundingSources.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe size={20} className="text-[#ad3642]" /> AI Search Grounding Sources
            </h3>
            <div className="flex flex-wrap gap-3">
              {results.groundingSources.map((source, i) => (
                <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-[#ad3642] hover:text-[#ad3642] transition-colors flex items-center gap-2">
                  <ArrowRight size={12} /> {source.title || source.uri}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ScoreCard data={results.categories.hygiene} index={0} />
          <ScoreCard data={results.categories.relevance} index={1} />
          <ScoreCard data={results.categories.salesTool} index={2} />
          <ScoreCard data={results.categories.differentiation} index={3} />
          <ScoreCard data={results.categories.advancedStrategy} index={4} />
          
          <div className="bg-slate-900 rounded-2xl p-8 flex flex-col justify-between group cursor-pointer relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/5 rounded-full flex items-center justify-center"><Lightbulb className="text-white opacity-20" size={64} /></div>
            <div className="relative z-10">
              <h4 className="text-2xl font-display font-bold text-white mb-4">Ready to fix these gaps?</h4>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">Our experts can help you turn these content gaps into revenue opportunities.</p>
            </div>
            <button onClick={handleBookMeeting} className="relative z-10 w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-[#ad3642] hover:text-white transition-all">
              Book Strategy Call
            </button>
          </div>
        </div>

        {/* Priority Actions Roadmap */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-lg">
          <h3 className="text-3xl font-display font-bold text-slate-900 mb-8">Priority Action Roadmap</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {results.priorityActions.map((action, i) => (
              <div key={i} className="relative p-8 bg-slate-50 border border-slate-100 rounded-3xl">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#ad3642] font-display font-bold text-xl shadow-md mb-6 border border-slate-100">{i + 1}</div>
                <p className="text-slate-800 font-bold leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
