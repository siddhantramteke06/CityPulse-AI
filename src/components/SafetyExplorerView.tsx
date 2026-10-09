import React, { useState } from 'react';
import { HazardReport, HazardCategory, RouteComparisonScenario } from '../types';
import { LeafletMap } from './LeafletMap';
import { PUNE_ROUTE_SCENARIOS } from '../data/routeComparisons';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ThumbsUp, 
  Filter, 
  CheckCircle2, 
  ArrowRight, 
  Navigation, 
  Sun, 
  Moon, 
  Info,
  Layers,
  Scale
} from 'lucide-react';

interface SafetyExplorerViewProps {
  hazardReports: HazardReport[];
  onUpvoteHazard: (hazardId: string) => void;
  onNavigateToReporting: () => void;
}

export const SafetyExplorerView: React.FC<SafetyExplorerViewProps> = ({
  hazardReports,
  onUpvoteHazard,
  onNavigateToReporting
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'hazards' | 'route_comparison'>('hazards');
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [selectedRouteChoice, setSelectedRouteChoice] = useState<'routeA' | 'routeB'>('routeA');
  const [focusedHazard, setFocusedHazard] = useState<HazardReport | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Hazards' },
    { id: 'road_hazard', label: 'Road Hazards' },
    { id: 'poor_lighting', label: 'Poor Lighting' },
    { id: 'waterlogging', label: 'Waterlogging' },
    { id: 'crowding', label: 'High Congestion' },
    { id: 'cleanliness', label: 'Sanitation' },
    { id: 'metro_work', label: 'Metro Construction' }
  ];

  const filteredHazards = hazardReports.filter(h => {
    if (selectedCategory === 'all') return true;
    return h.category === selectedCategory;
  });

  const activeScenario: RouteComparisonScenario = PUNE_ROUTE_SCENARIOS[selectedScenarioIndex];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Urban Safety & Condition Explorer
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              Sample Demonstration Data
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hazard Map & Route Trade-off Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            View community-flagged road disruptions, lighting gaps, and evaluate comparative urban navigation trade-offs based on evidence.
          </p>
        </div>

        {/* Tab switch between Hazard Map and Route Comparison */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('hazards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'hazards'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Hazard Reports ({filteredHazards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('route_comparison')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'route_comparison'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Safer-Route Comparison</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: HAZARDS MAP & LIST */}
      {activeTab === 'hazards' && (
        <div className="space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter Category:</span>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  selectedCategory === c.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid: Map + Incident Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Map Column */}
            <div className="lg:col-span-7">
              <div className="sticky top-20">
                <LeafletMap
                  hazards={filteredHazards}
                  selectedHazardId={focusedHazard?.id}
                  onSelectHazard={h => setFocusedHazard(h)}
                  center={focusedHazard ? focusedHazard.coordinates : [18.5204, 73.8567]}
                  zoom={focusedHazard ? 15 : 13}
                  height="550px"
                />
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between px-1">
                  <span>Amber/Red pins reflect sample community hazard alerts</span>
                  <button
                    onClick={onNavigateToReporting}
                    className="text-teal-400 hover:underline font-semibold"
                  >
                    + Submit a New Hazard Report
                  </button>
                </div>
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-5 space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredHazards.map(report => {
                const isSelected = focusedHazard?.id === report.id;
                return (
                  <div
                    key={report.id}
                    onClick={() => setFocusedHazard(report)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500/60 shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          report.severity === 'high' ? 'bg-red-950 text-red-400 border border-red-800' :
                          report.severity === 'medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-blue-950 text-blue-400 border border-blue-800'
                        }`}>
                          {report.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-400">{report.timestamp}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        report.verificationStatus === 'Verified' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        report.verificationStatus === 'Resolved' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {report.verificationStatus}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white mb-1">{report.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{report.description}</p>

                    {/* Location & Upvoting */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] truncate">
                        <MapPin className="w-3 h-3 text-teal-400 flex-shrink-0" />
                        <span className="truncate">{report.locationName}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpvoteHazard(report.id);
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                          report.userVoted
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                        title="Confirm report validity"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{report.upvotes}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: SAFER ROUTE COMPARISON INTERFACE */}
      {activeTab === 'route_comparison' && (
        <div className="space-y-6">
          
          {/* Scenario Selector */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Select Transit Corridor Scenario</span>
              <h2 className="text-base font-bold text-white">{activeScenario.title}</h2>
              <p className="text-xs text-slate-400">{activeScenario.context}</p>
            </div>

            <div className="flex items-center gap-2">
              {PUNE_ROUTE_SCENARIOS.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedScenarioIndex(idx);
                    setSelectedRouteChoice('routeA');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedScenarioIndex === idx
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  Scenario {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Route Map Preview */}
          <div>
            <LeafletMap
              routeCoordinates={
                selectedRouteChoice === 'routeA' 
                  ? activeScenario.routeA.pathCoordinates 
                  : activeScenario.routeB.pathCoordinates
              }
              routeColor={selectedRouteChoice === 'routeA' ? '#0D9488' : '#F59E0B'}
              alternativeRouteCoordinates={
                selectedRouteChoice === 'routeA'
                  ? activeScenario.routeB.pathCoordinates
                  : activeScenario.routeA.pathCoordinates
              }
              height="380px"
            />
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span>Solid colored line: Selected route • Dashed grey line: Alternate path</span>
              <span className="text-teal-400 font-semibold">Active Selection: {selectedRouteChoice === 'routeA' ? activeScenario.routeA.name : activeScenario.routeB.name}</span>
            </div>
          </div>

          {/* Side by Side Route Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Route A (Recommended / Commercial) */}
            <div
              onClick={() => setSelectedRouteChoice('routeA')}
              className={`p-5 rounded-3xl border cursor-pointer transition ${
                selectedRouteChoice === 'routeA'
                  ? 'bg-slate-900 border-teal-500/80 shadow-xl ring-1 ring-teal-500/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                  Option 1: Primary Corridor
                </span>
                <span className="text-xs font-bold text-teal-400">
                  {activeScenario.routeA.estimatedTimeMins} mins • {activeScenario.routeA.distanceKm} km
                </span>
              </div>

              <h3 className="font-extrabold text-base text-white mb-1">
                {activeScenario.routeA.name}
              </h3>
              <p className="text-xs text-slate-300 mb-4">{activeScenario.routeA.summary}</p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Street Lighting</span>
                  <div className="flex items-center gap-1 font-bold text-emerald-400 mt-0.5">
                    <Sun className="w-3.5 h-3.5" />
                    <span>{activeScenario.routeA.lightingQuality} ({activeScenario.routeA.lightingScore}/5)</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Active Reported Hazards</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">
                    {activeScenario.routeA.activeHazardsCount} reported
                  </span>
                </div>
              </div>

              {/* Pros & Trade-offs */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-emerald-400 mb-1">Observed Advantages:</h4>
                  <ul className="space-y-1 text-slate-300">
                    {activeScenario.routeA.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-amber-400 mb-1">Known Trade-offs:</h4>
                  <ul className="space-y-1 text-slate-300">
                    {activeScenario.routeA.tradeOffs.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Route B (Alternative / Shortcut) */}
            <div
              onClick={() => setSelectedRouteChoice('routeB')}
              className={`p-5 rounded-3xl border cursor-pointer transition ${
                selectedRouteChoice === 'routeB'
                  ? 'bg-slate-900 border-amber-500/80 shadow-xl ring-1 ring-amber-500/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Option 2: Bypass Shortcut
                </span>
                <span className="text-xs font-bold text-amber-400">
                  {activeScenario.routeB.estimatedTimeMins} mins • {activeScenario.routeB.distanceKm} km
                </span>
              </div>

              <h3 className="font-extrabold text-base text-white mb-1">
                {activeScenario.routeB.name}
              </h3>
              <p className="text-xs text-slate-300 mb-4">{activeScenario.routeB.summary}</p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Street Lighting</span>
                  <div className="flex items-center gap-1 font-bold text-amber-400 mt-0.5">
                    <Moon className="w-3.5 h-3.5" />
                    <span>{activeScenario.routeB.lightingQuality} ({activeScenario.routeB.lightingScore}/5)</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Active Reported Hazards</span>
                  <span className="font-bold text-red-400 mt-0.5 block">
                    {activeScenario.routeB.activeHazardsCount} active alerts
                  </span>
                </div>
              </div>

              {/* Pros & Trade-offs */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-emerald-400 mb-1">Observed Advantages:</h4>
                  <ul className="space-y-1 text-slate-300">
                    {activeScenario.routeB.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-amber-400 mb-1">Known Trade-offs:</h4>
                  <ul className="space-y-1 text-slate-300">
                    {activeScenario.routeB.tradeOffs.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

          </div>

          {/* Methodology Disclaimer */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-300">Objective Route Trade-off Principles</p>
              <p className="mt-0.5">
                CityPulse AI does not make sweeping claims of neighbourhoods being inherently dangerous. We only reflect empirical physical factors such as verified streetlamp status, active civil works, and public transit connectivity.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
