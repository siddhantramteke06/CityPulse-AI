import React, { useState } from 'react';
import { Place, PlannerInput, GeneratedPlan, PlaceCategory, GroupSize, Pace } from '../types';
import { PUNE_PLACES, PUNE_STARTING_HUBS } from '../data/puneData';
import { generateSmartItinerary, PRESET_SCENARIOS } from '../utils/plannerEngine';
import { savePlanToStorage } from '../utils/storage';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Users, 
  Compass, 
  ArrowRight, 
  Trash2, 
  Save, 
  RefreshCw, 
  Check, 
  Train, 
  Footprints, 
  Car, 
  AlertCircle, 
  Share2, 
  Layers, 
  ChevronRight,
  Info
} from 'lucide-react';

interface AiPlannerViewProps {
  initialInput?: PlannerInput | null;
  onSelectPlace: (place: Place) => void;
  onPlanSavedNotice?: () => void;
}

export const AiPlannerView: React.FC<AiPlannerViewProps> = ({
  initialInput,
  onSelectPlace,
  onPlanSavedNotice
}) => {
  const [startingLocation, setStartingLocation] = useState<string>(
    initialInput?.startingLocation || 'deccan'
  );
  const [budgetINR, setBudgetINR] = useState<number>(initialInput?.budgetINR || 650);
  const [durationHours, setDurationHours] = useState<number>(initialInput?.durationHours || 4);
  const [interests, setInterests] = useState<PlaceCategory[]>(
    initialInput?.interests || ['heritage', 'food']
  );
  const [groupSize, setGroupSize] = useState<GroupSize>(initialInput?.groupSize || 'solo');
  const [pace, setPace] = useState<Pace>(initialInput?.pace || 'balanced');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(() => {
    // Generate initial plan on load
    return generateSmartItinerary({
      startingLocation: initialInput?.startingLocation || 'deccan',
      budgetINR: initialInput?.budgetINR || 650,
      durationHours: initialInput?.durationHours || 4,
      interests: initialInput?.interests || ['heritage', 'food'],
      groupSize: initialInput?.groupSize || 'solo',
      pace: initialInput?.pace || 'balanced'
    });
  });

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const interestOptions: { id: PlaceCategory; label: string; icon: string }[] = [
    { id: 'heritage', label: 'History & Peshwas', icon: '🏛️' },
    { id: 'food', label: 'Street Food & Cafes', icon: '🍛' },
    { id: 'nature_fort', label: 'Forts & Hill Treks', icon: '⛰️' },
    { id: 'shopping', label: 'Peth Bazaars & Brass', icon: '🛍️' },
    { id: 'temple', label: 'Temples & Sacred', icon: '🪔' },
    { id: 'modern_culture', label: 'Modern Cafes & KP', icon: '☕' }
  ];

  const handleToggleInterest = (cat: PlaceCategory) => {
    if (interests.includes(cat)) {
      if (interests.length > 1) {
        setInterests(interests.filter(c => c !== cat));
      }
    } else {
      setInterests([...interests, cat]);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setIsSaved(false);

    setTimeout(() => {
      const plan = generateSmartItinerary({
        startingLocation,
        budgetINR,
        durationHours,
        interests,
        groupSize,
        pace
      });
      setCurrentPlan(plan);
      setIsGenerating(false);
    }, 400);
  };

  const handleLoadPreset = (presetInput: PlannerInput) => {
    setStartingLocation(presetInput.startingLocation);
    setBudgetINR(presetInput.budgetINR);
    setDurationHours(presetInput.durationHours);
    setInterests(presetInput.interests);
    setGroupSize(presetInput.groupSize);
    setPace(presetInput.pace);

    setIsGenerating(true);
    setIsSaved(false);

    setTimeout(() => {
      const plan = generateSmartItinerary(presetInput);
      setCurrentPlan(plan);
      setIsGenerating(false);
    }, 300);
  };

  const handleRemoveStop = (stopNumber: number) => {
    if (!currentPlan) return;
    const remainingStops = currentPlan.stops.filter(s => s.stopNumber !== stopNumber);
    if (remainingStops.length === 0) return;

    // Recalculate costs
    let newTotal = 0;
    const resequenced = remainingStops.map((s, idx) => {
      newTotal += s.estimatedCostINR;
      if (s.transitToNext) newTotal += s.transitToNext.estimatedCostINR;
      return { ...s, stopNumber: idx + 1 };
    });

    setCurrentPlan({
      ...currentPlan,
      stops: resequenced,
      totalEstimatedCostINR: newTotal,
      budgetRemainingINR: Math.max(0, currentPlan.budgetINR - newTotal)
    });
    setIsSaved(false);
  };

  const handleSavePlan = () => {
    if (!currentPlan) return;
    savePlanToStorage(currentPlan);
    setIsSaved(true);
    if (onPlanSavedNotice) onPlanSavedNotice();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Signature Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 border border-teal-500/30 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI City Planner • Signature Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Personalized Pune Itinerary Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Optimized for real transit distances, indicative budget allocation, opening timings, and authentic local experiences.
          </p>
        </div>

        {/* Preset scenario triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_SCENARIOS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset.input)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-teal-700/40 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 hover:border-teal-500/50 transition flex items-center gap-1.5"
            >
              <span>{preset.label}</span>
              <span className="text-[10px] text-teal-400">₹{preset.input.budgetINR}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Controls (Left) & Itinerary Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Trip Preferences</span>
            </h2>
            <span className="text-xs text-slate-400">Step 1 of 2</span>
          </div>

          {/* Starting Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Starting Hub in Pune</span>
            </label>
            <select
              value={startingLocation}
              onChange={e => setStartingLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-slate-100 rounded-xl text-xs sm:text-sm focus:border-teal-400 focus:outline-none"
            >
              {PUNE_STARTING_HUBS.map(hub => (
                <option key={hub.id} value={hub.id}>{hub.label}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">Starting point affects distance chaining and travel legs.</p>
          </div>

          {/* Budget INR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total Budget</span>
              </label>
              <span className="font-extrabold text-emerald-400 text-sm">₹{budgetINR}</span>
            </div>

            <input
              type="range"
              min={200}
              max={3000}
              step={50}
              value={budgetINR}
              onChange={e => setBudgetINR(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />

            <div className="flex items-center justify-between gap-1 text-[11px]">
              {[300, 500, 800, 1500, 2500].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBudgetINR(val)}
                  className={`px-2 py-0.5 rounded border ${
                    budgetINR === val 
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/50' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Duration in Hours */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Available Time</span>
              </label>
              <span className="font-bold text-teal-300">{durationHours} Hours</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              {[2, 4, 6, 8].map(hrs => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDurationHours(hrs)}
                  className={`py-2 rounded-xl font-bold transition ${
                    durationHours === hrs
                      ? 'bg-teal-600 text-white shadow'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>

          {/* Interests Checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Interests & Vibes (Select 1 or more)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {interestOptions.map(opt => {
                const isSelected = interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleInterest(opt.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500/50 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Size & Pace */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>Group Size</span>
              </label>
              <select
                value={groupSize}
                onChange={e => setGroupSize(e.target.value as GroupSize)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-xl focus:border-teal-400 focus:outline-none"
              >
                <option value="solo">Solo Explorer (1)</option>
                <option value="couple">Pair / Duo (2)</option>
                <option value="friends">Friends Squad (3-4)</option>
                <option value="family">Family Group (4+)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Exploration Pace</span>
              </label>
              <select
                value={pace}
                onChange={e => setPace(e.target.value as Pace)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-xl focus:border-teal-400 focus:outline-none"
              >
                <option value="relaxed">Relaxed (Longer breaks)</option>
                <option value="balanced">Balanced (Recommended)</option>
                <option value="fast_paced">Fast-paced (Cover max)</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Synthesizing Optimal Route...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Generate Intelligent Itinerary</span>
              </>
            )}
          </button>

        </div>

        {/* Itinerary Timeline Column */}
        <div className="lg:col-span-7 space-y-5">
          {currentPlan ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
              
              {/* Plan Header & Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                      Generated Itinerary
                    </span>
                    <span className="text-xs text-slate-400">{currentPlan.generatedAt}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">{currentPlan.title}</h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Starting from {currentPlan.startingLocation} • {currentPlan.stops.length} curated stops
                  </p>
                </div>

                {/* Save and Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={handleSavePlan}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      isSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{isSaved ? 'Saved to Trips' : 'Save Itinerary'}</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700"
                    title="Regenerate alternatives"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Budget Progress Bar & Breakdown */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-300">
                    <span>Estimated Total:</span>
                    <strong className="text-emerald-400 text-sm font-black">₹{currentPlan.totalEstimatedCostINR}</strong>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span>Budget Cushion:</span>
                    <strong className="text-slate-200">₹{currentPlan.budgetRemainingINR}</strong>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((currentPlan.totalEstimatedCostINR / currentPlan.budgetINR) * 100))}%`
                    }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Target: ₹{currentPlan.budgetINR}</span>
                  <span>{Math.round((currentPlan.totalEstimatedCostINR / currentPlan.budgetINR) * 100)}% budget utilized</span>
                </div>
              </div>

              {/* Stops Timeline */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Sequenced Timeline & Activity Stops
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                  {currentPlan.stops.map((stop, idx) => (
                    <div key={stop.placeId} className="relative group">
                      
                      {/* Timeline Node Dot */}
                      <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-teal-400 flex items-center justify-center text-[10px] font-bold text-teal-300 shadow">
                        {stop.stopNumber}
                      </div>

                      {/* Stop Card */}
                      <div className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <img
                              src={stop.place.imageUrl}
                              alt={stop.place.name}
                              className="w-14 h-14 rounded-xl object-cover flex-shrink-0 cursor-pointer"
                              onClick={() => onSelectPlace(stop.place)}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-teal-400">
                                  {stop.arrivalTime} – {stop.departureTime}
                                </span>
                                <span className="text-[10px] text-slate-400">({stop.durationMinutes} mins)</span>
                              </div>
                              <h4 
                                onClick={() => onSelectPlace(stop.place)}
                                className="font-bold text-base text-white hover:text-teal-300 cursor-pointer transition"
                              >
                                {stop.place.name}
                              </h4>
                              <p className="text-xs text-slate-400">{stop.place.area} • {stop.place.categoryLabel}</p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs font-bold text-emerald-400">
                              ~₹{stop.estimatedCostINR}
                            </span>
                            {currentPlan.stops.length > 2 && (
                              <button
                                onClick={() => handleRemoveStop(stop.stopNumber)}
                                className="p-1 text-slate-400 hover:text-red-400 rounded transition"
                                title="Remove stop from plan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                          {stop.recommendedActivity}
                        </p>
                      </div>

                      {/* Transit Leg to Next Stop */}
                      {stop.transitToNext && (
                        <div className="my-2 p-2.5 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {stop.transitToNext.mode === 'Pune Metro' ? (
                              <Train className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                            ) : stop.transitToNext.mode === 'Walking' ? (
                              <Footprints className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                            ) : (
                              <Car className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                            )}
                            <span className="text-slate-300 font-medium">
                              {stop.transitToNext.mode} (~{stop.transitToNext.durationMins} mins, {stop.transitToNext.distanceKm} km)
                            </span>
                          </div>
                          <span className="text-emerald-400 font-semibold">
                            {stop.transitToNext.estimatedCostINR === 0 ? 'Free' : `~₹${stop.transitToNext.estimatedCostINR}`}
                          </span>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>

              {/* Local Smart Tips & Transparency Box */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                  <Info className="w-4 h-4" />
                  <span>Pune Local Intelligence Notes</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentPlan.localSmartTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-teal-400">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclosure note */}
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 border-t border-slate-800 pt-3">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>
                  Indicative costs based on conservative entry tickets & average meal allowances. Never fabricated as real-time congestion data.
                </span>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <Sparkles className="w-12 h-12 text-teal-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">Ready to plan your day?</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select your starting hub, budget, and vibes, then hit "Generate Intelligent Itinerary" to compute your schedule.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
