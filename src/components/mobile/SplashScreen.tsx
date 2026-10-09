import React from 'react';
import { Activity, Sparkles, Shield, Compass, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full h-full min-h-[780px] bg-gradient-to-b from-slate-950 via-[#0B1528] to-slate-950 flex flex-col justify-between p-6 text-white overflow-hidden select-none">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Logo & Tagline */}
      <div className="pt-8 flex flex-col items-center text-center z-10 space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-2xl shadow-teal-500/20">
          <Activity className="w-9 h-9 stroke-[2.5]" />
        </div>
        
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>CityPulse</span>
            <span className="text-teal-400">AI</span>
          </h1>
          <p className="text-xs text-slate-300 font-medium tracking-wide mt-1">
            Explore smarter. Move safer.<br />Experience more.
          </p>
        </div>
      </div>

      {/* Center Hero Artwork with Features */}
      <div className="my-auto py-3 flex flex-col items-center z-10 space-y-4">
        <div className="relative w-full max-w-[280px] h-52 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 group">
          <img
            src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
            alt="Shaniwar Wada Heritage Fort"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-center">
            <span className="text-[10px] font-black text-teal-300 uppercase tracking-widest bg-slate-950/80 px-3 py-1 rounded-full border border-teal-500/40 shadow-sm inline-block">
              Pune Urban Companion
            </span>
          </div>
        </div>

        {/* Feature Value Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xs">
          <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-bold text-teal-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Trip Planner
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Safety Map & SOS
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-bold text-amber-300 flex items-center gap-1">
            <Compass className="w-3 h-3" /> Live Weather & Metro
          </span>
        </div>
      </div>

      {/* Bottom CTA Buttons */}
      <div className="pb-6 space-y-2.5 z-10 w-full">
        <button
          onClick={onGetStarted}
          className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-teal-500/25 transition flex items-center justify-center gap-2"
        >
          <span>Explore Pune Now</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={onGetStarted}
          className="w-full py-3 bg-slate-900/80 hover:bg-slate-800 active:scale-[0.98] border border-slate-700/80 text-slate-300 font-bold text-xs rounded-2xl transition"
        >
          Continue as Guest
        </button>
      </div>

    </div>
  );
};
