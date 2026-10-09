import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  IndianRupee, 
  Check, 
  Bookmark, 
  Car, 
  Footprints, 
  Train, 
  Trash2,
  Navigation,
  Share2,
  Sparkles,
  Sun,
  ShieldCheck,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { GeneratedPlan } from '../../types';

interface MobileItineraryResultProps {
  plan: GeneratedPlan;
  onBack: () => void;
  onSavePlan: (plan: GeneratedPlan) => void;
  onRemoveStop?: (stopNumber: number) => void;
}

export const MobileItineraryResult: React.FC<MobileItineraryResultProps> = ({
  plan,
  onBack,
  onSavePlan,
  onRemoveStop
}) => {
  const [saved, setSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleSave = () => {
    onSavePlan(plan);
    setSaved(true);
  };

  const handleShare = () => {
    const itineraryText = `${plan.title}\nTotal Time: ${plan.totalDurationHours} hrs | Est Cost: ₹${plan.totalEstimatedCostINR}\n\n` +
      plan.stops.map(s => `${s.stopNumber}. ${s.arrivalTime} - ${s.place.name} (${s.place.area})`).join('\n');

    if (navigator.share) {
      navigator.share({
        title: plan.title,
        text: itineraryText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(itineraryText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Compute breakdown
  const entryTotal = plan.stops.reduce((sum, s) => sum + (s.place.entryFeeINR || 0), 0);
  const foodTransitEst = Math.max(0, plan.totalEstimatedCostINR - entryTotal);

  return (
    <div className="relative w-full h-full min-h-[720px] bg-[#F8FAFC] flex flex-col justify-between text-slate-800 pb-24">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">Your Pune Itinerary</h2>
            <p className="text-[10px] text-slate-400 font-medium">{plan.stops.length} optimized stops</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition"
            title="Share itinerary"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button 
            onClick={onBack}
            className="text-xs font-bold text-teal-700 hover:underline"
          >
            Edit
          </button>
        </div>
      </div>

      {copiedShare && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl">
          Itinerary copied to clipboard!
        </div>
      )}

      {/* Scrollable Content */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        
        {/* Header Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[9px] font-black uppercase tracking-wider border border-teal-200 inline-block">
              Curated Day Route
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 leading-tight truncate">{plan.title}</h3>
            
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-teal-700 font-bold">
                <Clock className="w-3 h-3" />
                <span>{plan.totalDurationHours} hrs</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-bold text-slate-900">
                <span>₹{plan.totalEstimatedCostINR} (est.)</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                <span>2 persons</span>
              </span>
            </div>
          </div>

          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
            <img
              src={plan.stops[0]?.place.imageUrl || "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=200&q=80"}
              alt="Itinerary icon"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Travel Tip & Weather Alert */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
          <Sun className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block text-amber-900">Pune Travel Tip for this Route:</span>
            <p className="text-[11px] text-amber-800 leading-snug">
              Start stop 1 by 9:30 AM to beat midday sun and tourist queues. Use Shivajinagar & Swargate metro connections for rapid traffic bypass.
            </p>
          </div>
        </div>

        {/* Budget Breakdown Pill */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-bold text-slate-700">
            <span>Estimated Budget Allocation</span>
            <span className="text-teal-800 font-black">₹{plan.totalEstimatedCostINR} total</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Entry Tickets</span>
              <span className="font-black text-slate-900">₹{entryTotal}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Snacks & Transit</span>
              <span className="font-black text-slate-900">₹{foodTransitEst}</span>
            </div>
          </div>
        </div>

        {/* Timeline Sequence */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Chronological Timeline
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Tap stop for options</span>
          </div>

          {plan.stops.map((stop, idx) => (
            <div key={stop.placeId} className="relative">
              
              {/* Stop Row */}
              <div className="flex items-start gap-3 bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm hover:border-teal-200 transition">
                
                {/* Time Indicator */}
                <div className="w-16 text-right flex-shrink-0 pt-0.5">
                  <span className="text-xs font-black text-slate-900 block leading-tight">{stop.arrivalTime}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{stop.durationMinutes}m stop</span>
                </div>

                {/* Vertical Node Icon */}
                <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-xs flex-shrink-0">
                  {idx + 1}
                </div>

                {/* Stop Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight truncate">{stop.place.name}</h4>
                    {onRemoveStop && plan.stops.length > 2 && (
                      <button
                        onClick={() => onRemoveStop(stop.stopNumber)}
                        className="p-1 text-slate-300 hover:text-red-500 rounded transition"
                        title="Remove stop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {stop.place.area} • {stop.place.categoryLabel}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-50 text-[11px]">
                    <span className="font-bold text-teal-700">
                      {stop.estimatedCostINR === 0 ? 'Free entry' : `₹${stop.estimatedCostINR} (est.)`}
                    </span>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.place.name + ' Pune')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-teal-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100"
                    >
                      <Navigation className="w-3 h-3 text-teal-700" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Transit Leg connector between stops */}
              {stop.transitToNext && (
                <div className="my-1.5 ml-24 pl-5 py-1 text-[11px] text-slate-500 font-medium flex items-center gap-2 border-l-2 border-dashed border-teal-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span>
                  <span>Travel • {stop.transitToNext.durationMins} min ({stop.transitToNext.distanceKm} km via {stop.transitToNext.mode || 'Metro/Auto'})</span>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

      {/* Bottom Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 px-5 py-3 flex items-center justify-between max-w-[440px] mx-auto shadow-xl">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Estimated Spend</span>
          <span className="text-base font-black text-slate-900">₹{plan.totalEstimatedCostINR}</span>
        </div>

        <button
          onClick={handleSave}
          className={`px-6 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 transition ${
            saved 
              ? 'bg-emerald-600 text-white' 
              : 'bg-teal-700 hover:bg-teal-800 text-white shadow-md shadow-teal-900/15'
          }`}
        >
          {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          <span>{saved ? 'Saved to Trips' : 'Save Plan'}</span>
        </button>
      </div>

    </div>
  );
};
