import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  IndianRupee, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowLeftRight,
  Clock,
  MapPin,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import { Place } from '../../types';

interface MobileCompareProps {
  places: Place[];
  onBack: () => void;
}

export const MobileCompare: React.FC<MobileCompareProps> = ({ places, onBack }) => {
  const [placeAId, setPlaceAId] = useState<string>(places[0]?.id || 'shaniwar-wada');
  const [placeBId, setPlaceBId] = useState<string>(places[1]?.id || 'aga-khan-palace');

  const placeA = places.find(p => p.id === placeAId) || places[0];
  const placeB = places.find(p => p.id === placeBId) || places[1];

  const handleSwap = () => {
    setPlaceAId(placeBId);
    setPlaceBId(placeAId);
  };

  const quickPresets = [
    { label: 'Forts & Heritage', idA: 'shaniwar-wada', idB: 'aga-khan-palace' },
    { label: 'Food & Cafes', idA: 'fc-road', idB: 'koregaon-park' },
    { label: 'Hills & Treks', idA: 'sinhagad-fort', idB: 'vetal-tekdi' },
    { label: 'Spiritual Peace', idA: 'dagdusheth-ganpati', idB: 'saras-baug' }
  ];

  return (
    <div className="w-full h-full min-h-[720px] bg-[#F8FAFC] pb-24 text-slate-800">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">Compare Places</h2>
            <p className="text-[10px] text-slate-400 font-medium">Head-to-head travel benchmark</p>
          </div>
        </div>

        <button
          onClick={handleSwap}
          className="p-1.5 px-2.5 rounded-xl border border-slate-200 text-teal-800 bg-teal-50/70 hover:bg-teal-100 flex items-center gap-1 text-[11px] font-black active:scale-95 transition"
          title="Swap places"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Swap</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Quick Comparison Presets Strip */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Popular Matchups
          </span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {quickPresets.map(preset => (
              <button
                key={preset.label}
                onClick={() => {
                  setPlaceAId(preset.idA);
                  setPlaceBId(preset.idB);
                }}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:border-teal-400 text-slate-700 text-[11px] font-bold rounded-xl whitespace-nowrap shadow-sm active:scale-95 transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown Selectors */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Place 1</label>
            <select
              value={placeAId}
              onChange={e => setPlaceAId(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-teal-700 shadow-sm"
            >
              {places.map(p => (
                <option key={p.id} value={p.id} disabled={p.id === placeBId}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Place 2</label>
            <select
              value={placeBId}
              onChange={e => setPlaceBId(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-teal-700 shadow-sm"
            >
              {places.map(p => (
                <option key={p.id} value={p.id} disabled={p.id === placeAId}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top Dual Cards */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Card A */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2">
            <div className="h-24 rounded-xl overflow-hidden relative">
              <img src={placeA.imageUrl} alt={placeA.name} className="w-full h-full object-cover" />
              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-slate-950/70 text-white text-[9px] font-bold">
                {placeA.area}
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{placeA.name}</h3>
              <p className="text-[10px] text-teal-700 font-bold mt-0.5">{placeA.categoryLabel}</p>
            </div>
          </div>

          {/* Card B */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2">
            <div className="h-24 rounded-xl overflow-hidden relative">
              <img src={placeB.imageUrl} alt={placeB.name} className="w-full h-full object-cover" />
              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-slate-950/70 text-white text-[9px] font-bold">
                {placeB.area}
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{placeB.name}</h3>
              <p className="text-[10px] text-teal-700 font-bold mt-0.5">{placeB.categoryLabel}</p>
            </div>
          </div>

        </div>

        {/* Head-to-Head Metrics Table Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3 divide-y divide-slate-100 text-xs">
          
          {/* Indicative Cost Row */}
          <div className="pt-2 first:pt-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
              Indicative Cost Per Person
            </span>
            <div className="grid grid-cols-2 gap-3 font-black text-sm">
              <span className="text-teal-700">
                {placeA.indicativeCostPerPerson === 0 ? 'Free' : `₹${placeA.indicativeCostPerPerson}`}
              </span>
              <span className="text-teal-700">
                {placeB.indicativeCostPerPerson === 0 ? 'Free' : `₹${placeB.indicativeCostPerPerson}`}
              </span>
            </div>
          </div>

          {/* Rating & Verified Reviews */}
          <div className="pt-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
              Visitor Rating
            </span>
            <div className="grid grid-cols-2 gap-3 font-bold text-slate-900">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{placeA.rating.toFixed(1)} <span className="text-slate-400 text-[10px] font-normal">({(placeA.reviewCount / 1000).toFixed(1)}k)</span></span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{placeB.rating.toFixed(1)} <span className="text-slate-400 text-[10px] font-normal">({(placeB.reviewCount / 1000).toFixed(1)}k)</span></span>
              </div>
            </div>
          </div>

          {/* Time Commitment */}
          <div className="pt-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
              Time Commitment
            </span>
            <div className="grid grid-cols-2 gap-3 font-bold text-slate-800">
              <span>{placeA.avgDurationMinutes} mins recommended</span>
              <span>{placeB.avgDurationMinutes} mins recommended</span>
            </div>
          </div>

          {/* Best Time of Day */}
          <div className="pt-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
              Optimal Time to Visit
            </span>
            <div className="grid grid-cols-2 gap-3 text-slate-700 text-[11px] leading-tight font-medium">
              <span>{placeA.bestTimeToVisit}</span>
              <span>{placeB.bestTimeToVisit}</span>
            </div>
          </div>

          {/* Metro Accessibility */}
          <div className="pt-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
              Metro & Transit Access
            </span>
            <div className="grid grid-cols-2 gap-3 text-slate-700 text-[11px]">
              <span>{placeA.transitAccess?.metroStation || 'Bus / Auto'}</span>
              <span>{placeB.transitAccess?.metroStation || 'Bus / Auto'}</span>
            </div>
          </div>

        </div>

        {/* AI Comparison Verdict Card */}
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-4 shadow-md space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-300" />
            <h4 className="font-extrabold text-xs tracking-wider uppercase text-teal-200">
              AI Travel Verdict
            </h4>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {placeA.avgDurationMinutes < placeB.avgDurationMinutes 
              ? `Choose ${placeA.name} if you have limited time and want a quick ${placeA.avgDurationMinutes}-minute experience. Choose ${placeB.name} if you prefer a deeper, comprehensive visit.`
              : `Choose ${placeA.name} for an immersive ${placeA.avgDurationMinutes}-minute landmark tour, or ${placeB.name} for a faster budget stop.`}
          </p>
        </div>

      </div>

    </div>
  );
};
