import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  IndianRupee, 
  Users, 
  Compass, 
  ChevronRight,
  Zap,
  Footprints,
  Car,
  Train,
  CheckCircle2
} from 'lucide-react';
import { PlannerInput, GeneratedPlan } from '../../types';
import { generateSmartItinerary, PRESET_SCENARIOS } from '../../utils/plannerEngine';

interface MobileAiPlannerProps {
  onBack: () => void;
  onPlanGenerated: (plan: GeneratedPlan) => void;
}

export const MobileAiPlanner: React.FC<MobileAiPlannerProps> = ({
  onBack,
  onPlanGenerated
}) => {
  const [startLoc, setStartLoc] = useState('swargate');
  const [budget, setBudget] = useState(500);
  const [duration, setDuration] = useState(4);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['heritage', 'food']);
  const [groupSize, setGroupSize] = useState<'solo' | 'couple' | 'friends'>('couple');
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'fast_paced'>('balanced');
  const [transportMode, setTransportMode] = useState<'metro_walk' | 'auto_cab'>('metro_walk');
  const [isGenerating, setIsGenerating] = useState(false);

  const interestsList = [
    { id: 'heritage', label: 'History & Forts', icon: '🏰' },
    { id: 'food', label: 'Street Food & Cafes', icon: '🍲' },
    { id: 'nature_fort', label: 'Nature & Hills', icon: '🌲' },
    { id: 'shopping', label: 'Bazaars & Shopping', icon: '🛍️' },
    { id: 'temple', label: 'Temples & Spiritual', icon: '🛕' }
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const plan = generateSmartItinerary({
        startingLocation: startLoc,
        budgetINR: budget,
        durationHours: duration,
        interests: selectedInterests as any,
        groupSize: groupSize === 'solo' ? 'solo' : groupSize === 'couple' ? 'couple' : 'friends',
        pace: pace
      });
      setIsGenerating(false);
      onPlanGenerated(plan);
    }, 400);
  };

  const handlePresetClick = (presetInput: PlannerInput) => {
    setIsGenerating(true);
    setTimeout(() => {
      const plan = generateSmartItinerary(presetInput);
      setIsGenerating(false);
      onPlanGenerated(plan);
    }, 300);
  };

  return (
    <div className="w-full h-full min-h-[720px] bg-[#F8FAFC] pb-28 text-slate-800">
      
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
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">AI Trip Planner</h2>
            <p className="text-[10px] text-slate-400 font-medium">Smart route & budget optimizer</p>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Banner with Background Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg text-white p-5 min-h-[110px] flex flex-col justify-end">
          <img
            src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80"
            alt="Trip banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-teal-950/60" />
          
          <div className="relative z-10 space-y-1">
            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[9px] font-black uppercase tracking-wider inline-block">
              AI Personalized
            </span>
            <h3 className="font-extrabold text-lg leading-tight">Plan your perfect<br />Pune exploration</h3>
            <p className="text-[11px] text-slate-300 leading-snug">
              Set your budget, transit mode, and interests to generate a sequenced day itinerary.
            </p>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
          
          {/* Starting Location */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Starting Location / Transit Hub</span>
              <span className="text-teal-700 font-bold">Pune City</span>
            </label>
            <select
              value={startLoc}
              onChange={e => setStartLoc(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl focus:border-teal-700 focus:bg-white focus:outline-none transition"
            >
              <option value="swargate">Swargate Metro Hub (Central)</option>
              <option value="deccan">Deccan Gymkhana / FC Road</option>
              <option value="shivajinagar">Shivajinagar Metro & Rail Hub</option>
              <option value="pune_station">Pune Railway Station</option>
              <option value="kothrud">Kothrud / Nal Stop Area</option>
              <option value="viman_nagar">Viman Nagar / Airport Road</option>
            </select>
          </div>

          {/* Budget & Duration Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                Max Budget (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={100}
                  max={10000}
                  step={50}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full pl-3 pr-2 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-black rounded-xl focus:border-teal-700 focus:bg-white focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-teal-700 font-bold block">
                {budget <= 300 ? '🎒 Student Saver' : budget <= 800 ? '⚡ Balanced Day' : '💎 Premium'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                Available Time
              </label>
              <select
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl focus:border-teal-700 focus:bg-white focus:outline-none"
              >
                <option value={2}>2 Hours (Quick Sprint)</option>
                <option value={4}>4 Hours (Half Day)</option>
                <option value={6}>6 Hours (Standard)</option>
                <option value={8}>8 Hours (Full Day)</option>
              </select>
              <span className="text-[10px] text-slate-400 font-medium block">
                {duration <= 3 ? '2–3 stops' : duration <= 6 ? '3–4 stops' : '5+ stops'}
              </span>
            </div>
          </div>

          {/* Travel Pace & Preferred Transit */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-50">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Pace</label>
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setPace('relaxed')}
                  className={`flex-1 py-1 rounded-lg transition ${pace === 'relaxed' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500'}`}
                >
                  Chill
                </button>
                <button
                  type="button"
                  onClick={() => setPace('balanced')}
                  className={`flex-1 py-1 rounded-lg transition ${pace === 'balanced' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500'}`}
                >
                  Balanced
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Transit Mode</label>
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setTransportMode('metro_walk')}
                  className={`flex-1 py-1 rounded-lg transition ${transportMode === 'metro_walk' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500'}`}
                >
                  Metro+Walk
                </button>
                <button
                  type="button"
                  onClick={() => setTransportMode('auto_cab')}
                  className={`flex-1 py-1 rounded-lg transition ${transportMode === 'auto_cab' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500'}`}
                >
                  Auto / Cab
                </button>
              </div>
            </div>
          </div>

          {/* Interests Pills */}
          <div className="space-y-2 pt-1 border-t border-slate-50">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Choose Interests ({selectedInterests.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {interestsList.map(item => {
                const isSelected = selectedInterests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Size */}
          <div className="space-y-1.5 pt-1 border-t border-slate-50">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Group Size</label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setGroupSize('solo')}
                className={`py-2 rounded-xl border transition ${
                  groupSize === 'solo' 
                    ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🎒 Solo
              </button>
              <button
                type="button"
                onClick={() => setGroupSize('couple')}
                className={`py-2 rounded-xl border transition ${
                  groupSize === 'couple' 
                    ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                💑 Couple
              </button>
              <button
                type="button"
                onClick={() => setGroupSize('friends')}
                className={`py-2 rounded-xl border transition ${
                  groupSize === 'friends' 
                    ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                👥 Friends
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-teal-900/15 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing Itinerary...' : 'Generate Optimized Plan'}</span>
          </button>

        </div>

        {/* Quick Plan Presets Section */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">
              1-Tap Tested Presets
            </h3>
            <span className="text-[10px] text-teal-700 font-bold">Ready-to-use</span>
          </div>

          <div className="space-y-2">
            {PRESET_SCENARIOS.map(preset => (
              <div
                key={preset.id}
                onClick={() => handlePresetClick(preset.input)}
                className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-teal-300 active:scale-[0.99] transition group"
              >
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900 group-hover:text-teal-700 transition">
                      {preset.label}
                    </span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      ₹{preset.input.budgetINR}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{preset.description}</p>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-teal-50 group-hover:text-teal-700 flex items-center justify-center text-slate-400 flex-shrink-0 transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
