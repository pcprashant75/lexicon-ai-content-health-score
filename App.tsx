
import React, { useState } from 'react';
import { AppState, UserInputs, AnalysisResult } from './types';
import { analyzeWebsite } from './geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ProcessingView from './components/ProcessingView';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [inputs, setInputs] = useState<UserInputs | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<{ message: string; details?: string; type?: 'AUTH' | 'QUOTA' | 'GENERAL' } | null>(null);

  const handleStartAnalysis = async (userInput: UserInputs) => {
    setInputs(userInput);
    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const result = await analyzeWebsite(userInput);
      setResults(result);
      setAppState(AppState.RESULTS);
    } catch (err: any) {
      console.error(err);
      
      const errorMessage = err.message || "";
      const isAuthError = 
        errorMessage.includes("API_KEY") || 
        errorMessage.includes("AUTH_ERROR") || 
        errorMessage.includes("403") ||
        errorMessage.includes("401");
      
      const isQuotaError = 
        errorMessage.includes("429") || 
        errorMessage.includes("QUOTA") || 
        errorMessage.includes("RESOURCE_EXHAUSTED");

      let userMessage = "We encountered an issue analyzing this specific URL.";
      let errorType: 'AUTH' | 'QUOTA' | 'GENERAL' = 'GENERAL';

      if (isAuthError) {
        userMessage = "Intelligence engine configuration error.";
        errorType = 'AUTH';
      } else if (isQuotaError) {
        userMessage = "The AI engine is currently experiencing high demand.";
        errorType = 'QUOTA';
      }

      setError({
        message: userMessage,
        details: errorMessage,
        type: errorType
      });
      
      setAppState(AppState.INPUT);
    }
  };

  const handleReset = () => {
    setAppState(AppState.INPUT);
    setResults(null);
    setInputs(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-500">
      <Header onLogoClick={handleReset} />
      
      <main className="flex-1 flex flex-col container mx-auto px-4 py-8 md:py-12">
        {error && (
          <div className="mb-8 p-6 bg-white border-l-4 border-[#ad3642] rounded-r-2xl shadow-xl shadow-[#ad3642]/5 flex flex-col items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-[#ad3642] flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-lg">
                  {error.type === 'QUOTA' ? 'System Capacity Reached' : 'Analysis Interrupted'}
                </p>
                <p className="text-slate-500 font-medium text-sm">
                  {error.type === 'QUOTA' 
                    ? "Please wait about 30 seconds and try again. The free-tier AI is processing many requests." 
                    : error.message}
                </p>
                {error.details && (
                  <p className="mt-2 text-[10px] font-mono text-red-400 bg-red-50 p-2 rounded border border-red-100 break-all">
                    System Message: {error.details}
                  </p>
                )}
              </div>
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-all whitespace-nowrap"
              >
                {error.type === 'QUOTA' ? 'Retry Now' : 'Try Again'}
              </button>
            </div>
          </div>
        )}

        {appState === AppState.INPUT && (
          <InputForm onSubmit={handleStartAnalysis} />
        )}

        {appState === AppState.PROCESSING && (
          <ProcessingView />
        )}

        {appState === AppState.RESULTS && results && inputs && (
          <Dashboard results={results} inputs={inputs} onReset={handleReset} />
        )}
      </main>

      <footer className="py-8 text-center text-slate-400 text-xs border-t border-slate-200 bg-white">
        <p className="max-w-2xl mx-auto px-4">
          &copy; {new Date().getFullYear()} LexiConn Intelligence System. 
          Powered by Gemini AI.
        </p>
      </footer>
    </div>
  );
};

export default App;
