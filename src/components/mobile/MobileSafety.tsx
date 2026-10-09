import React, { useState } from 'react';
import { 
  ArrowLeft, 
  AlertTriangle, 
  MapPin, 
  ThumbsUp, 
  Scale, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Info,
  PhoneCall,
  ShieldCheck,
  Zap,
  TrendingDown,
  ChevronRight,
  ExternalLink,
  Flame,
  Radio
} from 'lucide-react';
import { HazardReport } from '../../types';
import { LeafletMap } from '../LeafletMap';
import { PUNE_ROUTE_SCENARIOS } from '../../data/routeComparisons';

interface MobileSafetyProps {
  hazards: HazardReport[];
  onBack: () => void;
  onUpvoteHazard: (hazardId: string) => void;
  onNavigateToReport: () => void;
}

export const MobileSafety: React.FC<MobileSafetyProps> = ({
  hazards,
  onBack,
  onUpvoteHazard,
  onNavigateToReport
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'reports' | 'routes'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [focusedHazard, setFocusedHazard] = useState<HazardReport | null>(hazards[0] || null);

  // Route comparison state
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('night');
  const [selectedRouteChoice, setSelectedRouteChoice] = useState<'routeA' | 'routeB'>('routeA');

  const activeScenario = PUNE_ROUTE_SCENARIOS[selectedScenarioIdx];

  const categoryIcons = [
    { label: 'Road Work', color: 'bg-amber-500', icon: '🚧', id: 'road_hazard' },
    { label: 'Flooding', color: 'bg-blue-500', icon: '💧', id: 'waterlogging' },
    { label: 'Low Light', color: 'bg-yellow-500', icon: '💡', id: 'poor_lighting' },
    { label: 'Cleanliness', color: 'bg-emerald-500', icon: '🧹', id: 'cleanliness' }
  ];

  const filterChips = ['All', 'Road Hazards', 'Flooding', 'Low Light', 'Cleanliness'];

  const filteredHazards = hazards.filter(h => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Road Hazards') return h.category === 'road_hazard' || h.category === 'metro_work';
    if (selectedCategory === 'Flooding') return h.category === 'waterlogging';
    if (selectedCategory === 'Low Light') return h.category === 'poor_lighting';
    if (selectedCategory === 'Cleanliness') return h.category === 'cleanliness';
    return true;
  });

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col bg-[#F8FAFC]">
      
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
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">Safety Explorer</h2>
            <p className="text-[10px] text-slate-400 font-medium">Pune urban hazards & safe routes</p>
          </div>
        </div>

        <button
          onClick={onNavigateToReport}
          className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-black shadow-sm active:scale-95 transition"
        >
          + Report
        </button>
      </div>

      {/* Emergency SOS Quick-Dial Strip */}
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs z-20">
        <div className="flex items-center gap-1.5 font-bold">
          <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-[11px] text-slate-300">Helplines:</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="tel:112" className="bg-rose-600/80 hover:bg-rose-600 text-white px-2 py-0.5 rounded text-[10px] font-black">
            Police: 112
          </a>
          <a href="tel:1091" className="bg-purple-600/80 hover:bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-black">
            Women: 1091
          </a>
          <a href="tel:108" className="bg-blue-600/80 hover:bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black">
            Ambulance: 108
          </a>
        </div>
      </div>

      {/* Segmented Control [ Map | Reports | Routes ] */}
      <div className="bg-white px-4 py-2 z-20 border-b border-slate-100">
        <div className="bg-slate-100 p-1 rounded-xl flex items-center">
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition ${
              viewMode === 'map' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Hazard Map
          </button>
          <button
            onClick={() => setViewMode('reports')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition ${
              viewMode === 'reports' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Live Reports ({hazards.length})
          </button>
          <button
            onClick={() => setViewMode('routes')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition ${
              viewMode === 'routes' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Safer Routes
          </button>
        </div>
      </div>

      {/* VIEW 1: MAP */}
      {viewMode === 'map' && (
        <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col">
          
          {/* Filter by Category horizontal pills */}
          <div className="bg-white px-4 py-2 flex items-center gap-2 border-b border-slate-100 z-10 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase whitespace-nowrap">Filter:</span>
            {filterChips.map(chip => (
              <button
                key={chip}
                onClick={() => setSelectedCategory(chip)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === chip
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Leaflet Map with Hazards */}
          <div className="relative flex-1 w-full min-h-[500px] h-full">
            <LeafletMap
              places={[]}
              hazards={filteredHazards}
              selectedHazardId={focusedHazard?.id}
              onSelectHazard={(h) => setFocusedHazard(h)}
              center={focusedHazard ? focusedHazard.coordinates : [18.5204, 73.8567]}
              zoom={13}
              height="100%"
            />

            {/* Floating Highlighted Hazard Card */}
            {focusedHazard && (
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-100 shadow-xl space-y-2 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase">
                        {focusedHazard.categoryLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{focusedHazard.timestamp}</span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 mt-1">{focusedHazard.title}</h4>
                  </div>

                  <button
                    onClick={() => onUpvoteHazard(focusedHazard.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
                      focusedHazard.userVoted
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{focusedHazard.upvotes}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-snug">{focusedHazard.description}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <MapPin className="w-3 h-3 text-teal-700" />
                  <span>{focusedHazard.locationName}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: REPORTS LIST */}
      {viewMode === 'reports' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Citizen Verified Reports ({filteredHazards.length})
            </span>
            <button
              onClick={onNavigateToReport}
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              + Submit Report
            </button>
          </div>

          {filteredHazards.length > 0 ? (
            filteredHazards.map(report => (
              <div
                key={report.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2.5 hover:border-teal-200 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-black uppercase">
                        {report.categoryLabel}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        report.severity === 'high' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {report.severity.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{report.title}</h4>
                  </div>

                  <button
                    onClick={() => onUpvoteHazard(report.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition flex-shrink-0 ${
                      report.userVoted
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{report.upvotes}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{report.description}</p>

                {report.photoUrl && (
                  <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-100">
                    <img src={report.photoUrl} alt="Report photo" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-teal-700" />
                    <span className="truncate max-w-[200px]">{report.locationName}</span>
                  </span>
                  <span>{report.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 space-y-2">
              <p className="text-sm font-bold text-slate-700">No hazard reports under this category</p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
              >
                View All Reports
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: SAFER ROUTES COMPARISON TOOL */}
      {viewMode === 'routes' && activeScenario && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          
          {/* Scenario Selector Dropdown */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Route Scenario
            </label>
            <select
              value={selectedScenarioIdx}
              onChange={e => setSelectedScenarioIdx(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
            >
              {PUNE_ROUTE_SCENARIOS.map((sc, idx) => (
                <option key={sc.id} value={idx}>{sc.title}</option>
              ))}
            </select>
          </div>

          {/* Day vs Night Toggle */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="font-extrabold text-xs text-slate-900 block">Travel Timing Condition</span>
              <span className="text-[10px] text-slate-400">Affects lighting and patrol score</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => setTimeOfDay('day')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition ${
                  timeOfDay === 'day' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Day</span>
              </button>
              <button
                onClick={() => setTimeOfDay('night')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition ${
                  timeOfDay === 'night' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Night</span>
              </button>
            </div>
          </div>

          {/* Route A vs Route B Side-by-Side Cards */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Route A (Recommended) */}
            <div 
              onClick={() => setSelectedRouteChoice('routeA')}
              className={`rounded-2xl p-3.5 border transition cursor-pointer relative shadow-sm ${
                selectedRouteChoice === 'routeA'
                  ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200'
              }`}
            >
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider inline-block mb-1.5">
                Safer Choice
              </span>
              <h4 className="font-black text-xs text-slate-900 leading-tight">{activeScenario.routeA.name}</h4>
              <p className="text-[10px] text-slate-500 mt-1">{activeScenario.routeA.distanceKm} km • ~{activeScenario.routeA.estimatedTimeMins} mins</p>

              <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Lighting:</span>
                  <span className="font-bold text-slate-800">{activeScenario.routeA.lightingQuality} ({activeScenario.routeA.lightingScore}/5)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Hazards:</span>
                  <span className="font-bold text-emerald-700">{activeScenario.routeA.activeHazardsCount} reported</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Security:</span>
                  <span className="font-bold text-emerald-700">Metro / Police</span>
                </div>
              </div>
            </div>

            {/* Route B (Shortcut / Less Safe) */}
            <div 
              onClick={() => setSelectedRouteChoice('routeB')}
              className={`rounded-2xl p-3.5 border transition cursor-pointer relative shadow-sm ${
                selectedRouteChoice === 'routeB'
                  ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20'
                  : 'bg-white border-slate-200'
              }`}
            >
              <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[9px] font-black uppercase tracking-wider inline-block mb-1.5">
                Faster Shortcut
              </span>
              <h4 className="font-black text-xs text-slate-900 leading-tight">{activeScenario.routeB.name}</h4>
              <p className="text-[10px] text-slate-500 mt-1">{activeScenario.routeB.distanceKm} km • ~{activeScenario.routeB.estimatedTimeMins} mins</p>

              <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Lighting:</span>
                  <span className="font-bold text-slate-800">{activeScenario.routeB.lightingQuality} ({activeScenario.routeB.lightingScore}/5)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Hazards:</span>
                  <span className="font-bold text-amber-700">{activeScenario.routeB.activeHazardsCount} reported</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Security:</span>
                  <span className="font-bold text-amber-700">Low Patrols</span>
                </div>
              </div>
            </div>

          </div>

          {/* AI Safety Verdict Recommendation Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">
                AI Commuter Safety Recommendation
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {timeOfDay === 'night' 
                ? `At night, take ${activeScenario.routeA.name}. While it takes ~5 mins longer, it offers continuous high-mast LED lighting, active CCTV, and metro security patrols.` 
                : `During daytime hours, ${activeScenario.routeB.name} is passable for quick commutes, but watch for narrow bottlenecks near pedestrian crossings.`}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
